import React, { useState } from "react";

const SymptomsTracker = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomOptions = [
    { id: "cramps", label: "Cramps", icon: "🔄" },
    { id: "headache", label: "Headache", icon: "🤕" },
    { id: "mood", label: "Mood Swings", icon: "😔" },
    { id: "fatigue", label: "Fatigue", icon: "😴" },
    { id: "bloating", label: "Bloating", icon: "💭" },
    { id: "backache", label: "Backache", icon: "🔙" },
    { id: "spotting", label: "Spotting", icon: "💧" },
    { id: "acne", label: "Acne", icon: "😖" },
    { id: "breast-tenderness", label: "Breast Tenderness", icon: "💫" },
    { id: "nausea", label: "Nausea", icon: "🤢" },
    { id: "appetite", label: "Increased Appetite", icon: "🍔" },
    { id: "cravings", label: "Cravings", icon: "🍫" },
  ];

  const toggleSymptom = (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Symptoms Tracker</h2>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Select symptoms for {new Date(selectedDate).toLocaleDateString()}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {symptomOptions.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`flex items-center p-3 border rounded-lg transition-colors ${
                selectedSymptoms.includes(symptom.id)
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mr-2">{symptom.icon}</span>
              <span>{symptom.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Save Symptoms
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Symptoms History</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symptoms
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">August 15, 2023</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Cramps
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Fatigue
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">August 14, 2023</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Headache
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Mood Swings
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Cravings
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SymptomsTracker;
