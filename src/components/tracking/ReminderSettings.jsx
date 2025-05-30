import React, { useState } from 'react';
import { Bell, Calendar, Clock, PlusCircle } from 'lucide-react';

const ReminderSettings = () => {
  const [birthControlReminder, setBirthControlReminder] = useState(false);
  const [periodReminder, setPeriodReminder] = useState(false);
  const [healthCheckReminder, setHealthCheckReminder] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [customReminders, setCustomReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', date: '', time: '09:00' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đã lưu cài đặt nhắc nhở thành công!');
  };

  const addCustomReminder = () => {
    if (newReminder.title && newReminder.date) {
      setCustomReminders([...customReminders, { ...newReminder, id: Date.now() }]);
      setNewReminder({ title: '', date: '', time: '09:00' });
    }
  };

  const removeCustomReminder = (id) => {
    setCustomReminders(customReminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Nhắc Nhở Chuẩn</h3>
          
          <div className="flex items-center">
            <input
              id="birthControl"
              type="checkbox"
              checked={birthControlReminder}
              onChange={() => setBirthControlReminder(!birthControlReminder)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="birthControl" className="ml-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <Bell className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Nhắc Uống Thuốc Ngừa Thai</div>
                <div className="text-xs text-gray-500">Nhắc nhở hàng ngày để uống thuốc ngừa thai</div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="period"
              type="checkbox"
              checked={periodReminder}
              onChange={() => setPeriodReminder(!periodReminder)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="period" className="ml-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Nhắc Kỳ Kinh Nguyệt</div>
                <div className="text-xs text-gray-500">Thông báo trước khi kỳ kinh nguyệt tiếp theo bắt đầu</div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="healthCheck"
              type="checkbox"
              checked={healthCheckReminder}
              onChange={() => setHealthCheckReminder(!healthCheckReminder)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="healthCheck" className="ml-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Nhắc Kiểm Tra Sức Khỏe</div>
                <div className="text-xs text-gray-500">Nhắc nhở định kỳ cho các buổi kiểm tra sức khỏe</div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Cài Đặt Thông Báo</h3>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <label htmlFor="notificationTime" className="block text-sm font-medium text-gray-700">
              Thời gian thông báo ưa thích:
            </label>
            <input
              id="notificationTime"
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="ml-3 p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Nhắc Nhở Tùy Chỉnh</h3>
            <button 
              type="button" 
              onClick={() => document.getElementById('addReminderForm').classList.toggle('hidden')}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Thêm Mới
            </button>
          </div>
          
          <div id="addReminderForm" className="hidden bg-gray-50 p-4 rounded-md space-y-3">
            <div>
              <label htmlFor="reminderTitle" className="block text-sm font-medium text-gray-700">
                Tiêu Đề Nhắc Nhở
              </label>
              <input
                type="text"
                id="reminderTitle"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ví dụ: Cuộc hẹn bác sĩ"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700">
                  Ngày
                </label>
                <input
                  type="date"
                  id="reminderDate"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
                  Thời Gian
                </label>
                <input
                  type="time"
                  id="reminderTime"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="button"
                onClick={addCustomReminder}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Thêm Nhắc Nhở
              </button>
            </div>
          </div>
          
          {customReminders.length > 0 ? (
            <div className="space-y-2">
              {customReminders.map((reminder) => (
                <div key={reminder.id} className="flex justify-between items-center p-3 bg-white border rounded-md">
                  <div>
                    <div className="font-medium">{reminder.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(reminder.date).toLocaleDateString('vi-VN')} lúc {reminder.time}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Chưa có nhắc nhở tùy chỉnh nào</p>
          )}
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Lưu Cài Đặt
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReminderSettings;