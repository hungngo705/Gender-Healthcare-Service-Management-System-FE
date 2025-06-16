import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import userService from "../../../services/userService";
import testResultService from "../../../services/testResultService";

function MedicalRecordsTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Fetch current user profile and test results
  useEffect(() => {
    const fetchUserDataAndResults = async () => {
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
        
        // Step 2: Get all test results
        const resultsResponse = await testResultService.getAll();
        console.log("All test results:", resultsResponse);
        
        // Step 3: Filter results for this user
        const allTestResults = resultsResponse.data || [];
        const userTestResults = allTestResults.filter(test => 
          test.customerId === currentUserId
        );
        
        // Process and map the results for display
        const processedResults = userTestResults.map(test => {
          // Extract test type from resultData (e.g., "HIV test: Negative" -> "HIV")
          const testTypeFull = test.resultData.split(':')[0] || '';
          const testType = testTypeFull.replace(' test', '').trim();
          
          // Determine result status
          let resultStatus = 'pending';
          if (test.resultData) {
            if (test.resultData.toLowerCase().includes('negative')) {
              resultStatus = 'negative';
            } else if (test.resultData.toLowerCase().includes('positive')) {
              resultStatus = 'positive'; 
            }
          }
          
          return {
            id: test.stiTestingId,
            testType,
            resultData: test.resultData,
            result: resultStatus,
            status: test.status,
            examinedAt: test.examinedAt,
            sentAt: test.sentAt,
            examiner: test.staff?.name || 'Không có thông tin'
          };
        });
        
        setTestResults(processedResults);
        setError(null);
        
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError("Không thể tải hồ sơ y tế. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserDataAndResults();
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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Hồ sơ y tế</h3>

      {testResults.length === 0 ? (
        // No records found
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Chưa có hồ sơ y tế nào</p>
          <p className="text-sm text-gray-500">
            Hồ sơ y tế của bạn sẽ được hiển thị sau khi bạn sử dụng dịch vụ
          </p>
        </div>
      ) : (
        // Test results table
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kết quả
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xác nhận
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người xác nhận
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testResults.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {test.testType || 'Không xác định'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      test.result === 'positive' ? 'bg-red-100 text-red-800' : 
                      test.result === 'negative' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {test.result === 'positive' ? 'Dương tính' : 
                      test.result === 'negative' ? 'Âm tính' : 
                      'Đang chờ kết quả'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{test.resultData}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.examinedAt ? new Date(test.examinedAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }) : 'Chưa xác nhận'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.examiner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MedicalRecordsTab;
