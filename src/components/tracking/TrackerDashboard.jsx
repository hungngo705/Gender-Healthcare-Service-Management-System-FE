import React, { useState } from 'react';
import { Calendar, Clock, Bell } from 'lucide-react';
import CycleCalendar from './CycleCalendar';
import OvulationPredictor from './OvulationPrediction';
import ReminderSettings from './ReminderSettings';

const TrackerDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Theo Dõi Chu Kì Kinh Nguyệt
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'calendar'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Lịch Chu Kỳ
            </button>
            <button
              onClick={() => setActiveTab('ovulation')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'ovulation'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <Clock className="w-5 h-5 mr-2" />
              Dự Đoán Rụng Trứng
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'reminders'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <Bell className="w-5 h-5 mr-2" />
              Nhắc nhở
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'calendar' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Lịch Chu Kỳ Hằng Tháng</h2>
                <p className="text-gray-600 mb-4">
                Theo dõi kỳ kinh nguyệt, triệu chứng và thời kỳ dễ thụ thai bằng lịch dễ sử dụng của chúng tôi.
                </p>
                <CycleCalendar />
              </div>
            )}

            {activeTab === 'ovulation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dự Đoán Rụng Trứng</h2>
                <p className="text-gray-600 mb-4">
                Dự đoán những ngày dễ thụ thai nhất dựa trên lịch sử chu kỳ của bạn.
                </p>
                <OvulationPredictor />
              </div>
            )}

            {activeTab === 'reminders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Nhắc Nhở Sức Khỏe</h2>
                <p className="text-gray-600 mb-4">
                Thiết lập nhắc nhở cho việc uống thuốc ngừa thai, kiểm tra sức khỏe và nhiều hơn nữa.
                </p>
                <ReminderSettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerDashboard;