// Eloquence'25 Event Submission System - Cloudflare Worker
// This worker handles form submissions, file uploads to R2, and data retrieval using D1 database

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Add CORS headers to all responses
    const responseInit = {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    };

    try {
      // Route handling
      if (path === '/api/submit' && request.method === 'POST') {
          return await handleSubmission(request, env, responseInit);
      } else if (path === '/api/submissions' && request.method === 'GET') {
        return await getSubmissions(request, env, responseInit);
      } else if (path === '/api/submissions/stats' && request.method === 'GET') {
        return await getStats(request, env, responseInit);
      } else if (path === '/api/submissions' && request.method === 'PUT') {
        return await updateSubmissionStatus(request, env, responseInit);
      }

      // Route not found
      return new Response(JSON.stringify({ error: 'Not found' }), {
        ...responseInit,
        status: 404,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        ...responseInit,
        status: 500,
      });
    }
  },
};

// Generate a unique ID for submissions
function generateId(prefix = 'sub_') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Handle form submissions with file uploads
async function handleSubmission(request, env, responseInit) {
  const formData = await request.formData();

  // Log keys for debugging
  try {
    const keys = Array.from(formData.keys());
    console.log('Worker: form keys:', keys);
  } catch (e) {
    console.log('Worker: could not list form keys', e);
  }

  // Check required bindings early and return helpful errors if missing
  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: 'D1 binding `DB` is not configured. Please add a D1 binding in wrangler.toml or Cloudflare dashboard.' }), responseInit);
  }
  if (!env.BUCKET) {
    return new Response(JSON.stringify({ error: 'R2 binding `BUCKET` is not configured. Please add an R2 bucket binding in wrangler.toml or Cloudflare dashboard.' }), responseInit);
  }
  
  // Extract submission details
  const fullName = formData.get('fullName');
  const collegeName = formData.get('collegeName');
  const branch = formData.get('branch');
  const contactEmail = formData.get('contactEmail');
  const contactPhone = formData.get('contactPhone');
  const eventType = formData.get('eventType');
  const projectTitle = formData.get('projectTitle');
  const gitUrl = formData.get('gitUrl');
  
  // Validate required fields
  if (!fullName || !collegeName || !branch || !contactEmail || !contactPhone || !eventType || !projectTitle) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      ...responseInit,
      status: 400,
    });
  }

  // Generate a unique submission ID
  const submissionId = generateId();

  // Create submission record in D1 database
  try {
    await env.DB.prepare(`
      INSERT INTO submissions (id, fullName, collegeName, branch, contactEmail, contactPhone, eventType, projectTitle, gitUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      submissionId,
      fullName,
      collegeName,
      branch,
      contactEmail,
      contactPhone,
      eventType,
      projectTitle,
      gitUrl || null
    ).run();
  } catch (dbErr) {
    console.error('D1 insert error:', dbErr);
    return new Response(JSON.stringify({ error: 'Database insert failed', details: String(dbErr) }), {
      ...responseInit,
      status: 500,
    });
  }

  // Handle file uploads for all event types except Web Designing (which requires gitUrl)
  if (eventType !== 'Web Designing') {
    // Support both 'files' multi-key and legacy 'file1','file2' keys
    let allFiles = formData.getAll('files') || [];
    if (!allFiles || allFiles.length === 0) {
      const legacyKeys = Array.from(formData.keys()).filter(k => /^file\d+$/.test(k));
      for (const k of legacyKeys) {
        const f = formData.get(k);
        if (f) allFiles.push(f);
      }
    }

    if (!allFiles || allFiles.length === 0) {
      return new Response(JSON.stringify({ error: 'No files uploaded' }), {
        ...responseInit,
        status: 400,
      });
    }

    // Process each file
    for (const file of allFiles) {
      try {
        // File may be a Blob in some runtimes; attempt to read metadata
        const fileName = (file && file.name) || `upload-${Date.now()}`;
        const fileType = (file && file.type) || 'application/octet-stream';
        const fileSize = (file && file.size) || 0;

        // Generate a unique file name to prevent collisions
        const uniqueFileName = `${submissionId}/${Date.now()}-${fileName}`;

        // Upload file to R2 bucket
        await env.BUCKET.put(uniqueFileName, file);

        // Generate public URL for the file
        const fileUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;

        // Add file info to database
        const fileId = generateId('file_');
        await env.DB.prepare(`
          INSERT INTO files (id, submissionId, fileName, fileType, fileSize, fileUrl)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          fileId,
          submissionId,
          fileName,
          fileType,
          fileSize,
          fileUrl
        ).run();
      } catch (err) {
        console.error('Error processing one uploaded file:', err);
        // continue with other files
      }
    }
  } else if (!gitUrl) {
    // Web Designing submissions require a Git URL
    return new Response(JSON.stringify({ error: 'Git URL is required for Web Designing submissions' }), {
      ...responseInit,
      status: 400,
    });
  }

  // Retrieve the created submission with its files
  let submission;
  try {
    submission = await getSubmissionById(submissionId, env);
  } catch (err) {
    console.error('Error retrieving submission after insert:', err);
    return new Response(JSON.stringify({ error: 'Failed to retrieve submission', details: String(err) }), {
      ...responseInit,
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, submission }), responseInit);
}

