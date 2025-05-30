import React, { useState } from "react";

const Settings = () => {
  // Sample settings state
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

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Would save to backend in real app
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Tracker Settings</h2>

      <form onSubmit={handleSaveSettings}>
        {/* Cycle Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cycle Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Cycle Length (days)
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
                Average Period Length (days)
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
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>

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
              Enable notifications
            </label>
          </div>

          {settings.notifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Time
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
          <h3 className="text-lg font-semibold mb-4">Tracking Preferences</h3>

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
                Track symptoms
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
                Track mood
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
                Track basal temperature
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
                Track weight
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
                Track notes
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>

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
              Allow anonymous data sharing for research purposes
            </label>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Your personal information will remain private. Only anonymized
            statistical data would be shared.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
