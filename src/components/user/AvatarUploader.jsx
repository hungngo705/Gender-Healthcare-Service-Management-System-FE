import React, { useState } from "react";
import { Upload, X, Check, Link, Image } from "lucide-react";
import UserAvatar from "./UserAvatar";
import userUtils from "../../utils/userUtils";
import userService from "../../services/userService";

/**
 * Component for uploading and managing user profile photos
 */
function AvatarUploader() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "url"

  const { currentUser } = userUtils.useUserInfo(); // Handle file selection
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

    // Store the selected file
    setSelectedFile(file);
    setImageUrl("");

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      setUploadError(null);
    };
    fileReader.readAsDataURL(file);
  };

  // Handle URL input
  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
    setSelectedFile(null);
    setUploadError(null);
  };

  // Preview image from URL
  const handleUrlPreview = () => {
    if (!imageUrl) {
      setUploadError("Vui lòng nhập URL hình ảnh");
      return;
    }
    const isValidUrl = /^(https?:\/\/)([\w.-]+)([\/\w.-]*)*\/?$/.test(imageUrl);

    if (!isValidUrl) {
      setUploadError("URL không hợp lệ. Vui lòng nhập đúng định dạng URL");
      return;
    }

    // Set preview URL to input URL
    setPreviewUrl(imageUrl);
    setUploadError(null);
  }; // Upload avatar to server
  const handleUpload = async () => {
    if (!previewUrl || (!selectedFile && !imageUrl) || !currentUser?.id) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      let result;

      if (selectedFile) {
        // File upload method
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        console.log("Uploading avatar file");
        console.log("File details:", {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        }); // Upload avatar using userService
        result = await userService.updateUserAvatar(formData);
      } else if (imageUrl) {
        // URL upload method
        console.log("Uploading avatar URL");
        console.log("URL:", imageUrl); // For pravatar.cc, add a unique identifier to prevent caching
        let finalImageUrl = imageUrl;
        if (imageUrl.includes("pravatar.cc")) {
          // Add a random query parameter to avoid caching
          finalImageUrl = `${imageUrl}${
            imageUrl.includes("?") ? "&" : "?"
          }r=${Math.random()}`;
          console.log(
            "Modified pravatar URL to prevent caching:",
            finalImageUrl
          );
        }

        // Upload avatar URL
        result = await userService.updateUserAvatarUrl({
          avatarUrl: finalImageUrl,
        });
      }
      console.log("Avatar upload successful:", result);

      // Success handling
      setIsUploading(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      setImageUrl("");

      // Show success message
      setUploadError("Ảnh đại diện đã được cập nhật thành công!");

      // Update user data in local storage
      try {
        // Get the latest user profile data from the server
        const updatedProfile = await userService.getCurrentUserProfile();
        console.log("Updated profile:", updatedProfile);

        // Update the local storage with the new data
        if (updatedProfile) {
          const currentUserData = JSON.parse(
            localStorage.getItem("user") || "{}"
          ); // If we used pravatar URL directly and the profile doesn't have it yet, use our URL
          const avatarUrlToUse =
            updatedProfile.avatarUrl ||
            imageUrl ||
            (selectedFile ? URL.createObjectURL(selectedFile) : null);

          console.log("Avatar URL to use:", avatarUrlToUse);

          const updatedUserData = {
            ...currentUserData,
            avatarUrl: avatarUrlToUse,
            avatar: avatarUrlToUse, // Add both fields to ensure compatibility
            profileImage: avatarUrlToUse,
          };

          // Update user data in localStorage
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          console.log("User data updated in localStorage", updatedUserData);

          // Reload the page after a short delay to show updated avatar
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (profileError) {
        console.error("Failed to update profile data:", profileError);

        // Still reload the page after a delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      let errorMessage = "Không thể tải ảnh lên. Vui lòng thử lại.";

      // Provide more specific error messages based on error type
      if (error.response?.status === 413) {
        errorMessage = "File quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.";
      } else if (error.response?.status === 415) {
        errorMessage = "Định dạng file không được hỗ trợ.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setUploadError(errorMessage);
      setIsUploading(false);
    }
  }; // Cancel upload
  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setImageUrl("");
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
      </div>{" "}
      {!previewUrl && (
        <div className="mb-4 flex flex-col items-center">
          <div className="flex mb-3 bg-gray-100 rounded-md p-1">
            <button
              type="button"
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                uploadMethod === "file"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setUploadMethod("file")}
            >
              <Upload className="w-3 h-3 inline mr-1" />
              Tải tệp
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                uploadMethod === "url"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setUploadMethod("url")}
            >
              <Link className="w-3 h-3 inline mr-1" />
              Dùng URL
            </button>
          </div>

          {uploadMethod === "file" ? (
            <label className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md cursor-pointer hover:bg-indigo-100 transition-colors">
              <Image className="w-4 h-4 mr-2" />
              <span>Chọn ảnh</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Nhập URL hình ảnh"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
                <button
                  type="button"
                  onClick={handleUrlPreview}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-sm"
                >
                  Xem
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Nhập URL đầy đủ hợp lệ đến hình ảnh
              </p>
            </div>
          )}
        </div>
      )}{" "}
      {uploadError && (
        <div
          className={`text-sm mb-2 ${
            uploadError.includes("thành công")
              ? "text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-md"
              : "text-red-500"
          }`}
        >
          {uploadError}
        </div>
      )}{" "}
      {previewUrl && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">
            File: {selectedFile?.name} (
            {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
          </div>
          <div className="flex space-x-2">
            <button
              className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center justify-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="w-4 h-4 mr-1" />
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
