import React, { useState, useEffect } from "react";
import menstrualCycleService from "../../services/menstrualCycleService";
import { Loader, AlertCircle, CheckCircle } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    cycleLength: 28,
    periodLength: 5,
    notifications: true,
    reminderTime: "08:00",
    trackingPreferences: {
      symptoms: true,
      mood: true,
      temperature: false,
      weight: false,
      notes: true,
    },
    privacySettings: {
      dataSharing: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load user settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        // Fetch insights to get average cycle length data
        const insights = await menstrualCycleService.getInsights();

        // Fetch notifications to get notification settings
        const notifications = await menstrualCycleService.getNotifications();

        // Combine the data into our settings format
        if (insights && insights.length > 0) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            cycleLength: insights[0].averageCycleLength || 28,
            periodLength: insights[0].averagePeriodLength || 5,
            notifications: notifications && notifications.length > 0,
            reminderTime: "08:00", // Default, might come from notification settings
          }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError("Không thể tải cài đặt. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle settings changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [category, setting] = name.split(".");
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Save notification preferences
      await menstrualCycleService.setNotificationPreferences({
        enabled: settings.notifications,
        reminderTime: settings.reminderTime,
        notifyBeforeDays: 1, // Default
      });

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setSaving(false);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Không thể lưu cài đặt. Vui lòng thử lại.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600">Đang tải cài đặt...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Cài Đặt Theo Dõi</h2>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-600">Lưu cài đặt thành công!</p>
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        {/* Cycle Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cài Đặt Chu Kỳ</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ Dài Chu Kỳ Trung Bình (ngày)
              </label>
              <input
                type="number"
                name="cycleLength"
                min="20"
                max="45"
                value={settings.cycleLength}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ Dài Kỳ Kinh Trung Bình (ngày)
              </label>
              <input
                type="number"
                name="periodLength"
                min="1"
                max="10"
                value={settings.periodLength}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cài Đặt Thông Báo</h3>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={settings.notifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="notifications"
              className="ml-2 block text-sm text-gray-700"
            >
              Bật thông báo
            </label>
          </div>

          {settings.notifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời Gian Nhắc Nhở
              </label>
              <input
                type="time"
                name="reminderTime"
                value={settings.reminderTime}
                onChange={handleInputChange}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Tracking Preferences */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tùy Chọn Theo Dõi</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-symptoms"
                name="trackingPreferences.symptoms"
                checked={settings.trackingPreferences.symptoms}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="track-symptoms"
                className="ml-2 block text-sm text-gray-700"
              >
                Theo dõi triệu chứng
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-mood"
                name="trackingPreferences.mood"
                checked={settings.trackingPreferences.mood}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="track-mood"
                className="ml-2 block text-sm text-gray-700"
              >
                Theo dõi tâm trạng
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-temperature"
                name="trackingPreferences.temperature"
                checked={settings.trackingPreferences.temperature}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="track-temperature"
                className="ml-2 block text-sm text-gray-700"
              >
                Theo dõi nhiệt độ cơ bản
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-weight"
                name="trackingPreferences.weight"
                checked={settings.trackingPreferences.weight}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="track-weight"
                className="ml-2 block text-sm text-gray-700"
              >
                Theo dõi cân nặng
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-notes"
                name="trackingPreferences.notes"
                checked={settings.trackingPreferences.notes}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="track-notes"
                className="ml-2 block text-sm text-gray-700"
              >
                Theo dõi ghi chú
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cài Đặt Quyền Riêng Tư</h3>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="data-sharing"
              name="privacySettings.dataSharing"
              checked={settings.privacySettings.dataSharing}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="data-sharing"
              className="ml-2 block text-sm text-gray-700"
            >
              Cho phép chia sẻ dữ liệu ẩn danh cho mục đích nghiên cứu
            </label>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Thông tin cá nhân của bạn sẽ được giữ kín. Chỉ dữ liệu thống kê ẩn
            danh mới được chia sẻ.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {saving && <Loader className="animate-spin h-4 w-4 mr-2" />}
            {saving ? "Đang lưu..." : "Lưu Cài Đặt"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
