/**
 * Các enum chung cho toàn hệ thống
 */

// Enum cho các thông số xét nghiệm STI - ĐỒng BỘ với Backend .NET
export const PARAMETER_ENUM = {
  0: { id: 0, name: "Chlamydia", shortName: "CLM", icon: "🔬", apiValue: 0 },
  1: { id: 1, name: "Lậu", shortName: "GNR", icon: "🧫", apiValue: 1 }, // Gonorrhoeae
  2: { id: 2, name: "Giang mai", shortName: "SYP", icon: "🦠", apiValue: 2 }, // Syphilis
  3: { id: 3, name: "HIV", shortName: "HIV", icon: "🧬", apiValue: 3 },
  4: { id: 4, name: "Herpes", shortName: "HSV", icon: "🧪", apiValue: 4 },
  5: { id: 5, name: "Viêm gan B", shortName: "HBV", icon: "💉", apiValue: 5 }, // HepatitisB
  6: { id: 6, name: "Viêm gan C", shortName: "HCV", icon: "💊", apiValue: 6 }, // HepatitisC
  7: { id: 7, name: "Trichomonas", shortName: "TCH", icon: "🔬", apiValue: 7 },
  8: {
    id: 8,
    name: "Mycoplasma Genitalium",
    shortName: "MPG",
    icon: "🦠",
    apiValue: 8, // MycoplasmaGenitalium
  },
  9: { id: 9, name: "HPV", shortName: "HPV", icon: "🧬", apiValue: 9 },
};

// Enum cho khung giờ đặt lịch xét nghiệm
export const TIME_SLOT_ENUM = {
  0: {
    id: 0,
    time: "7:00 - 10:00",
    label: "Sáng sớm",
    endHour: 10,
    display: "Sáng sớm (7:00 - 10:00)",
  },
  1: {
    id: 1,
    time: "10:00 - 13:00",
    label: "Trưa",
    endHour: 13,
    display: "Trưa (10:00 - 13:00)",
  },
  2: {
    id: 2,
    time: "13:00 - 16:00",
    label: "Chiều",
    endHour: 16,
    display: "Chiều (13:00 - 16:00)",
  },
  3: {
    id: 3,
    time: "16:00 - 19:00",
    label: "Tối",
    endHour: 19,
    display: "Tối (16:00 - 19:00)",
  },
};

// Enum cho loại gói xét nghiệm - ĐỒNG BỘ với Backend .NET TestPackage enum
export const TEST_PACKAGE_ENUM = {
  0: { id: 0, name: "Gói Cơ Bản", price: 300000 }, // Basic
  1: { id: 1, name: "Gói Nâng Cao", price: 550000 }, // Advanced (đổi từ "Toàn Diện" thành "Nâng Cao")
  2: { id: 2, name: "Gói Tùy Chỉnh", price: 330000 }, // Custom
};

// Enum cho trạng thái xét nghiệm - ĐỒNG BỘ với Backend .NET TestingStatus enum
export const STATUS_ENUM = {
  0: { id: 0, label: "Đã lên lịch", color: "bg-blue-100 text-blue-800" }, // Scheduled
  1: { id: 1, label: "Đã lấy mẫu", color: "bg-yellow-100 text-yellow-800" }, // SampleTaken
  2: { id: 2, label: "Đang xử lý", color: "bg-purple-100 text-purple-800" }, // Processing
  3: { id: 3, label: "Hoàn thành", color: "bg-green-100 text-green-800" }, // Completed
  4: { id: 4, label: "Đã hủy", color: "bg-red-100 text-red-800" }, // Cancelled
};

// Enum cho kết quả xét nghiệm - ĐỒNG BỘ với Backend .NET ResultOutcome enum
export const OUTCOME_ENUM = {
  0: {
    id: 0,
    label: "Âm tính", // Negative
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  1: {
    id: 1,
    label: "Dương tính", // Positive
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  2: {
    id: 2,
    label: "Đang chờ", // Pending (đổi từ "Không xác định" thành "Đang chờ")
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
};

// Hàm tiện ích để ánh xạ giữa ID trong UI và giá trị API
export const mapToApiTestParameter = (testTypeId) => {
  return PARAMETER_ENUM[testTypeId]?.apiValue ?? null;
};
