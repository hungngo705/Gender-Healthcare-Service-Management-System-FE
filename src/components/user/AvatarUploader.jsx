import React, { useState } from "react";
import { Upload, X, Check, User } from "lucide-react";
import UserAvatar from "./UserAvatar";
import userUtils from "../../utils/userUtils";

/**
 * Component for uploading and managing user profile photos
 */
function AvatarUploader() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const { currentUser } = userUtils.useUserInfo();

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Vui lòng chọn file ảnh (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > maxSize) {
      setUploadError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      setUploadError(null);
    };
    fileReader.readAsDataURL(file);
  };

  // Upload avatar to server
  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // TODO: Implement actual upload API call here
      // Example:
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await apiService.upload('/user/avatar', formData);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success handling
      console.log("Avatar uploaded successfully");
      setIsUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Không thể tải ảnh lên. Vui lòng thử lại.");
      setIsUploading(false);
    }
  };

  // Cancel upload
  const handleCancel = () => {
    setPreviewUrl(null);
    setUploadError(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        ) : (
          <UserAvatar size="xl" />
        )}
      </div>

      {!previewUrl && (
        <div className="mb-4 flex flex-col items-center">
          <label className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md cursor-pointer hover:bg-indigo-100 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            <span>Chọn ảnh</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {uploadError && (
        <div className="text-red-500 text-sm mb-2">{uploadError}</div>
      )}

      {previewUrl && (
        <div className="flex space-x-2">
          <button
            className="flex items-center justify-center px-1 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tải lên...
              </span>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" />
                Lưu
              </>
            )}
          </button>
          <button
            className="flex items-center justify-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-1" />
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
