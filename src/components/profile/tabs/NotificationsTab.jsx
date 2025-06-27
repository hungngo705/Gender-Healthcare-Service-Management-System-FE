import React, { useState, useMemo } from "react";
import {
  Bell,
  Check,
  Calendar,
  FileText,
  Clock,
  User,
  CheckCheck,
  CreditCard,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useNotifications } from "../../../contexts/NotificationContext";
import { format, formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import PropTypes from "prop-types";

function NotificationsTab() {
  const {
    notifications: allNotifications,
    markAsRead,
    isLoading,
  } = useNotifications();

  // Sort state
  const [sortBy, setSortBy] = useState("date-desc"); // e.g., 'date-desc', 'priority'

  // This function is now client-side only. A "mark all" API call would be better.
  const markAllAsRead = () => {
    allNotifications.forEach((n) => {
      if (!n.isRead) {
        markAsRead(n.id);
      }
    });
  };

  // Icon and style mapping based on notification title
  const getNotificationAppearance = (title) => {
    const mappings = {
      "đặt lịch xét nghiệm sti thành công": {
        icon: (
          <FileText className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
        ),
        color: "border-green-500",
      },
      "appointment cancelled": {
        icon: (
          <Calendar className="h-8 w-8 p-1.5 bg-red-100 text-red-600 rounded-full" />
        ),
        color: "border-red-500",
      },
      "thanh toán hóa đơn dịch vụ": {
        icon: (
          <CreditCard className="h-8 w-8 p-1.5 bg-emerald-100 text-emerald-600 rounded-full" />
        ),
        color: "border-emerald-500",
      },
      "cuộc hẹn đã được đặt": {
        icon: (
          <Calendar className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
        ),
        color: "border-blue-500",
      },
      "new question available": {
        icon: (
          <AlertCircle className="h-8 w-8 p-1.5 bg-yellow-100 text-yellow-600 rounded-full" />
        ),
        color: "border-yellow-500",
      },
      "kết quả xét nghiệm âm tính": {
        icon: (
          <CheckCheck className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
        ),
        color: "border-green-500",
      },
      "kết quả xét nghiệm dương tính": {
        icon: (
          <AlertCircle className="h-8 w-8 p-1.5 bg-red-100 text-red-600 rounded-full" />
        ),
        color: "border-red-500",
      },
      "mẫu xét nghiệm đã được thu thập": {
        icon: (
          <Check className="h-8 w-8 p-1.5 bg-cyan-100 text-cyan-600 rounded-full" />
        ),
        color: "border-cyan-500",
      },
      "cuộc hẹn đã được cập nhật": {
        icon: (
          <Calendar className="h-8 w-8 p-1.5 bg-purple-100 text-purple-600 rounded-full" />
        ),
        color: "border-purple-500",
      },
      "kết quả xét nghiệm đã hoàn thành": {
        icon: (
          <FileText className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
        ),
        color: "border-green-500",
      },
    };

    const key = title?.toLowerCase().trim();
    return (
      mappings[key] || {
        icon: (
          <Bell className="h-8 w-8 p-1.5 bg-gray-100 text-gray-600 rounded-full" />
        ),
        color: "border-gray-300",
      }
    );
  };

  // Memoized filtering and sorting
  const filteredNotifications = useMemo(() => {
    const filtered = [...allNotifications];

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "priority":
        {
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          filtered.sort(
            (a, b) =>
              (priorityOrder[a.priority] || 2) -
              (priorityOrder[b.priority] || 2)
          );
        }
        break;
      case "unread":
        filtered.sort((a, b) =>
          a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1
        );
        break;
      case "date-desc":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [allNotifications, sortBy]);

  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.isRead).length,
    [allNotifications]
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    return formatDistanceToNowStrict(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  };

  // Priority badge from API `priority`
  const getPriorityBadge = (priority) => {
    const priorityClean = priority?.toUpperCase();
    switch (priorityClean) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
            Quan trọng
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
            Vừa
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && allNotifications.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h3 className="text-xl font-medium text-gray-900">Thông báo</h3>
          {unreadCount > 0 ? (
            <p className="text-sm text-gray-500 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              Bạn không có thông báo mới.
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date-desc">Mới nhất</option>
            <option value="date-asc">Cũ nhất</option>
            <option value="priority">Ưu tiên</option>
            <option value="unread">Chưa đọc</option>
          </select>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center"
          >
            <CheckCheck size={16} className="mr-2" />
            Đánh dấu đã đọc
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const { icon, color } = getNotificationAppearance(
              notification.title
            );
            return (
              <div
                key={notification.id}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                className={`flex items-start p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${
                  notification.isRead
                    ? "bg-gray-50 border-gray-200"
                    : `bg-opacity-50 ${color.replace(
                        "border-",
                        "bg-"
                      )} ${color}`
                }`}
              >
                <div className="flex-shrink-0 mr-4">{icon}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      {getPriorityBadge(notification.priority)}
                      <span
                        title={formatDate(notification.createdAt)}
                        className="text-xs text-gray-500"
                      >
                        {getRelativeTime(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <div
                          className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
                          title="Chưa đọc"
                        ></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có thông báo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tất cả các thông báo của bạn sẽ được hiển thị ở đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

NotificationsTab.propTypes = {
  onMarkAllRead: PropTypes.func,
};

export default NotificationsTab;
