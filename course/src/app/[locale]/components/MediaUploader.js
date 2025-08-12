'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export default function MediaUploader({ setImage, courseImage, setVideos, existingVideos = [] }) {
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [videos, setLocalVideos] = useState(existingVideos);
  const [videoUploadProgress, setVideoUploadProgress] = useState({});

  // Initialize with courseImage if it exists
  useEffect(() => {
    if (courseImage) {
      if (typeof courseImage === 'string') {
        console.log('courseImage is a string:', courseImage);
        
        setPreview(courseImage);
      } else {
        const previewUrl = URL.createObjectURL(courseImage);
        setPreview(previewUrl);
      }
    }
  }, [courseImage]);

  const onImageDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setEditedImage(null);
      setEditMode(false);
    }
  }, [setImage]);

  const onVideoDrop = useCallback((acceptedFiles) => {
    const newVideos = [...videos];
    acceptedFiles.forEach((file) => {
      // Simulate upload progress
      const videoId = Date.now() + Math.random().toString(36).substring(2);
      setVideoUploadProgress(prev => ({ ...prev, [videoId]: 0 }));
      
      // Simulate upload completion after 2 seconds
      setTimeout(() => {
        newVideos.push({
          id: videoId,
          file,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
        });
        setLocalVideos(newVideos);
        setVideos(newVideos);
        setVideoUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[videoId];
          return newProgress;
        });
      }, 2000);

      // Simulate progress updates
      const interval = setInterval(() => {
        setVideoUploadProgress(prev => {
          const currentProgress = prev[videoId] || 0;
          return {
            ...prev,
            [videoId]: currentProgress < 90 ? currentProgress + 10 : currentProgress
          };
        });
      }, 200);
    });
  }, [videos, setVideos]);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onImageDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: onVideoDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
    multiple: true,
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (editedImage) {
      fetch(editedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "edited-image.png", { type: 'image/png' });
          setImage(file);
          setPreview(editedImage);
          setEditMode(false);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedImage(null);
  };

  const handleImageEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = (id) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setLocalVideos(updatedVideos);
    setVideos(updatedVideos);
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        {!editMode ? (
          <div
            {...getImageRootProps()}
            className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-md hover:bg-gray-50 transition-colors"
          >
            <input {...getImageInputProps()} />
            <p className="text-gray-600">Drag & drop course image here, or click to select</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-400 p-6 text-center rounded-md">
            <input 
              type="file" 
              onChange={handleImageEdit} 
              accept="image/*"
              className="mb-4"
            />
            <div className="flex gap-2 justify-center">
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Edits
              </button>
              <button 
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {(preview || editedImage) && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Course Image Preview:</p>
              {!editMode && (
                <button 
                  onClick={handleEdit}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Edit Image
                </button>
              )}
            </div>
            <img
              src={editedImage || preview}
              alt="Course Preview"
              className="max-w-full max-h-80 object-contain mx-auto border rounded"
            />
          </div>
        )}
      </div>

      {/* Video Upload Section (Only in edit mode) */}
      {editMode && (
        <div className="space-y-4">
          <div
            {...getVideoRootProps()}
            className="border-2 border-dashed border-blue-400 p-6 text-center cursor-pointer rounded-md hover:bg-blue-50 transition-colors"
          >
            <input {...getVideoInputProps()} />
            <p className="text-blue-600">Drag & drop course videos here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: MP4, MOV, AVI</p>
          </div>

          {videos.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="font-semibold">Course Videos:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-3 flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-medium truncate">{video.name}</span>
                      <button 
                        onClick={() => removeVideo(video.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                    {videoUploadProgress[video.id] !== undefined ? (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${videoUploadProgress[video.id]}%` }}
                        ></div>
                      </div>
                    ) : (
                      <video 
                        src={video.url} 
                        controls
                        className="mt-2 w-full h-auto max-h-40 object-contain rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}