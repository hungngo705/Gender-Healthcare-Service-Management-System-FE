/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } =
    useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-indigo-600 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`border-b p-4 ${
                    !notif.read ? "bg-indigo-50" : ""
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <p className="text-sm text-gray-700">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              You have no new notifications.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
