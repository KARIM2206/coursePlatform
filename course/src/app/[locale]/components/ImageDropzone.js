// components/ImageDropzone.js
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageDropzone({setImage, courseImage }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file); // Pass the file to the parent component
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-md"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag & drop an image here, or click to select</p>
      )}

      {preview && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">Image Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-60 object-contain mx-auto border rounded"
          />
        </div>
      )}
    </div>
  );
}
