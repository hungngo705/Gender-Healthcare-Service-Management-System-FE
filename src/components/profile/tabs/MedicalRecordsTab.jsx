import React, { useState, useEffect } from "react";
import { FileText, Calendar, FlaskConical } from "lucide-react";
import userService from "../../../services/userService";
import STITestingHistory from "./STITestingHistory";
import STITestResults from "./STITestResults";

function MedicalRecordsTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("process"); // 'process' hoặc 'results'
  const [userId, setUserId] = useState(null);

  // Fetch current user profile and all data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Step 1: Get current user profile
        const userResponse = await userService.getCurrentUserProfile();
        console.log("User profile:", userResponse);

        // Extract user ID from response
        const currentUserId = userResponse.id || userResponse.data?.id;
        setUserId(currentUserId);

        if (!currentUserId) {
          throw new Error("Không thể xác định người dùng hiện tại");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hồ sơ y tế</h3>
        <div className="text-center py-8">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Đang tải hồ sơ y tế...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hồ sơ y tế</h3>
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <FileText size={48} className="mx-auto text-red-400" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                currentTab === "process"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setCurrentTab("process")}
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Quy trình xét nghiệm</span>
              </div>
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                currentTab === "results"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setCurrentTab("results")}
            >
              <div className="flex items-center">
                <FlaskConical className="w-5 h-5 mr-2" />
                <span>Kết quả xét nghiệm</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on selected tab */}
      {currentTab === "process" ? (
        <STITestingHistory userId={userId} />
      ) : (
        <STITestResults userId={userId} />
      )}
    </div>
  );
}

export default MedicalRecordsTab;