// Helper function to get a submission by ID with its files
async function getSubmissionById(id, env) {
  const submission = await env.DB.prepare(`
    SELECT * FROM submissions WHERE id = ?
  `).bind(id).first();
  
  if (!submission) {
    return null;
  }
  
  // Get files for this submission
  const files = await env.DB.prepare(`
    SELECT id, fileName, fileType, fileSize, fileUrl, uploadedAt
    FROM files WHERE submissionId = ?
  `).bind(id).all();
  
  return {
    ...submission,
    files: files.results || []
  };
}

// Get submissions with optional filtering by event type
async function getSubmissions(request, env, responseInit) {
  const url = new URL(request.url);
  const eventType = url.searchParams.get('eventType');
  const status = url.searchParams.get('status');
  
  let query = `SELECT * FROM submissions`;
  const conditions = [];
  const params = [];
  
  if (eventType) {
    conditions.push(`eventType = ?`);
    params.push(eventType);
  }
  
  if (status) {
    conditions.push(`status = ?`);
    params.push(status);
  }
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  query += ` ORDER BY submittedAt DESC`;
  
  const stmt = env.DB.prepare(query);
  const bindStmt = params.reduce((acc, param) => acc.bind(param), stmt);
  const result = await bindStmt.all();
  
  // For each submission, get its files
  const submissions = [];
  for (const sub of result.results || []) {
    const files = await env.DB.prepare(`
      SELECT id, fileName, fileType, fileSize, fileUrl, uploadedAt
      FROM files WHERE submissionId = ?
    `).bind(sub.id).all();
    
    submissions.push({
      ...sub,
      files: files.results || []
    });
  }
  
  return new Response(JSON.stringify({ submissions }), responseInit);
}

// Update submission status (approve/reject)
async function updateSubmissionStatus(request, env, responseInit) {
  const { id, status } = await request.json();
  
  if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid submission ID or status' }), {
      ...responseInit,
      status: 400,
    });
  }
  
  await env.DB.prepare(`
    UPDATE submissions SET status = ? WHERE id = ?
  `).bind(status, id).run();
  
  return new Response(JSON.stringify({ success: true }), responseInit);
}

// Get submission statistics for admin dashboard
async function getStats(request, env, responseInit) {
  // Get total count
  const totalResult = await env.DB.prepare(`
    SELECT COUNT(*) as count FROM submissions
  `).first();
  
  // Count by event type
  const byEventTypeResult = await env.DB.prepare(`
    SELECT eventType, COUNT(*) as count FROM submissions GROUP BY eventType
  `).all();
  
  // Count by status
  const byStatusResult = await env.DB.prepare(`
    SELECT status, COUNT(*) as count FROM submissions GROUP BY status
  `).all();
  
  // Format the results
  const byEventType = {};
  (byEventTypeResult.results || []).forEach(row => {
    byEventType[row.eventType] = row.count;
  });
  
  const byStatus = {};
  (byStatusResult.results || []).forEach(row => {
    byStatus[row.status] = row.count;
  });
  
  // Ensure all event types and statuses are represented
  const eventTypes = ['Paper Presentation', 'Web Designing', 'Reels & Photography', 'Code Debugging'];
  const statuses = ['pending', 'approved', 'rejected'];
  
  eventTypes.forEach(type => {
    if (byEventType[type] === undefined) byEventType[type] = 0;
  });
  
  statuses.forEach(status => {
    if (byStatus[status] === undefined) byStatus[status] = 0;
  });
  
  const stats = {
    total: totalResult.count || 0,
    byEventType,
    byStatus
  };
  
  return new Response(JSON.stringify({ stats }), responseInit);
}