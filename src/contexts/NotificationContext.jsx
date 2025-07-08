/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import notificationService from "../services/notificationService";
import toastService from "../utils/toastService";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const response = await notificationService.getNotificationsForUser();
      if (response.data?.is_success) {
        // Sort notifications by date, newest first
        const sortedNotifications = (response.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // We don't show a toast here to avoid bothering the user
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications(); // Fetch immediately on login

      // Set up polling to fetch notifications every 30 seconds
      const intervalId = setInterval(fetchNotifications, 30000);

      // Cleanup on component unmount or user logout
      return () => {
        clearInterval(intervalId);
      };
    } else {
      // Clear notifications on logout
      setNotifications([]);
    }
  }, [currentUser, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    // Optimistically update the UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );

    try {
      await notificationService.markAsRead(notificationId);
      // If the API call is successful, the UI is already updated.
      // We can re-fetch to be sure, but it might not be necessary.
      // fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // toastService.error("Could not update notification status.");
      // Revert the optimistic update if the API call fails
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
    }
  }, []);

  const clearAll = useCallback(() => {
    // This is a client-side only action for now.
    // To implement this on the backend, we'd need a `markAllAsRead` endpoint.
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
