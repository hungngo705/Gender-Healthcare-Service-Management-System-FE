/**
 * Các enum chung cho toàn hệ thống
 */

// Enum cho các thông số xét nghiệm STI
export const PARAMETER_ENUM = {
  0: { id: 0, name: "Chlamydia", shortName: "CLM", icon: "🔬", apiValue: 0 },
  1: { id: 1, name: "Lậu", shortName: "GNR", icon: "🧫", apiValue: 1 },
  2: { id: 2, name: "Giang mai", shortName: "SYP", icon: "🦠", apiValue: 2 },
  3: { id: 3, name: "HIV", shortName: "HIV", icon: "🧬", apiValue: 3 },
  4: { id: 4, name: "Herpes", shortName: "HSV", icon: "🧪", apiValue: 4 },
  5: { id: 5, name: "Viêm gan B", shortName: "HBV", icon: "💉", apiValue: 5 },
  6: { id: 6, name: "Viêm gan C", shortName: "HCV", icon: "💊", apiValue: 6 },
  7: { id: 7, name: "Trichomonas", shortName: "TCH", icon: "🔬", apiValue: 7 },
  8: {
    id: 8,
    name: "Mycoplasma Genitalium",
    shortName: "MPG",
    icon: "🦠",
    apiValue: 8,
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

// Enum cho loại gói xét nghiệm
export const TEST_PACKAGE_ENUM = {
  0: { id: 0, name: "Gói Cơ Bản", price: 300000 },
  1: { id: 1, name: "Gói Toàn Diện", price: 550000 },
  2: { id: 2, name: "Gói Tùy Chọn", price: 330000 },
};

// Enum cho trạng thái xét nghiệm
export const STATUS_ENUM = {
  0: { id: 0, label: "Đã lên lịch", color: "bg-blue-100 text-blue-800" },
  1: { id: 1, label: "Đã lấy mẫu", color: "bg-yellow-100 text-yellow-800" },
  2: { id: 2, label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  3: { id: 3, label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  4: { id: 4, label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

// Enum cho kết quả xét nghiệm
export const OUTCOME_ENUM = {
  0: {
    id: 0,
    label: "Âm tính",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  1: {
    id: 1,
    label: "Dương tính",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  2: {
    id: 2,
    label: "Không xác định",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
};

// Hàm tiện ích để ánh xạ giữa ID trong UI và giá trị API
export const mapToApiTestParameter = (testTypeId) => {
  return PARAMETER_ENUM[testTypeId]?.apiValue ?? null;
};
