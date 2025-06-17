import React, { useState } from "react";
import { Calendar, CheckCircle, AlertTriangle, Loader } from "lucide-react";
import menstrualCycleService from "../../services/menstrualCycleService";

const LogCycleForm = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    cycleStartDate: today,
    cycleEndDate: "", // Có thể để trống nếu chu kỳ vẫn đang diễn ra
    symptoms: "",
    notes: "",
    notifyBeforeDays: 7,
    notificationEnabled: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate form data
    if (!formData.cycleStartDate) {
      setError("Vui lòng chọn ngày bắt đầu chu kỳ");
      setLoading(false);
      return;
    }

    try {
      // Prepare data
      const payload = {
        ...formData,
        // Convert empty string to null if cycleEndDate is empty
        cycleEndDate: formData.cycleEndDate || null,
      };

      // Call the API
      const response = await menstrualCycleService.createTracking(payload);

      // Handle success
      setSuccess(true);
      setFormData({
        cycleStartDate: today,
        cycleEndDate: "",
        symptoms: "",
        notes: "",
        notifyBeforeDays: 7,
        notificationEnabled: true,
      });

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lưu dữ liệu chu kỳ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Ghi Nhận Chu Kỳ Kinh Nguyệt
      </h2>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-600">Đã lưu thông tin chu kỳ thành công!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cycle Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu chu kỳ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="cycleStartDate"
                  value={formData.cycleStartDate}
                  onChange={handleInputChange}
                  max={today}
                  required
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Cycle End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc chu kỳ{" "}
                <span className="text-gray-400 text-xs">
                  (để trống nếu đang diễn ra)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="cycleEndDate"
                  value={formData.cycleEndDate}
                  onChange={handleInputChange}
                  min={formData.cycleStartDate}
                  max={today}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Triệu chứng
            </label>
            <textarea
              name="symptoms"
              rows={3}
              value={formData.symptoms}
              onChange={handleInputChange}
              placeholder="Ví dụ: đau bụng nhẹ, mệt mỏi, v.v."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú thêm về chu kỳ của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notification Settings */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cài đặt thông báo
            </h3>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notificationEnabled"
                name="notificationEnabled"
                checked={formData.notificationEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="notificationEnabled"
                className="ml-2 block text-sm text-gray-700"
              >
                Bật thông báo cho chu kỳ này
              </label>
            </div>

            {formData.notificationEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhận thông báo trước (ngày)
                </label>
                <select
                  name="notifyBeforeDays"
                  value={formData.notifyBeforeDays}
                  onChange={handleInputChange}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>1 ngày</option>
                  <option value={2}>2 ngày</option>
                  <option value={3}>3 ngày</option>
                  <option value={5}>5 ngày</option>
                  <option value={7}>7 ngày</option>
                  <option value={10}>10 ngày</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
            {loading ? "Đang lưu..." : "Lưu Chu Kỳ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogCycleForm;
