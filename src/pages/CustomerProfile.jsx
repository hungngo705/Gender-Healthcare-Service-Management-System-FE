import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Components
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileTab from "../components/profile/tabs/ProfileTab";
import AppointmentsTab from "../components/profile/tabs/AppointmentsTab";
import MedicalRecordsTab from "../components/profile/tabs/MedicalRecordsTab";
import NotificationsTab from "../components/profile/tabs/NotificationsTab";
import SecurityTab from "../components/profile/tabs/SecurityTab";
import PaymentsTab from "../components/profile/tabs/PaymentsTab";

function CustomerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "",
    emergencyContact: "",
  });

  useEffect(() => {
    // Nếu có dữ liệu người dùng, cập nhật state
    if (currentUser) {
      setProfileData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        birthday: currentUser.birthday || "",
        gender: currentUser.gender || "",
        emergencyContact: currentUser.emergencyContact || "",
      });
    }
  }, [currentUser]);

  // Xử lý lưu thông tin profile
  const handleSaveProfile = (updatedData) => {
    // Đây là nơi bạn sẽ gửi thông tin cập nhật đến server
    console.log("Cập nhật thông tin:", updatedData);
    // Cập nhật dữ liệu trong state
    setProfileData(updatedData);
    // Tạm thời giả lập việc lưu thành công
    alert("Thông tin đã được cập nhật thành công!");
  };

  // Render tab nội dung
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab profileData={profileData} onSave={handleSaveProfile} />
        );
      case "appointments":
        return <AppointmentsTab navigate={navigate} />;
      case "medical-records":
        return <MedicalRecordsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "payments":
        return <PaymentsTab />;
      default:
        return (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tab đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <ProfileSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <div className="flex-1">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default CustomerProfile;
