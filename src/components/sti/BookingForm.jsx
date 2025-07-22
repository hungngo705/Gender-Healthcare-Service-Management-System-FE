import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { STI_PACKAGES, STI_TEST_TYPES } from "./booking-components/constants";
import { getForCustomer } from "../../services/stiTestingService";
import { TIME_SLOT_ENUM } from "../../constants/enums";
import LoadingSpinner from "../ui/LoadingSpinner";

// Time slot component for STI testing booking
const TimeSlotSelector = ({
  selectedSlot,
  onChange,
  bookedSlots,
  selectedDate,
}) => {
  const timeSlots = Object.values(TIME_SLOT_ENUM);

  // Check if selected date is today
  const isToday =
    format(new Date(selectedDate), "yyyy-MM-dd") ===
    format(new Date(), "yyyy-MM-dd");
  const currentHour = new Date().getHours();

  // Find the first available slot for today
  useEffect(() => {
    // If we don't have a selected slot yet, find the first available one
    if (selectedSlot === undefined || selectedSlot === "") {
      let firstAvailableSlot = null;

      for (const slot of timeSlots) {
        const isPastSlot = isToday && currentHour >= slot.endHour;
        const isBooked = bookedSlots[slot.id];

        if (!isPastSlot && !isBooked) {
          firstAvailableSlot = slot.id;
          break;
        }
      }

      if (firstAvailableSlot !== null) {
        onChange(firstAvailableSlot);
      }
    }
  }, [selectedDate, isToday, currentHour, bookedSlots, selectedSlot, onChange]);

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        Chọn khung giờ xét nghiệm *
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          // Slot is disabled if:
          // 1. It's today and the slot's end time has passed, OR
          // 2. The slot is already booked by this user on this date
          const isPastSlot = isToday && currentHour >= slot.endHour;
          const isBooked = bookedSlots[slot.id];
          const isDisabled = isPastSlot || isBooked;

          return (
            <div
              key={slot.id}
              onClick={() => !isDisabled && onChange(slot.id)}
              className={`cursor-pointer border rounded-lg p-4 transition-all ${
                selectedSlot === slot.id
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : isDisabled
                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              aria-disabled={isDisabled}
              aria-pressed={selectedSlot === slot.id}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm font-medium mb-1">{slot.time}</span>
                <span className="text-xs text-gray-500 mb-1">{slot.label}</span>
                {isPastSlot && (
                  <span className="text-xs text-red-500">Đã qua</span>
                )}
                {isBooked && (
                  <span className="text-xs text-amber-500">Đã đặt</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isToday && (
        <p className="text-xs text-amber-600 mt-1">
          <span className="font-medium">Lưu ý:</span> Đối với đặt lịch ngày hôm
          nay, chỉ hiển thị các khung giờ còn khả dụng
        </p>
      )}
    </div>
  );
};

function BookingForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State for storing customer's existing bookings
  const [userBookings, setUserBookings] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // State for appointment form
  const [formData, setFormData] = useState({
    userId: currentUser?.id || "",
    testPackage: 0, // 0: Basic, 1: Advanced, 2: Custom
    customParameters: [], // Các tham số xét nghiệm tùy chỉnh
    status: 0, // 0: Scheduled, 1: SampleTaken, 2: Processing, 3: Completed, 4: Cancelled
    preferredDate: format(new Date(), "yyyy-MM-dd"), // ISO format cho input date
    scheduleDate: format(new Date(), "yyyy-MM-dd"), // Field này sẽ sync với preferredDate
    slot: 0, // Khung giờ, sẽ được chọn sau
    totalPrice: 0, // Tổng giá tiền
    notes: "", // Ghi chú
    isAnonymous: false, // Thêm vào để duy trì tính năng hiện tại
    testTypes: [], // Giữ lại để tương thích với UI hiện tại
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null); // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "preferredDate") {
      // Đảm bảo ngày được lưu trong format đúng và cập nhật cả scheduleDate
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Giữ nguyên format yyyy-MM-dd cho input date
        scheduleDate: value, // Đồng bộ với scheduleDate để gửi đúng giá trị cho API
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }; // Handle test type selection  // Hàm ánh xạ id xét nghiệm trong UI sang enum TestParameter trong Backend .NET
  const mapToApiTestParameter = (testTypeId) => {
    // Mapping chính xác theo STI_TEST_TYPES ID -> Backend TestParameter enum
    const mapping = {
      0: 0, // Chlamydia -> Chlamydia (0)
      1: 1, // Gonorrhea (Lậu) -> Gonorrhoeae (1)
      2: 2, // Syphilis (Giang mai) -> Syphilis (2)
      3: 3, // HIV -> HIV (3)
      4: 5, // Hepatitis B -> HepatitisB (5)
      5: 6, // Hepatitis C -> HepatitisC (6)
      6: 4, // Herpes -> Herpes (4)
      7: 9, // HPV -> HPV (9)
      8: 8, // Mycoplasma -> MycoplasmaGenitalium (8)
      9: 7, // Trichomonas -> Trichomonas (7)
    };

    return mapping[testTypeId] !== undefined ? mapping[testTypeId] : null;
  };

  // Hàm tính lại tổng giá tiền dựa trên các xét nghiệm đã chọn
  const recalculateTotalPrice = (selectedTypes) => {
    return selectedTypes.reduce((total, typeId) => {
      const test = testTypes.find((t) => t.id === typeId);
      if (test) {
        // Extract numeric price from string (e.g. "45.000đ" -> 45000)
        const price = parseInt(test.price.replace(/\D/g, ""));
        return total + price;
      }
      return total;
    }, 0);
  };

  const handleTestTypeChange = (testTypeId) => {
    setFormData((prev) => {
      // Check if the test type is already selected
      const isSelected = prev.testTypes.includes(testTypeId);

      // Check if it's a package
      const selectedType = testTypes.find((t) => t.id === testTypeId);
      const isPackage = selectedType?.isPackage;

      if (isSelected) {
        // Remove the test type if already selected
        // Cập nhật customParameters cho API
        let updatedCustomParams = [...prev.customParameters];
        if (!isPackage) {
          const apiTestParam = mapToApiTestParameter(testTypeId);
          updatedCustomParams = updatedCustomParams.filter(
            (param) => param !== apiTestParam
          );
        } // Cập nhật testPackage nếu bỏ chọn một package
        let newTestPackage = prev.testPackage;
        if (isPackage) {
          if (testTypeId === 100) newTestPackage = 0; // Basic
          else if (testTypeId === 101)
            newTestPackage = 1; // Advanced - sửa từ 2 thành 1
          else if (testTypeId === 102) newTestPackage = 2; // Custom
        }

        return {
          ...prev,
          testTypes: prev.testTypes.filter((id) => id !== testTypeId),
          customParameters: updatedCustomParams,
          testPackage: newTestPackage,
          totalPrice: recalculateTotalPrice(
            prev.testTypes.filter((id) => id !== testTypeId)
          ),
        };
      } else {
        let newTestTypes;
        let newCustomParams = [...prev.customParameters];
        let newTestPackage = prev.testPackage;
        if (isPackage) {
          // Xác định TestPackage từ API enum (0: Basic, 1: Advanced, 2: Custom)
          if (testTypeId === 100) newTestPackage = 0; // Basic
          else if (testTypeId === 101)
            newTestPackage = 1; // Advanced - đảm bảo giá trị này là 1
          else if (testTypeId === 102) newTestPackage = 2; // Custom

          // Special handling for "Xét Nghiệm Mục Tiêu" package (id: 102)
          if (testTypeId === 102) {
            // For targeted package, only select the package itself
            // Individual tests will be selected separately
            newTestTypes = [testTypeId];
            newCustomParams = []; // Reset customParameters khi chọn package Custom
          } else {
            // For other packages, remove any other packages and individual tests
            newTestTypes = [testTypeId];

            // Cập nhật customParameters dựa trên gói xét nghiệm
            newCustomParams = [];
            if (testTypeId === 100) {
              // Basic Package: Chlamydia, Gonorrhea, Syphilis
              newCustomParams = [0, 1, 2]; // Chlamydia = 0, Gonorrhoeae = 1, Syphilis = 2
            } else if (testTypeId === 101) {
              // Advanced Package: Basic + HIV, Herpes, Hepatitis, etc
              newCustomParams = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Tất cả test parameters bao gồm HPV (9)
            }
          }
        } else {
          // If selecting an individual test
          const isTargetedPackageSelected = prev.testTypes.includes(102);

          if (isTargetedPackageSelected) {
            // If targeted package is selected, check if we can add more individual tests
            const currentIndividualTests = prev.testTypes.filter((id) => {
              const type = testTypes.find((t) => t.id === id);
              return type && !type.isPackage;
            });

            if (currentIndividualTests.length < 3) {
              // Can add more individual tests to targeted package
              newTestTypes = [...prev.testTypes, testTypeId];

              // Cập nhật customParameters cho API
              const apiTestParam = mapToApiTestParameter(testTypeId);
              if (
                apiTestParam !== null &&
                !newCustomParams.includes(apiTestParam)
              ) {
                newCustomParams.push(apiTestParam);
              }
            } else {
              // Already have 3 individual tests, replace the oldest one
              const otherPackages = prev.testTypes.filter((id) => {
                const type = testTypes.find((t) => t.id === id);
                return type && type.isPackage;
              });
              const newestIndividualTests = currentIndividualTests.slice(-2);
              newTestTypes = [
                ...otherPackages,
                ...newestIndividualTests,
                testTypeId,
              ];

              // Cập nhật customParameters, loại bỏ loại cũ nhất và thêm loại mới
              const oldestTestId = currentIndividualTests[0];
              const oldestApiParam = mapToApiTestParameter(oldestTestId);
              const newApiParam = mapToApiTestParameter(testTypeId);

              newCustomParams = newCustomParams.filter(
                (param) => param !== oldestApiParam
              );
              if (
                newApiParam !== null &&
                !newCustomParams.includes(newApiParam)
              ) {
                newCustomParams.push(newApiParam);
              }
            }
          } else {
            // Remove any other packages first, then add individual test
            const packages = testTypes
              .filter((t) => t.isPackage)
              .map((t) => t.id);
            newTestTypes = [
              ...prev.testTypes.filter((id) => !packages.includes(id)),
              testTypeId,
            ];

            // Cập nhật customParameters cho API
            const apiTestParam = mapToApiTestParameter(testTypeId);
            if (apiTestParam !== null) {
              // Nếu không có gói được chọn, cập nhật customParameters chỉ với xét nghiệm riêng lẻ
              if (
                newCustomParams.find((id) => id === apiTestParam) === undefined
              ) {
                newCustomParams.push(apiTestParam);
              }
            }
          }
        }

        return {
          ...prev,
          testTypes: newTestTypes,
          customParameters: newCustomParams,
          testPackage: newTestPackage,
          totalPrice: recalculateTotalPrice(newTestTypes),
        };
      }
    });
  }; // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (formData.testTypes.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một gói xét nghiệm");
      }

      // Kiểm tra nếu chọn Custom package nhưng chưa chọn xét nghiệm nào
      if (formData.testTypes.includes(102)) {
        const selectedIndividualTests = formData.testTypes.filter((id) => {
          const type = testTypes.find((t) => t.id === id);
          return type && !type.isPackage;
        });

        if (selectedIndividualTests.length === 0) {
          throw new Error(
            "Vui lòng chọn ít nhất 1 loại xét nghiệm cho gói tùy chỉnh"
          );
        }
      }

      if (formData.slot === undefined) {
        throw new Error("Vui lòng chọn khung giờ xét nghiệm");
      }

      // Chuẩn bị dữ liệu cho API - ĐỒNG BỘ với Backend .NET Entity Structure
      // STITesting entity chỉ cần testPackage, KHÔNG cần customParameters
      // TestResult entities sẽ được backend tạo dựa trên testPackage
      let finalTestPackage = 0; // Mặc định là Basic (0)

      if (formData.testTypes.includes(101)) {
        finalTestPackage = 1; // Advanced (Nâng Cao)
        console.log("Đã chọn gói Nâng Cao, testPackage = 1");
      } else if (formData.testTypes.includes(102)) {
        finalTestPackage = 2; // Custom (Tùy Chỉnh)
        console.log("Đã chọn gói Tùy Chỉnh, testPackage = 2");
      } else if (formData.testTypes.includes(100)) {
        finalTestPackage = 0; // Basic (Cơ Bản)
        console.log("Đã chọn gói Cơ Bản, testPackage = 0");
      } else {
        // Nếu chỉ chọn các xét nghiệm riêng lẻ -> sử dụng Custom package
        finalTestPackage = 2; // Custom - để backend tạo TestResult theo individual tests
        console.log(
          "Đã chọn xét nghiệm riêng lẻ, sử dụng testPackage = 2 (Custom)"
        );
      }

      // Chuẩn bị danh sách parameters cho frontend display và backend processing
      // (Backend sẽ sử dụng thông tin này để tạo TestResult records)
      let selectedParameters = [];
      if (finalTestPackage === 1) {
        // Gói Nâng Cao (Advanced) - đầy đủ 10 parameters
        selectedParameters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      } else if (finalTestPackage === 0) {
        // Gói Cơ Bản (Basic) - 3 parameters cố định
        selectedParameters = [0, 1, 2]; // Chlamydia, Gonorrhoeae, Syphilis
      } else if (finalTestPackage === 2) {
        // Custom package - individual tests hoặc user-selected tests
        selectedParameters = formData.testTypes
          .filter((typeId) => {
            const test = testTypes.find((t) => t.id === typeId);
            return test && !test.isPackage;
          })
          .map((typeId) => mapToApiTestParameter(typeId))
          .filter((param) => param !== null);
      }

      console.log(
        "Selected parameters for TestResult creation:",
        selectedParameters
      );

      // Convert selected test types from ids to full objects for UI display
      const selectedTests = formData.testTypes.map((typeId) => {
        const test = testTypes.find((t) => t.id === typeId);
        return {
          id: test.id,
          name: test.label,
          price: test.price,
          isPackage: test.isPackage || false,
        };
      });

      // Prepare data for API - ĐỒNG BỘ với STITesting entity structure
      const apiRequestData = {
        testPackage: finalTestPackage, // Chỉ gửi testPackage, backend sẽ tự tạo TestResult records
        status: 0, // Mặc định là Scheduled (TestingStatus.Scheduled)
        scheduleDate: formData.preferredDate,
        slot: formData.slot,
        totalPrice: calculateTotal(),
        notes: formData.notes || "",
        // KHÔNG gửi customParameters vì STITesting entity không có field này!

        // OPTIONAL: Có thể gửi thêm selectedParameters để backend biết tạo TestResult nào
        // Đây là approach linh hoạt cho Custom package hoặc individual tests
        selectedParameters: selectedParameters,
      };

      // Thông tin để backend biết cần tạo TestResult nào (có thể gửi trong body hoặc xử lý riêng)
      const testResultsToCreate = selectedParameters.map((param) => ({
        parameter: param, // TestParameter enum value (0-9)
        outcome: 2, // ResultOutcome.Pending
      }));

      console.log("Dữ liệu STITesting API sẽ gửi:", apiRequestData);
      console.log("TestResults cần tạo:", testResultsToCreate);

      // Debug để xác nhận package đúng
      console.log(
        "Gói xét nghiệm:",
        apiRequestData.testPackage === 0
          ? "Cơ bản"
          : apiRequestData.testPackage === 1
          ? "Nâng cao"
          : apiRequestData.testPackage === 2
          ? "Tùy chỉnh"
          : "Không xác định"
      );
      console.log("Danh sách parameters cho TestResult:", selectedParameters);

      // Prepare data for payment page
      const submitData = {
        ...formData,
        testPackage: finalTestPackage, // Cập nhật testPackage
        selectedParameters: selectedParameters, // Thay thế customParameters
        userId: currentUser ? undefined : formData.userId,
        testTypes: selectedTests,
        totalAmount: calculateTotal(),
        apiData: apiRequestData,
        testResultsToCreate: testResultsToCreate, // Thêm thông tin để tạo TestResult
      };

      // Tiếp tục với chuyển hướng đến trang thanh toán
      toast.info("Đang chuyển đến trang thanh toán...", { autoClose: 2000 });
      navigate("/payment", {
        state: {
          bookingData: submitData,
          totalAmount: calculateTotal(),
        },
      });
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      setSubmitError(
        error.message ||
          "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau."
      );
      toast.error(
        error.message ||
          "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  }; // Get package prices from constants

  const testTypes = [
    // Packages first - these are bundles of tests with special pricing
    {
      id: 100,
      label: "Xét Nghiệm Cơ Bản",
      description: "Gói xét nghiệm phù hợp cho việc kiểm tra định kỳ",
      price: `${STI_PACKAGES[0].price.toLocaleString()}đ`,
      isPackage: true,
      includedTests: [4, 1, 2], // Chlamydia, Gonorrhea, Syphilis
      popular: false,
      features: [
        "Xét nghiệm Chlamydia",
        "Xét nghiệm Gonorrhea (Lậu)",
        "Xét nghiệm Syphilis (Giang mai)",
        "Kết quả trong vòng 2-3 ngày",
        "Tư vấn sau xét nghiệm",
      ],
    },
    {
      id: 101,
      label: "Xét Nghiệm Nâng Cao", // Đổi tên cho đúng với backend
      description: "Gói xét nghiệm đầy đủ nhất cho sức khỏe tình dục",
      price: `${STI_PACKAGES[1].price.toLocaleString()}đ`, // Sử dụng index 1 (Advanced)
      isPackage: true,
      includedTests: [4, 1, 2, 0, 5, 6, 7, 8, 9, 3], // Tất cả bao gồm cả HPV (3)
      popular: true,
      features: [
        "Tất cả xét nghiệm của gói Cơ Bản",
        "Xét nghiệm HIV",
        "Xét nghiệm HPV",
        "Xét nghiệm Herpes",
        "Xét nghiệm Hepatitis B & C",
        "Xét nghiệm Trichomonas",
        "Kết quả trong vòng 3-5 ngày",
        "Tư vấn chi tiết sau xét nghiệm",
      ],
    },
    {
      id: 102,
      label: "Xét Nghiệm Tùy Chỉnh", // Đổi tên cho đúng với backend
      description: "Tự chọn tối đa 3 loại xét nghiệm theo nhu cầu cụ thể",
      price: `${STI_PACKAGES[2].price.toLocaleString()}đ`, // Sử dụng index 2 (Custom)
      isPackage: true,
      includedTests: [], // User can choose individual tests
      popular: false,
      features: [
        "Tự chọn tối đa 3 loại xét nghiệm",
        "Phù hợp với nhu cầu cá nhân hóa",
        "Giá cố định cho gói tùy chỉnh",
        "Kết quả trong vòng 2-4 ngày",
        "Tư vấn chuyên sâu sau xét nghiệm",
      ],
    }, // Individual tests
    {
      id: 0,
      label: "HIV",
      description: "Xét nghiệm HIV",
      price: `${STI_TEST_TYPES[3].price.toLocaleString()}đ`,
    },
    {
      id: 1,
      label: "Gonorrhea (Lậu)",
      description: "Phát hiện vi khuẩn Neisseria gonorrhoeae",
      price: `${STI_TEST_TYPES[1].price.toLocaleString()}đ`,
    },
    {
      id: 2,
      label: "Syphilis (Giang Mai)",
      description: "Phát hiện vi khuẩn Treponema pallidum",
      price: `${STI_TEST_TYPES[2].price.toLocaleString()}đ`,
    },
    {
      id: 3,
      label: "HPV",
      description: "Phát hiện virus gây u nhú ở người",
      price: "50.000đ",
    },
    {
      id: 4,
      label: "Chlamydia",
      description: "Phát hiện vi khuẩn Chlamydia trachomatis",
      price: "35.000đ",
    },
    {
      id: 5,
      label: "Herpes",
      description: "Phát hiện virus Herpes simplex (HSV-1 và HSV-2)",
      price: "40.000đ",
    },
    {
      id: 6,
      label: "Hepatitis B",
      description: "Phát hiện virus viêm gan B (HBV)",
      price: "40.000đ",
    },
    {
      id: 7,
      label: "Hepatitis C",
      description: "Phát hiện virus viêm gan C (HCV)",
      price: "40.000đ",
    },
    {
      id: 8,
      label: "Trichomonas",
      description: "Phát hiện ký sinh trùng Trichomonas vaginalis",
      price: "35.000đ",
    },
    {
      id: 9,
      label: "Mycoplasma Genitalium",
      description: "Phát hiện vi khuẩn Mycoplasma Genitalium",
      price: "40.000đ",
    },
  ];
  const calculateTotal = () => {
    // Check if any package is selected - ĐỒNG BỘ với STI_PACKAGES index
    if (formData.testTypes.includes(100)) {
      // Basic package (index 0)
      return STI_PACKAGES[0].price;
    } else if (formData.testTypes.includes(101)) {
      // Advanced package (index 1)
      return STI_PACKAGES[1].price;
    } else if (formData.testTypes.includes(102)) {
      // Custom package (index 2)
      return STI_PACKAGES[2].price;
    }

    // If no package selected, calculate individual test prices
    return formData.testTypes.reduce((total, typeId) => {
      const testType = testTypes.find((t) => t.id === typeId);
      if (testType) {
        // Extract numeric price from string (e.g. "45.000đ" -> 45000)
        const price = parseInt(testType.price.replace(/\D/g, ""));
        return total + price;
      }
      return total;
    }, 0);
  };

  // Fetch customer's existing bookings on component mount
  useEffect(() => {
    async function fetchUserBookings() {
      if (!currentUser) {
        setIsLoadingBookings(false);
        return;
      }

      try {
        const response = await getForCustomer();
        if (response?.data?.is_success) {
          setUserBookings(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
      } finally {
        setIsLoadingBookings(false);
      }
    }

    fetchUserBookings();
  }, [currentUser]);

  // When preferred date changes, update the booked slots
  useEffect(() => {
    // Find bookings on the selected date
    const selectedDate = formData.preferredDate;
    const bookedSlotsOnDate = userBookings
      .filter(
        (booking) =>
          booking.scheduleDate?.substring(0, 10) === selectedDate ||
          booking.scheduledDate?.substring(0, 10) === selectedDate
      )
      .map((booking) => booking.slot);

    // Create a map of booked slots
    const slotsMap = {};
    bookedSlotsOnDate.forEach((slot) => {
      slotsMap[slot] = true;
    });

    setBookedSlots(slotsMap);

    // If current selected slot is already booked, reset it
    if (slotsMap[formData.slot]) {
      setFormData((prev) => ({
        ...prev,
        slot: undefined,
      }));
    }
  }, [formData.preferredDate, userBookings]);

  return (
    <div id="appointment" className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Đặt Lịch Xét Nghiệm STI
      </h2>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!currentUser && (
              <div className="md:col-span-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Bạn đang không đăng nhập. Để theo dõi kết quả xét nghiệm dễ
                  dàng, vui lòng{" "}
                  <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    đăng nhập
                  </Link>{" "}
                  hoặc{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    đăng ký
                  </Link>
                  . Hoặc tiếp tục với xét nghiệm ẩn danh.
                </p>
              </div>
            )}{" "}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ngày Mong Muốn Xét Nghiệm *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng chọn ngày muốn thực hiện xét nghiệm (tối thiểu sau ngày
                hiện tại)
              </p>
            </div>
            <div>
              {isLoadingBookings ? (
                <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50">
                  <LoadingSpinner />
                </div>
              ) : (
                <TimeSlotSelector
                  selectedSlot={formData.slot}
                  selectedDate={formData.preferredDate}
                  bookedSlots={bookedSlots}
                  onChange={(slotId) =>
                    setFormData((prev) => ({ ...prev, slot: slotId }))
                  }
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng chọn khung giờ phù hợp để thực hiện xét nghiệm
              </p>
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Xét nghiệm ẩn danh
                </span>
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Nếu chọn xét nghiệm ẩn danh, chúng tôi sẽ không lưu trữ thông
                tin cá nhân của bạn và kết quả sẽ được trao đổi qua mã xét
                nghiệm.
              </p>
            </div>{" "}
            <div className="md:col-span-2">
              {" "}
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Chọn Gói Xét Nghiệm Hoặc Các Xét Nghiệm Riêng Lẻ
              </h3>{" "}
              {/* Package Selection */}
              <div className="mb-6">
                <p className="block text-sm font-medium text-gray-700 mb-4">
                  Gói Xét Nghiệm (Tiết kiệm hơn)
                </p>

                <div className="space-y-3">
                  {testTypes
                    .filter((type) => type.isPackage)
                    .map((packageType) => (
                      <div
                        key={packageType.id}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          formData.testTypes.includes(packageType.id)
                            ? "border-indigo-500 bg-indigo-50 shadow-md"
                            : packageType.popular
                            ? "border-amber-300 bg-amber-50 hover:shadow-lg"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                        onClick={() => {
                          // If package is already selected, deselect it
                          if (formData.testTypes.includes(packageType.id)) {
                            handleTestTypeChange(packageType.id);
                          } else {
                            // Clear all tests and select only this package
                            setFormData((prev) => ({
                              ...prev,
                              testTypes: [packageType.id],
                            }));
                          }
                        }}
                      >
                        {packageType.popular && (
                          <div className="absolute -top-2 left-4">
                            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                              ⭐ PHỔ BIẾN
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Radio button style indicator */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.testTypes.includes(packageType.id)
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {formData.testTypes.includes(packageType.id) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>

                            {/* Package info */}
                            <div>
                              <h4 className="font-semibold text-lg text-gray-800">
                                {packageType.label}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {packageType.description}
                              </p>

                              {/* Compact features list */}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {packageType.id === 102 ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                                    Tự chọn 3 loại
                                  </span>
                                ) : (
                                  packageType.includedTests
                                    .slice(0, 3)
                                    .map((testId) => {
                                      const test = testTypes.find(
                                        (t) => t.id === testId
                                      );
                                      return test ? (
                                        <span
                                          key={testId}
                                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs"
                                        >
                                          {test.label}
                                        </span>
                                      ) : null;
                                    })
                                )}
                                {packageType.includedTests &&
                                  packageType.includedTests.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs">
                                      +{packageType.includedTests.length - 3}{" "}
                                      khác
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                              {packageType.price.replace(".000đ", "k")}
                            </div>
                            <div className="text-xs text-gray-500">/gói</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>{" "}
              {/* Individual Test Selection - CHỈ HIỂN THỊ KHI CHỌN GÓI CUSTOM */}
              {formData.testTypes.includes(102) && (
                <>
                  {/* Divider for Custom Package */}
                  <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <div className="flex-shrink-0 px-4">
                      <span className="text-sm font-medium text-indigo-600 bg-white px-2">
                        CHỌN XÉT NGHIỆM CHO GÓI TÙY CHỈNH
                      </span>
                    </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Custom Package Notice */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-blue-800">
                        Gói Xét Nghiệm Tùy Chỉnh
                      </p>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Vui lòng chọn tối đa 3 loại xét nghiệm bên dưới để tạo gói
                      tùy chỉnh phù hợp với nhu cầu của bạn.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-800">
                        Đã chọn:{" "}
                        {
                          formData.testTypes.filter((id) => {
                            const type = testTypes.find((t) => t.id === id);
                            return type && !type.isPackage;
                          }).length
                        }
                        /3 xét nghiệm
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Giá cố định: 150.000đ
                      </span>
                    </div>
                  </div>

                  {/* Individual Test Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {testTypes
                      .filter((type) => !type.isPackage)
                      .map((type) => {
                        const isSelected = formData.testTypes.includes(type.id);
                        const currentIndividualCount =
                          formData.testTypes.filter((id) => {
                            const testType = testTypes.find((t) => t.id === id);
                            return testType && !testType.isPackage;
                          }).length;
                        const canSelect =
                          isSelected || currentIndividualCount < 3;

                        return (
                          <label
                            key={type.id}
                            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]"
                                : canSelect
                                ? "border-gray-200 hover:border-indigo-300 hover:bg-indigo-25 hover:shadow-sm"
                                : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  checked={isSelected}
                                  disabled={!canSelect}
                                  onChange={() => {
                                    if (canSelect) {
                                      handleTestTypeChange(type.id);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {type.label}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {type.description}
                                </div>
                                <div className="mt-2">
                                  {isSelected ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✓ Đã chọn
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      Bao gồm trong gói
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!canSelect && (
                              <div className="ml-2">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                  Đã đủ 3
                                </span>
                              </div>
                            )}
                          </label>
                        );
                      })}
                  </div>

                  {/* Custom Package Warning */}
                  {formData.testTypes.filter((id) => {
                    const type = testTypes.find((t) => t.id === id);
                    return type && !type.isPackage;
                  }).length === 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <p className="text-sm text-amber-800">
                          Vui lòng chọn ít nhất 1 xét nghiệm để hoàn tất gói tùy
                          chỉnh
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}{" "}
              {formData.testTypes.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Vui lòng chọn ít nhất một loại xét nghiệm
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              {" "}
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ghi Chú Bổ Sung
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Có triệu chứng bất thường hoặc thông tin cần lưu ý? Vui lòng chia sẻ tại đây."
              ></textarea>
              <div className="mt-2 text-xs text-gray-500 flex items-start">
                <svg
                  className="mr-1 h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Chia sẻ các triệu chứng, lịch sử, hay yêu cầu đặc biệt sẽ giúp
                  chúng tôi chuẩn bị tốt hơn cho buổi xét nghiệm của bạn. Thông
                  tin của bạn sẽ được bảo mật tuyệt đối.
                </span>
              </div>
            </div>
          </div>{" "}
          {/* Order Summary */}
          <div className="mt-8 mb-6 md:col-span-2 border border-gray-200 rounded-lg p-5 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Tóm tắt đơn hàng
            </h3>
            {/* Selected Test Types */}
            {formData.testTypes.length > 0 ? (
              <div className="border-b border-gray-200 py-2 mb-2">
                <p className="text-sm font-medium mb-2">
                  Loại xét nghiệm đã chọn:
                </p>{" "}
                {/* Package display */}
                {formData.testTypes.some((id) => {
                  const test = testTypes.find((t) => t.id === id);
                  return test && test.isPackage;
                }) && (
                  <>
                    {formData.testTypes.map((typeId) => {
                      const test = testTypes.find((t) => t.id === typeId);

                      if (test && test.isPackage) {
                        return (
                          <div key={test.id} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <p className="text-sm font-medium text-indigo-700">
                                {test.label}
                              </p>
                              <p className="text-sm font-bold text-indigo-700">
                                {test.price}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              {test.description}
                            </p>

                            <div className="ml-3">
                              {test.id === 102 ? (
                                // Custom package - hiển thị xét nghiệm đã chọn
                                <>
                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                    Xét nghiệm đã chọn cho gói tùy chỉnh:
                                  </p>
                                  {formData.testTypes
                                    .filter((id) => {
                                      const individualTest = testTypes.find(
                                        (t) => t.id === id
                                      );
                                      return (
                                        individualTest &&
                                        !individualTest.isPackage
                                      );
                                    })
                                    .map((id) => {
                                      const individualTest = testTypes.find(
                                        (t) => t.id === id
                                      );
                                      return (
                                        individualTest && (
                                          <span
                                            key={individualTest.id}
                                            className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs mr-1 mb-1"
                                          >
                                            ✓ {individualTest.label}
                                          </span>
                                        )
                                      );
                                    })}
                                  {formData.testTypes.filter((id) => {
                                    const type = testTypes.find(
                                      (t) => t.id === id
                                    );
                                    return type && !type.isPackage;
                                  }).length === 0 && (
                                    <span className="text-xs text-amber-600 italic">
                                      Chưa chọn xét nghiệm nào
                                    </span>
                                  )}
                                </>
                              ) : (
                                // Packages khác - hiển thị danh sách xét nghiệm có sẵn
                                <div className="flex flex-wrap gap-1">
                                  {test.includedTests.map((testId) => {
                                    const includedTest = testTypes.find(
                                      (t) => t.id === testId
                                    );
                                    return (
                                      includedTest && (
                                        <span
                                          key={includedTest.id}
                                          className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs"
                                        >
                                          {includedTest.label}
                                        </span>
                                      )
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Chưa có loại xét nghiệm nào được chọn.
              </p>
            )}

            {/* Selected Date and Slot */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 py-2 mb-2">
              <div className="flex-1 mb-2 md:mb-0">
                <p className="text-sm font-medium text-gray-700">
                  Ngày xét nghiệm:
                  <span className="font-semibold text-gray-900">
                    {" "}
                    {formData.preferredDate}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Khung giờ:{" "}
                  <span className="font-semibold text-gray-900">
                    {formData.slot !== undefined
                      ? TIME_SLOT_ENUM[formData.slot]?.time
                      : "Chưa chọn"}
                  </span>
                </p>
              </div>
            </div>

            {/* Price Summary - chỉ hiển thị nếu có xét nghiệm được chọn */}
            {formData.testTypes.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt giá:
                </p>
                <div className="flex justify-between text-sm text-gray-900 mb-1">
                  <span>Tổng giá các xét nghiệm:</span>
                  <span className="font-semibold">
                    {calculateTotal().toLocaleString()}đ
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span>{calculateTotal().toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button - chỉ hiển thị nếu không có yêu cầu đặc biệt nào */}
            {submitError === null && (
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt lịch xét nghiệm"}
                </button>
              </div>
            )}
            {submitError && (
              <div className="mt-4 text-sm text-red-500">{submitError}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
