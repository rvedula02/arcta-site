'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Types for our files
interface UserFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  description?: string;
}

// Profile content component
function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'files'
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVercelEnvironment, setIsVercelEnvironment] = useState(false);

  // Check if running on Vercel
  useEffect(() => {
    // Check for Vercel environment
    const isVercel = typeof window !== 'undefined' && 
      (window.location.hostname.includes('vercel.app') || 
       process.env.NEXT_PUBLIC_VERCEL === '1');
    
    setIsVercelEnvironment(isVercel);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?message=Please sign in to view your profile');
    }
  }, [status, router]);

  // Fetch user's files
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserFiles();
    }
  }, [session]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Function to fetch user files
  const fetchUserFiles = async () => {
    try {
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        setError('Failed to fetch your files. Please try again later.');
      }
    } catch (err) {
      setError('An error occurred while fetching your files.');
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Function to get more detailed file icon based on file type and extension
  const getFileIcon = (fileType: string, fileName: string = '') => {
    // Get file extension
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Image types
    if (fileType.includes('image')) {
      if (fileType.includes('svg')) return '🖌️';
      if (fileType.includes('gif')) return '🎞️';
      return '📷';
    }
    
    // Document types
    if (fileType.includes('pdf') || extension === 'pdf') return '📑';
    if (fileType.includes('csv') || extension === 'csv') return '📊';
    if (fileType.includes('text') || extension === 'txt') return '📝';
    
    // Microsoft Office
    if (fileType.includes('word') || extension === 'doc' || extension === 'docx') return '📘';
    if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
        extension === 'xls' || extension === 'xlsx') return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
        extension === 'ppt' || extension === 'pptx') return '📙';
    
    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'php', 'py', 'java', 'c', 'cpp', 'cs', 'rb'].includes(extension)) {
      return '⌨️';
    }
    
    // Audio files
    if (fileType.includes('audio') || ['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return '🎵';
    
    // Video files
    if (fileType.includes('video') || ['mp4', 'mov', 'avi', 'webm'].includes(extension)) return '🎬';
    
    // Archive files
    if (fileType.includes('zip') || fileType.includes('compressed') || 
        ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return '📦';
        
    // Default file icon
    return '📄';
  };

  // Function to get file type label
  const getFileTypeLabel = (fileType: string, fileName: string = '') => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('text')) return 'Text File';
    if (fileType.includes('word') || extension === 'doc' || extension === 'docx') return 'Word Document';
    if (fileType.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'Spreadsheet';
    if (fileType.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return 'Presentation';
    if (fileType.includes('audio')) return 'Audio File';
    if (fileType.includes('video')) return 'Video File';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'Archive';
    
    // Return capitalized extension if available
    if (extension) {
      return extension.toUpperCase() + ' File';
    }
    
    return 'File';
  };
  
  // Function to get color for file type
  const getFileTypeColor = (fileType: string, fileName: string = '') => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (fileType.includes('image')) return 'bg-blue-500/20 text-blue-400';
    if (fileType.includes('pdf')) return 'bg-red-500/20 text-red-400';
    if (fileType.includes('text')) return 'bg-gray-500/20 text-gray-400';
    if (fileType.includes('word') || extension === 'doc' || extension === 'docx') return 'bg-indigo-500/20 text-indigo-400';
    if (fileType.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'bg-green-500/20 text-green-400';
    if (fileType.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return 'bg-orange-500/20 text-orange-400';
    if (fileType.includes('audio')) return 'bg-purple-500/20 text-purple-400';
    if (fileType.includes('video')) return 'bg-pink-500/20 text-pink-400';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'bg-yellow-500/20 text-yellow-400';
    
    return 'bg-gray-500/20 text-gray-400';
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Clear previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setError(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/files/upload', true);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setSuccess(response.message);
          setDescription('');
          setSelectedFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          fetchUserFiles(); // Refresh the file list
          setActiveTab('files'); // Switch to files tab after successful upload
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.message || 'Failed to upload file.');
        }
        setIsUploading(false);
      };
      
      xhr.onerror = () => {
        setError('An error occurred during upload.');
        setIsUploading(false);
      };
      
      xhr.send(formData);
    } catch (err) {
      setError('An error occurred during upload.');
      setIsUploading(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('File deleted successfully!');
        // Remove the file from the list
        setFiles(files.filter(file => file.id !== fileId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete file.');
      }
    } catch (err) {
      setError('An error occurred while deleting the file.');
    }
  };

  // Early return if loading
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-xl md:text-2xl font-bold text-white">
              {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {session?.user?.firstName} {session?.user?.lastName}
              </h1>
              <p className="text-emerald-400 mb-1">{session?.user?.email}</p>
              <p className="text-gray-400 text-sm">
                {session?.user?.company} • Member since {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Vercel warning banner */}
        {isVercelEnvironment && (
          <div className="rounded-xl p-3 mt-3 flex items-center bg-yellow-500/5 border border-yellow-500/20">
            <div className="text-yellow-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-yellow-200/90 text-xs flex-1">
              Files uploaded in this Vercel environment won't be stored permanently. For production use, consider integrating with cloud storage.
            </p>
          </div>
        )}
        
        {/* Notification banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 mt-3 flex items-center backdrop-blur-sm">
            <div className="bg-red-500/20 rounded-full p-1.5 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-200 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-3 mt-3 flex items-center backdrop-blur-sm">
            <div className="bg-emerald-500/20 rounded-full p-1.5 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-emerald-200 text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-emerald-300 hover:text-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Main content area with tabs */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden mt-8">
          {/* Tab navigation */}
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'upload' 
                ? 'text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-gray-400 hover:text-gray-300'}`}
            >
              Upload New Files
            </button>
            <button 
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'files' 
                ? 'text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-gray-400 hover:text-gray-300'}`}
            >
              My Files {files.length > 0 && `(${files.length})`}
            </button>
          </div>
          
          {/* Upload tab */}
          <div className={`p-4 ${activeTab === 'upload' ? 'block' : 'hidden'}`}>
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Files
              </h2>
              
              <form onSubmit={handleFileUpload} className="space-y-3">
                <div 
                  className={`border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer
                    ${isDragging ? 'border-emerald-400 bg-emerald-400/10' : 'border-gray-700 hover:border-gray-500'} 
                    ${selectedFile ? 'bg-gray-800/50' : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                  />
                  
                  {!selectedFile ? (
                    <div className="py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-auto text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-300 font-medium text-sm">
                        {isDragging ? 'Drop file here' : 'Drag and drop or click to upload'}
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        Max file size: 10MB
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center py-1.5 px-1">
                      <div className="flex-shrink-0 mr-2">
                        {previewUrl ? (
                          <div className="relative rounded-lg overflow-hidden w-10 h-10">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="text-xl w-10 h-10 flex items-center justify-center">
                            {getFileIcon(selectedFile.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="text-emerald-400 text-sm truncate" title={selectedFile.name}>
                          {selectedFile.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                          }
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="py-1 px-2 bg-gray-700 text-white text-xs rounded-full hover:bg-gray-600 ml-2"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-gray-300 text-xs font-medium mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-700 rounded-xl bg-gray-800/50 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    rows={1}
                    placeholder="Add notes about this file..."
                    disabled={isUploading}
                  ></textarea>
                </div>
                
                {isUploading && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-200" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="flex-1 py-1.5 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </button>
                  
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                        }
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="py-1.5 px-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Files tab */}
          <div className={`p-5 ${activeTab === 'files' ? 'block' : 'hidden'}`}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Your Files
            </h2>
            
            {files.length === 0 ? (
              <div className="text-center py-8 bg-gray-800/30 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293L6.586 13H4" />
                </svg>
                <p className="text-gray-400 mb-3">You haven't uploaded any files yet.</p>
                <button 
                  onClick={() => setActiveTab('upload')} 
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  Upload Your First File
                </button>
              </div>
            ) : (
              <div className="overflow-x-hidden overflow-y-auto max-h-[calc(100vh-240px)]">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {files.map((file) => (
                    <div key={file.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all hover:translate-y-[-2px] hover:shadow-lg flex flex-col">
                      <div className="p-3 flex-1">
                        <div className="flex items-start mb-2">
                          <div className={`${getFileTypeColor(file.fileType, file.fileName)} p-2 rounded-lg mr-2 text-lg flex items-center justify-center min-w-[36px]`}>
                            <span>{getFileIcon(file.fileType, file.fileName)}</span>
                          </div>
                          <div className="overflow-hidden flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate text-sm" title={file.fileName}>
                              {file.fileName}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${getFileTypeColor(file.fileType, file.fileName)}`}>
                                {getFileTypeLabel(file.fileType, file.fileName)}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-300 text-xs">
                                {formatFileSize(file.fileSize)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {file.description && (
                          <p className="text-xs text-gray-300 mb-2 line-clamp-2 bg-gray-800/30 p-2 rounded-lg border border-gray-700">
                            {file.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between p-2 mt-auto border-t border-gray-700/50 bg-gray-800/30">
                        <div className="text-xs text-gray-400">
                          {new Date(file.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex space-x-1">
                          <Link 
                            href={`/api/files/${file.id}/download`} 
                            className="flex items-center justify-center py-1 px-2 text-xs bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </Link>
                          <button 
                            onClick={() => handleDeleteFile(file.id)}
                            className="flex items-center justify-center py-1 px-2 text-xs bg-red-900/70 hover:bg-red-900 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading state
function ProfileLoading() {
  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header skeleton */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-800 rounded w-64 animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-800 rounded w-48 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-800">
            <div className="flex-1 py-4">
              <div className="h-5 bg-gray-800 rounded w-32 animate-pulse mx-auto"></div>
            </div>
            <div className="flex-1 py-4">
              <div className="h-5 bg-gray-800 rounded w-24 animate-pulse mx-auto"></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-6 bg-gray-800 rounded w-48 animate-pulse mb-6"></div>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-gray-800 rounded-lg animate-pulse mb-4"></div>
                <div className="h-5 bg-gray-800 rounded w-64 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
} 