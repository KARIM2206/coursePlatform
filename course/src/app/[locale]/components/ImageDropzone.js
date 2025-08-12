'use client';

import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageDropzone({ setFile, initialFile = null, accept = 'both' }) {
  const [previewUrl, setPreviewUrl] = useState(initialFile);
  const [fileType, setFileType] = useState(null);

  // تعيين نوع الملف المسموح به
  const getAcceptMimeType = () => {
    if (accept === 'image') return 'image/*';
    if (accept === 'video') return 'video/*';
    return 'image/*,video/*';
  };

  // لما initialFile يتغير حتى بعد أول مرة
  useEffect(() => {
    if (!initialFile) return;

    setPreviewUrl(initialFile);
    const ext = initialFile.split('.').pop().toLowerCase();
    setFileType(['mp4', 'webm', 'ogg'].includes(ext) ? 'video' : 'image');
  }, [initialFile]);

  // تنظيف preview من الـ blob
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFile(file);
    setFileType(file.type.startsWith('video') ? 'video' : 'image');
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFile(null);
    setFileType(null);
  };

  return (
    <div>
      <label className="font-semibold mb-1 block">Upload File</label>
      <label className="block border-2 border-dashed p-4 rounded cursor-pointer text-center hover:border-gray-400">
        <UploadCloud className="mx-auto mb-2 h-6 w-6 text-gray-500" />
        <p className="text-sm text-gray-500">Click to upload {accept}</p>
        <input
          type="file"
          accept={getAcceptMimeType()}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div className="mt-4 relative group w-fit mx-auto">
          {fileType === 'image' ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover rounded-lg w-full h-32"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              className="rounded-lg w-full h-32 object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
