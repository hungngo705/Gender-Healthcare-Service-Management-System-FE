import React, { useState } from "react";
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
import PropTypes from "prop-types";

function NotificationsTab({ onMarkAllRead }) {
  // Mock data with extended notification types
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nhắc nhở cuộc hẹn sắp tới",
      message:
        "Bạn có lịch hẹn khám với Bác sĩ Nguyễn Thị Lan vào ngày 05/06/2025 lúc 15:00.",
      createdAt: "2025-06-02T14:30:00Z",
      isRead: false,
      type: "appointment",
      priority: "high",
    },
    {
      id: 2,
      title: "Kết quả xét nghiệm đã có",
      message:
        "Kết quả xét nghiệm của bạn từ ngày 25/05/2025 đã được cập nhật. Vui lòng kiểm tra hồ sơ y tế của bạn.",
      createdAt: "2025-06-01T09:15:00Z",
      isRead: false,
      type: "medical",
      priority: "medium",
    },
    {
      id: 3,
      title: "Cập nhật thông tin sức khỏe",
      message:
        "Đã đến lúc cập nhật thông tin sức khỏe hàng tháng của bạn. Điều này giúp chúng tôi cung cấp dịch vụ tốt hơn.",
      createdAt: "2025-05-28T16:45:00Z",
      isRead: true,
      type: "update",
      priority: "low",
    },
    {
      id: 4,
      title: "Thanh toán hóa đơn dịch vụ",
      message:
        "Thanh toán thành công hóa đơn dịch vụ khám sức khỏe tổng quát. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
      createdAt: "2025-05-25T10:20:00Z",
      isRead: true,
      type: "payment",
      priority: "medium",
    },
    {
      id: 5,
      title: "Cảnh báo dị ứng thuốc",
      message:
        "Dựa trên hồ sơ y tế của bạn, chúng tôi nhận thấy bạn có thể bị dị ứng với loại thuốc mới được kê đơn. Vui lòng liên hệ bác sĩ của bạn.",
      createdAt: "2025-05-20T08:45:00Z",
      isRead: false,
      type: "alert",
      priority: "high",
    },
  ]);

  // Filter options
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    if (onMarkAllRead) {
      onMarkAllRead();
    }
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.type === filter
      );
    }

    // Apply sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sortBy === "unread") {
      filtered.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
    }

    return filtered;
  };

  // Count of unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format relative date (today, yesterday, etc.)
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return formatDate(dateString);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return (
          <Calendar className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
        );
      case "medical":
        return (
          <FileText className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
        );
      case "update":
        return (
          <User className="h-8 w-8 p-1.5 bg-purple-100 text-purple-600 rounded-full" />
        );
      case "payment":
        return (
          <CreditCard className="h-8 w-8 p-1.5 bg-emerald-100 text-emerald-600 rounded-full" />
        );
      case "alert":
        return (
          <AlertCircle className="h-8 w-8 p-1.5 bg-red-100 text-red-600 rounded-full" />
        );
      default:
        return (
          <Bell className="h-8 w-8 p-1.5 bg-gray-100 text-gray-600 rounded-full" />
        );
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case "appointment":
        return "Cuộc hẹn";
      case "medical":
        return "Y tế";
      case "update":
        return "Cập nhật";
      case "payment":
        return "Thanh toán";
      case "alert":
        return "Cảnh báo";
      default:
        return "Khác";
    }
  };

  // Get badges for priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
            Quan trọng
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
            Vừa
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h3 className="text-xl font-medium text-gray-900">Thông báo</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả thông báo</option>
            <option value="appointment">Cuộc hẹn</option>
            <option value="medical">Y tế</option>
            <option value="update">Cập nhật</option>
            <option value="payment">Thanh toán</option>
            <option value="alert">Cảnh báo</option>
          </select>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Mới nhất</option>
            <option value="priority">Ưu tiên</option>
            <option value="unread">Chưa đọc</option>
          </select>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-md bg-white"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Đánh dấu đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell size={48} className="mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex p-4 rounded-lg ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              } border ${
                notification.priority === "high" && !notification.isRead
                  ? "border-red-200"
                  : !notification.isRead
                  ? "border-blue-200"
                  : "border-gray-200"
              }`}
            >
              <div className="mr-4 flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start">
                  <h4
                    className={`font-medium ${
                      notification.isRead ? "text-gray-700" : "text-gray-900"
                    }`}
                  >
                    {notification.title}
                  </h4>

                  <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {getTypeLabel(notification.type)}
                    </span>

                    {getPriorityBadge(notification.priority)}

                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        aria-label="Đánh dấu đã đọc"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                      aria-label="Xóa thông báo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p
                  className={`mt-2 text-sm ${
                    notification.isRead ? "text-gray-500" : "text-gray-700"
                  }`}
                >
                  {notification.message}
                </p>

                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getRelativeTime(notification.createdAt)}</span>
                  <span className="ml-2">
                    ({formatDate(notification.createdAt)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

NotificationsTab.propTypes = {
  onMarkAllRead: PropTypes.func,
};

export default NotificationsTab;
