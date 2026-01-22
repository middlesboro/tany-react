import React, { useState } from 'react';
import { uploadProductImages, deleteProductImage } from '../services/productAdminService';

const ProductImageManager = ({ productId, images = [], onImagesChange, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      await uploadProductImages(productId, selectedFiles);
      setSelectedFiles(null);
      // Reset file input value
      document.getElementById('file-upload').value = '';
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Failed to upload images", error);
      alert("Failed to upload images");
    }
  };

  const handleDelete = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteProductImage(productId, imageUrl);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("Failed to delete image");
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    if (direction === 'left' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'right' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    onImagesChange(newImages);
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-4">Product Images</h2>

      {/* Upload Section */}
      <div className="mb-4 flex items-center gap-4">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFiles}
          className={`px-4 py-2 rounded text-white ${
            !selectedFiles ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Upload
        </button>
      </div>

      {/* Gallery Section */}
      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative border p-2 rounded group">
              <button
                onClick={() => handleDelete(img)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-75 hover:opacity-100 z-10"
                title="Delete Image"
              >
                &times;
              </button>
              <img
                src={img}
                alt={`Product ${index}`}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => moveImage(index, 'left')}
                  disabled={index === 0}
                  className={`px-2 py-1 text-sm rounded ${
                    index === 0 ? 'text-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  &larr;
                </button>
                <span className="text-sm text-gray-500">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'right')}
                  disabled={index === images.length - 1}
                  className={`px-2 py-1 text-sm rounded ${
                    index === images.length - 1 ? 'text-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No images available.</p>
      )}
    </div>
  );
};

export default ProductImageManager;
