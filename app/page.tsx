'use client';

import { useState } from 'react';
import { EventHeader, EventBanner } from '@/components/event-header';
import { ProgressIndicator } from '@/components/progress-indicator';
import { FileUpload } from '@/components/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

type EventType = 'Paper Presentation' | 'Web Designing' | 'Reels & Photography' | 'Code Debugging' | '';

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [eventType, setEventType] = useState<EventType>('');
  const [projectTitle, setProjectTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [gitUrl, setGitUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      let fileUrl1 = null;
      let fileUrl2 = null;

      if (files.length > 0 && eventType !== 'Web Designing') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${i}.${fileExt}`;
          const filePath = `${eventType}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('submissions')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('submissions')
            .getPublicUrl(filePath);

          if (i === 0) fileUrl1 = publicUrl;
          if (i === 1) fileUrl2 = publicUrl;
        }
      }

      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          full_name: fullName,
          college_name: collegeName,
          year,
          branch,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          event_type: eventType,
          project_title: projectTitle,
          file_url_1: fileUrl1,
          file_url_2: fileUrl2,
          git_repository_url: eventType === 'Web Designing' ? gitUrl : null,
        });

      if (insertError) throw insertError;

      setSubmitMessage('Submission successful! Thank you for registering.');

      setFullName('');
      setCollegeName('');
      setYear('');
      setBranch('');
      setContactEmail('');
      setContactPhone('');
      setEventType('');
      setProjectTitle('');
      setFiles([]);
      setGitUrl('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaxFiles = () => {
    if (eventType === 'Reels & Photography') return 2;
    if (eventType === 'Paper Presentation' || eventType === 'Code Debugging') return 1;
    return 0;
  };

  const showFileUpload = eventType && eventType !== 'Web Designing';
  const showGitUrl = eventType === 'Web Designing';

  return (
    <div className="min-h-screen">
      <EventHeader />
      <EventBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Submission Form</CardTitle>
            <CardDescription>* indicates required field</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressIndicator />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collegeName">College Name *</Label>
                    <Input
                      id="collegeName"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      required
                      placeholder="Enter your college name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Select value={year} onValueChange={setYear} required>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st</SelectItem>
                        <SelectItem value="2nd">2nd</SelectItem>
                        <SelectItem value="3rd">3rd</SelectItem>
                        <SelectItem value="4th">4th</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Input
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                      placeholder="e.g., CSE, IT, ECE"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Selection</h3>

                <div className="space-y-2">
                  <Label>Select Your Event *</Label>
                  <RadioGroup value={eventType} onValueChange={(value) => setEventType(value as EventType)} required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Paper Presentation" id="paper" />
                      <Label htmlFor="paper" className="font-normal cursor-pointer">
                        Paper Presentation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Web Designing" id="web" />
                      <Label htmlFor="web" className="font-normal cursor-pointer">
                        Web Designing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Reels & Photography" id="reels" />
                      <Label htmlFor="reels" className="font-normal cursor-pointer">
                        Reels & Photography
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Code Debugging" id="code" />
                      <Label htmlFor="code" className="font-normal cursor-pointer">
                        Code Debugging
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {eventType && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Submission Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project/Submission Title *</Label>
                    <Input
                      id="projectTitle"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      required
                      placeholder="Enter your project title"
                    />
                  </div>

                  {showFileUpload && (
                    <div className="space-y-2">
                      <Label>Upload Files *</Label>
                      <FileUpload
                        maxFiles={getMaxFiles()}
                        acceptedTypes={
                          eventType === 'Reels & Photography'
                            ? 'image/*,video/*'
                            : '.pdf,.ppt,.pptx,.doc,.docx,.txt,.zip'
                        }
                        files={files}
                        onFilesChange={setFiles}
                      />
                    </div>
                  )}

                  {showGitUrl && (
                    <div className="space-y-2">
                      <Label htmlFor="gitUrl">Git Repository URL *</Label>
                      <Input
                        id="gitUrl"
                        type="url"
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        required
                        placeholder="https://github.com/username/repository"
                      />
                    </div>
                  )}
                </div>
              )}

              {submitMessage && (
                <div className={`p-4 rounded-lg ${submitMessage.includes('successful') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                  {submitMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
