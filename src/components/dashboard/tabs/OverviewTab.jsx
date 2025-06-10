import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Calendar, Loader, AlertTriangle, RefreshCw } from "lucide-react";
import dashboardService from "../../../services/dashboardService";
import toastService from "../../../utils/toastService";

const OverviewTab = React.memo(({ role }) => {
  console.log("🔄 OverviewTab component re-rendering with role:", role);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get status color class
  const getChangeColorClass = (change) => {
    if (change.startsWith("+")) return "text-green-600";
    if (change === "0") return "text-gray-500";
    return "text-red-600";
  };

  // Helper function to get appointment status styling
  const getAppointmentStatusClass = (status) => {
    if (status === 0) return "bg-yellow-100 text-yellow-800";
    if (status === 1) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };
  // Helper function to get appointment status text
  const getAppointmentStatusText = (status) => {
    if (status === 0) return "Chờ xác nhận";
    if (status === 1) return "Đã xác nhận";
    return "Đã hủy";
  };

  // Load dashboard data from API - useCallback to prevent recreation
  const loadDashboardData = useCallback(async () => {
    console.log("📡 API Call: Loading dashboard data...");
    try {
      setLoading(true);
      setError(null);

      // Get comprehensive dashboard data
      const response = await dashboardService.getDashboardData();
      console.log("✅ API Response received:", response.data);
      // The API returns data in response.data.data structure
      if (response.data?.is_success) {
        setDashboardData(response.data.data);
        console.log("💾 Dashboard data set successfully");
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch dashboard data"
        );
      }
    } catch (err) {
      console.error("❌ Failed to load dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
      toastService.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
      console.log("⏹️ Loading finished");
    }
  }, []); // Empty dependency array to prevent recreation

  // Load data when component mounts or role changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle manual refresh
  const handleRefresh = () => {
    loadDashboardData();
    toastService.success("Đang tải lại dữ liệu...");
  }; // Generate role-specific stats from API data
  const getRoleStats = (apiData, userRole) => {
    if (!apiData?.stats) return [];

    const stats = apiData.stats;

    switch (userRole?.toLowerCase()) {
      case "consultant":
        return [
          {
            label: "Lịch hẹn hôm nay",
            value: stats.todayAppointments || 0,
            change: "+2",
            icon: "calendar",
          },
          {
            label: "Lịch hẹn đang chờ",
            value: stats.pendingAppointments || 0,
            change: "0",
            icon: "clock",
          },
          {
            label: "Người dùng mới tháng này",
            value: stats.newUsersThisMonth || 0,
            change: "+5",
            icon: "user-plus",
          },
          {
            label: "Hoàn thành",
            value: stats.completedAppointments || 0,
            change: "+1",
            icon: "check-circle",
          },
        ];

      case "admin":
        return [
          {
            label: "Tổng người dùng",
            value: stats.totalUsers || 0,
            change: `+${stats.newUsersThisMonth || 0}`,
            icon: "users",
          },
          {
            label: "Tổng lịch hẹn",
            value: stats.totalAppointments || 0,
            change: `+${stats.appointmentsThisMonth || 0}`,
            icon: "calendar",
          },
          {
            label: "Người dùng hoạt động",
            value: stats.totalActiveUsers || 0,
            change: "0",
            icon: "check-circle",
          },
          {
            label: "Lịch hẹn hôm nay",
            value: stats.todayAppointments || 0,
            change: "+3",
            icon: "clock",
          },
        ];

      case "manager":
        return [
          {
            label: "Lịch hẹn tháng này",
            value: stats.appointmentsThisMonth || 0,
            change: "+15",
            icon: "calendar",
          },
          {
            label: "Người dùng mới",
            value: stats.newUsersThisMonth || 0,
            change: "+8",
            icon: "user-plus",
          },
          {
            label: "Hoàn thành",
            value: stats.completedAppointments || 0,
            change: "+12",
            icon: "check-circle",
          },
          {
            label: "Bị hủy",
            value: stats.cancelledAppointments || 0,
            change: "-3",
            icon: "x-circle",
          },
        ];

      case "staff":
      default:
        return [
          {
            label: "Lịch hẹn hôm nay",
            value: stats.todayAppointments || 0,
            change: "+3",
            icon: "calendar",
          },
          {
            label: "Đang chờ xử lý",
            value: stats.pendingAppointments || 0,
            change: "-2",
            icon: "clock",
          },
          {
            label: "Hoàn thành",
            value: stats.completedAppointments || 0,
            change: "+5",
            icon: "check-circle",
          },
          {
            label: "Người dùng hoạt động",
            value: stats.totalActiveUsers || 0,
            change: "+2",
            icon: "users",
          },
        ];
    }
  };
  const stats = getRoleStats(dashboardData, role);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tổng quan</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tải lại
            </button>
          </div>
        </div>
      ) : (
        <>
          {" "}
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <i className={`fas fa-${stat.icon}`}></i>
                  </div>
                </div>
                <div
                  className={`text-xs mt-2 ${getChangeColorClass(stat.change)}`}
                >
                  {stat.change} so với hôm qua
                </div>
              </div>
            ))}
          </div>
          {/* Additional Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Hoạt động gần đây
              </h3>{" "}
              <div className="space-y-3">
                {dashboardData?.recentAppointments
                  ?.slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={
                        appointment.id ||
                        appointment.appointmentId ||
                        `appointment-${appointment.appointmentDate}`
                      }
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.customer?.name || "Khách hàng"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getAppointmentStatusClass(
                          appointment.status
                        )}`}
                      >
                        {getAppointmentStatusText(appointment.status)}
                      </span>
                    </div>
                  ))}
                {(!dashboardData?.recentAppointments ||
                  dashboardData.recentAppointments.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có hoạt động nào
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thống kê nhanh
              </h3>
              <div className="space-y-4">
                {" "}
                {dashboardData?.usersByRole && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Người dùng theo vai trò
                    </h4>
                    <div className="space-y-2">
                      {dashboardData.usersByRole.map((roleData) => (
                        <div
                          key={roleData.role}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 capitalize">
                            {roleData.role}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {roleData.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {dashboardData?.appointmentsByStatus && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Lịch hẹn theo trạng thái
                    </h4>
                    <div className="space-y-2">
                      {dashboardData.appointmentsByStatus.map((statusData) => (
                        <div
                          key={statusData.status}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {statusData.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {statusData.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}{" "}
    </div>
  );
});

OverviewTab.displayName = "OverviewTab";

OverviewTab.propTypes = {
  role: PropTypes.string,
};

OverviewTab.defaultProps = {
  role: "staff",
};

export default OverviewTab;
