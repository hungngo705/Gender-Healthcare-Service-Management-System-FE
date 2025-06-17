import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import stiTestingService from "../../services/stiTestingService";
import { format } from "date-fns";
import { toast } from "react-toastify";

function BookingForm() {
  const { currentUser } = useAuth();

  // State for appointment form
  const [formData, setFormData] = useState({
    userId: currentUser?.id || "",
    testTypes: [],
    preferredDate: format(new Date(), "yyyy-MM-dd"),
    note: "",
    isAnonymous: false,
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }; // Handle test type selection
  const handleTestTypeChange = (testTypeId) => {
    setFormData((prev) => {
      // Check if the test type is already selected
      const isSelected = prev.testTypes.includes(testTypeId);

      // Check if it's a package
      const selectedType = testTypes.find((t) => t.id === testTypeId);
      const isPackage = selectedType?.isPackage;

      if (isSelected) {
        // Remove the test type if already selected
        return {
          ...prev,
          testTypes: prev.testTypes.filter((id) => id !== testTypeId),
        };
      } else {
        let newTestTypes;

        if (isPackage) {
          // Special handling for "Xét Nghiệm Mục Tiêu" package (id: 102)
          if (testTypeId === 102) {
            // For targeted package, only select the package itself
            // Individual tests will be selected separately
            newTestTypes = [testTypeId];
          } else {
            // For other packages, remove any other packages and individual tests
            newTestTypes = [testTypeId];
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
          }
        }

        return {
          ...prev,
          testTypes: newTestTypes,
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submitData = {
        ...formData,
        // For logged-in users, BE will get userId from token
        userId: currentUser ? undefined : formData.userId,
      };

      const response = await stiTestingService.create(submitData);
      if (response && response.data && response.data.is_success) {
        toast.success("Yêu cầu xét nghiệm STI của bạn đã được gửi thành công!");
        setSubmitSuccess(true);
      } else {
        throw new Error(
          response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu"
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      setSubmitError(
        error.message || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau."
      );
      toast.error(
        error.message || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  }; // Define test types
  const testTypes = [
    // Packages first - these are bundles of tests with special pricing
    {
      id: 100,
      label: "Xét Nghiệm Cơ Bản",
      description: "Gói xét nghiệm phù hợp cho việc kiểm tra định kỳ",
      price: "79.000đ",
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
      label: "Xét Nghiệm Toàn Diện",
      description: "Gói xét nghiệm đầy đủ nhất cho sức khỏe tình dục",
      price: "149.000đ",
      isPackage: true,
      includedTests: [4, 1, 2, 0, 5, 6, 7, 8], // All basic + HIV, Herpes, Hepatitis B & C, Trichomonas
      popular: true,
      features: [
        "Tất cả xét nghiệm của gói Cơ Bản",
        "Xét nghiệm HIV",
        "Xét nghiệm Herpes",
        "Xét nghiệm Hepatitis B & C",
        "Xét nghiệm Trichomonas",
        "Kết quả trong vòng 3-5 ngày",
        "Tư vấn chi tiết sau xét nghiệm",
      ],
    },
    {
      id: 102,
      label: "Xét Nghiệm Mục Tiêu",
      description: "Gói xét nghiệm tập trung cho các nguy cơ cụ thể",
      price: "99.000đ",
      isPackage: true,
      includedTests: [], // User can choose 3 individual tests
      popular: false,
      features: [
        "Chọn 3 loại xét nghiệm bất kỳ",
        "Phân tích chi tiết từng loại",
        "Kết quả trong vòng 2-4 ngày",
        "Tư vấn sau xét nghiệm",
      ],
      maxSelection: 3,
    },

    // Individual tests
    { id: 0, label: "HIV", description: "Xét nghiệm HIV", price: "45.000đ" },
    {
      id: 1,
      label: "Gonorrhea (Lậu)",
      description: "Phát hiện vi khuẩn Neisseria gonorrhoeae",
      price: "35.000đ",
    },
    {
      id: 2,
      label: "Syphilis (Giang Mai)",
      description: "Phát hiện vi khuẩn Treponema pallidum",
      price: "30.000đ",
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
    const isTargetedPackageSelected = formData.testTypes.includes(102);

    if (isTargetedPackageSelected) {
      // For targeted package, return the package price regardless of individual selections
      return 99000; // 99.000đ
    }

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

  return (
    <div id="appointment" className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Đặt Lịch Xét Nghiệm STI
      </h2>

      {submitSuccess ? (
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg
            className="h-12 w-12 text-green-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Yêu Cầu Đã Được Gửi!
          </h3>
          <p className="text-gray-600 mb-4">
            Yêu cầu xét nghiệm STI của bạn đã được gửi thành công. Nhân viên y
            tế sẽ liên hệ với bạn để xác nhận lịch hẹn.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Gửi Yêu Cầu Khác
          </button>
        </div>
      ) : (
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
              )}
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
                  Vui lòng chọn ngày muốn thực hiện xét nghiệm (tối thiểu sau
                  ngày hiện tại)
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
                                {formData.testTypes.includes(
                                  packageType.id
                                ) && (
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
                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <div className="flex-shrink-0 px-4">
                    <span className="text-sm font-medium text-gray-500 bg-white px-2">
                      HOẶC CHỌN RIÊNG LẺ
                    </span>
                  </div>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>{" "}
                {/* Individual Test Selection */}
                {formData.testTypes.includes(102) && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-blue-800">
                        Gói Xét Nghiệm Mục Tiêu
                      </p>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Vui lòng chọn tối đa 3 loại xét nghiệm bên dưới.
                      <span className="font-semibold ml-1">
                        Đã chọn:{" "}
                        {
                          formData.testTypes.filter((id) => {
                            const type = testTypes.find((t) => t.id === id);
                            return type && !type.isPackage;
                          }).length
                        }
                        /3
                      </span>
                    </p>
                  </div>
                )}{" "}
                <p className="block text-sm font-medium text-gray-700 mb-4">
                  {formData.testTypes.includes(102)
                    ? "Chọn các xét nghiệm cho gói của bạn"
                    : "Các Xét Nghiệm Đơn Lẻ"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {testTypes
                    .filter((type) => !type.isPackage)
                    .map((type) => {
                      const isSelected = formData.testTypes.includes(type.id);
                      const isTargetedPackageSelected =
                        formData.testTypes.includes(102);
                      const currentIndividualCount = formData.testTypes.filter(
                        (id) => {
                          const testType = testTypes.find((t) => t.id === id);
                          return testType && !testType.isPackage;
                        }
                      ).length;
                      const canSelect =
                        !isTargetedPackageSelected ||
                        isSelected ||
                        currentIndividualCount < 3;

                      return (
                        <label
                          key={type.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 shadow-sm"
                              : canSelect
                              ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                              checked={isSelected}
                              disabled={!canSelect}
                              onChange={() => {
                                if (canSelect) {
                                  handleTestTypeChange(type.id);
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {type.label}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {type.description}
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold text-indigo-600 text-sm">
                                  {isTargetedPackageSelected && isSelected ? (
                                    <span className="text-green-600">
                                      ✓ Included
                                    </span>
                                  ) : (
                                    type.price
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                </div>{" "}
                {formData.testTypes.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Vui lòng chọn ít nhất một loại xét nghiệm
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ghi Chú Bổ Sung
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={4}
                  value={formData.note}
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
                    Chia sẻ các triệu chứng, lịch sử, hay yêu cầu đặc biệt sẽ
                    giúp chúng tôi chuẩn bị tốt hơn cho buổi xét nghiệm của bạn.
                    Thông tin của bạn sẽ được bảo mật tuyệt đối.
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
                  }) ? (
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
                                  // Special handling for targeted package
                                  <>
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Xét nghiệm đã chọn:
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
                                      .map((individualTestId) => {
                                        const individualTest = testTypes.find(
                                          (t) => t.id === individualTestId
                                        );
                                        return individualTest ? (
                                          <div
                                            key={individualTest.id}
                                            className="flex justify-between ml-2"
                                          >
                                            <p className="text-xs text-gray-600">
                                              • {individualTest.label}
                                            </p>
                                          </div>
                                        ) : null;
                                      })}
                                  </>
                                ) : (
                                  // Regular package display
                                  <>
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Bao gồm các xét nghiệm:
                                    </p>
                                    {test.includedTests.map(
                                      (includedTestId) => {
                                        const includedTest = testTypes.find(
                                          (t) => t.id === includedTestId
                                        );
                                        return includedTest ? (
                                          <div
                                            key={includedTest.id}
                                            className="flex justify-between ml-2"
                                          >
                                            <p className="text-xs text-gray-600">
                                              • {includedTest.label}
                                            </p>
                                          </div>
                                        ) : null;
                                      }
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </>
                  ) : (
                    // Individual tests display
                    <>
                      {formData.testTypes.map((typeId) => {
                        const test = testTypes.find((t) => t.id === typeId);
                        return test ? (
                          <div
                            key={test.id}
                            className="flex justify-between ml-2 mb-1"
                          >
                            <p className="text-sm text-gray-600">
                              {test.label}
                            </p>
                            <p className="text-sm font-medium">{test.price}</p>
                          </div>
                        ) : null;
                      })}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <p className="text-sm text-gray-600">Chưa chọn xét nghiệm</p>
                  <p className="text-sm font-medium">-</p>
                </div>
              )}

              {/* Preferred Date */}
              <div className="flex justify-between border-b border-gray-200 py-2">
                <div>
                  <p className="text-sm font-medium">Ngày xét nghiệm</p>
                  <p className="text-sm text-gray-600">
                    {formData.preferredDate
                      ? format(new Date(formData.preferredDate), "dd/MM/yyyy")
                      : "Chưa chọn"}
                  </p>
                </div>
                <p className="text-sm font-medium">-</p>
              </div>

              {/* Anonymous Testing */}
              <div className="flex justify-between border-b border-gray-200 py-2">
                <div>
                  <p className="text-sm font-medium">Xét nghiệm ẩn danh</p>
                  <p className="text-sm text-gray-600">
                    {formData.isAnonymous ? "Có" : "Không"}
                  </p>
                </div>
                <p className="text-sm font-medium">-</p>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-3">
                <p className="text-base font-medium">Tổng tiền</p>
                <p className="text-base font-bold text-indigo-600">
                  {calculateTotal().toLocaleString()}đ
                </p>
              </div>
            </div>
            <div className="mt-4 md:col-span-2">
              <p className="text-sm text-gray-500 mb-4">
                Thông tin của bạn sẽ được giữ bí mật nghiêm ngặt. Bằng cách gửi
                mẫu đơn này, bạn đồng ý với{" "}
                <Link
                  to="/privacy-policy"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  chính sách bảo mật
                </Link>{" "}
                của chúng tôi.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || formData.testTypes.length === 0}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting || formData.testTypes.length === 0
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Gửi Yêu Cầu Xét Nghiệm"
                )}
              </button>
            </div>
            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md md:col-span-2">
                {submitError}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default BookingForm;
