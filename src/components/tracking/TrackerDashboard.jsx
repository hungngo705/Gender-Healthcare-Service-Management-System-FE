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
          Menstrual Cycle Tracking
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
              Cycle Calendar
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
              Ovulation Predictor
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
              Reminders
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'calendar' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Monthly Cycle Calendar</h2>
                <p className="text-gray-600 mb-4">
                  Track your period, symptoms, and fertile window with our easy-to-use calendar.
                </p>
                <CycleCalendar />
              </div>
            )}

            {activeTab === 'ovulation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ovulation Predictor</h2>
                <p className="text-gray-600 mb-4">
                  Predict your most fertile days based on your cycle history.
                </p>
                <OvulationPredictor />
              </div>
            )}

            {activeTab === 'reminders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Health Reminders</h2>
                <p className="text-gray-600 mb-4">
                  Set up reminders for birth control, health checks, and more.
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