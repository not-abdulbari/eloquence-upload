'use client';

import { useState, useRef } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  maxFiles: number;
  acceptedTypes: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ maxFiles, acceptedTypes, files, onFilesChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFileType = (file: File): boolean => {
    if (!acceptedTypes) return true;
    
    const fileType = file.type;
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    // Check if the file type matches any of the accepted types
    const types = acceptedTypes.split(',');
    return types.some(type => {
      if (type.includes('*')) {
        // Handle wildcards like image/* or video/*
        return fileType.startsWith(type.split('*')[0]);
      } else {
        // Handle specific extensions like .pdf, .doc
        return type.trim() === fileExtension;
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setFileTypeError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Validate file types
    const invalidFile = droppedFiles.find(file => !validateFileType(file));
    if (invalidFile) {
      setFileTypeError(`File "${invalidFile.name}" is not an accepted file type.`);
      return;
    }
    
    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileTypeError(null);
    
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file types
      const invalidFile = selectedFiles.find(file => !validateFileType(file));
      if (invalidFile) {
        setFileTypeError(`File "${invalidFile.name}" is not an accepted file type.`);
        return;
      }
      
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {files.length}/{maxFiles} files selected
            </p>
          </div>
        </div>
      </div>

      {fileTypeError && (
        <div className="mt-2 text-sm text-red-500">
          {fileTypeError}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {maxFiles > 1 && (
        <div className="mt-2 text-xs text-muted-foreground">
          You can upload up to {maxFiles} files. {maxFiles === 2 && "For Reels & Photography, please upload both image and video files."}
        </div>
      )}
    </div>
  );
}
