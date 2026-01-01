import React, { useState } from 'react';
import { uploadBrandImage } from '../services/brandAdminService';

const BrandImageManager = ({ brandId, image, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadBrandImage(brandId, selectedFile);
      setSelectedFile(null);
      // Reset file input value
      document.getElementById('file-upload').value = '';
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-4">Brand Image</h2>

      {/* Upload Section */}
      <div className="mb-4 flex items-center gap-4">
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`px-4 py-2 rounded text-white ${
            !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Upload
        </button>
      </div>

      {/* Gallery Section */}
      {image ? (
        <div className="border p-2 rounded w-64">
           <img
             src={image}
             alt="Brand"
             className="w-full h-auto object-cover rounded"
           />
        </div>
      ) : (
        <p className="text-gray-500">No image available.</p>
      )}
    </div>
  );
};

export default BrandImageManager;
