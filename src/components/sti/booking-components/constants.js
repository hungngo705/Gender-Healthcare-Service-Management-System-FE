// Các gói xét nghiệm (cập nhật theo bảng giá mới)
export const STI_PACKAGES = [
  {
    id: 0,
    name: "Gói Cơ Bản",
    price: 300000,
    description:
      "Bao gồm 3 xét nghiệm: Chlamydia, Gonorrhea (Lậu), Syphilis (Giang Mai)",
  },
  {
    id: 1,
    name: "Gói Tự Chọn (3 loại)",
    price: 330000,
    description: "Tự chọn 3 loại xét nghiệm",
  },
  {
    id: 2,
    name: "Gói Toàn Diện",
    price: 550000,
    description:
      "Bao gồm 9 xét nghiệm: Gói Cơ Bản + HIV, Herpes, Hepatitis B & C, Trichomonas",
  },
];

// Các loại xét nghiệm (cập nhật theo bảng giá mới)
export const STI_TEST_TYPES = [
  {
    id: 0,
    name: "Chlamydia",
    price: 120000,
    description: "Tăng giá nhưng vẫn ở mức thấp hơn nhóm trên",
  },
  {
    id: 1,
    name: "Gonorrhea (Lậu)",
    price: 120000,
    description: "Tương tự Chlamydia",
  },
  {
    id: 2,
    name: "Syphilis (Giang mai)",
    price: 100000,
    description: "Giá là xét nghiệm có giá thấp nhất để dễ tiếp cận",
  },
  {
    id: 3,
    name: "HIV",
    price: 160000,
    description: "Xét nghiệm quan trọng, giá cao nhất trong nhóm phổ thông",
  },
  { id: 4, name: "Hepatitis B (Viêm gan B)", price: 140000 },
  { id: 5, name: "Hepatitis C (Viêm gan C)", price: 140000 },
  { id: 6, name: "Herpes", price: 140000 },
  {
    id: 7,
    name: "HPV",
    price: 180000,
    description: "Giữ vị trí là xét nghiệm đơn lẻ đắt nhất",
  },
  { id: 8, name: "Mycoplasma", price: 140000 },
  { id: 9, name: "Trichomonas", price: 120000 },
];
