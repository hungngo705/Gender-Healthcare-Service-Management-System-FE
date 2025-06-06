const consultants = [
  {
    id: 1,
    name: "TS. Nguyễn Thị Minh",
    specialty: "Sức khỏe sinh sản",
    shortBio:
      "Chuyên gia với hơn 15 năm kinh nghiệm về sức khỏe sinh sản phụ nữ",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 15,
    bio: "TS. Nguyễn Thị Minh tốt nghiệp Đại học Y Hà Nội và hoàn thành chương trình Tiến sĩ về Sức khỏe Sinh sản tại Đại học Melbourne, Úc. Bà có hơn 15 năm kinh nghiệm trong lĩnh vực phụ khoa và sức khỏe sinh sản phụ nữ.\n\nBà đã được đào tạo chuyên sâu về các vấn đề sức khỏe sinh sản như vô sinh, kế hoạch hóa gia đình, viêm nhiễm phụ khoa và các vấn đề liên quan đến kinh nguyệt. TS. Minh nổi tiếng với phương pháp tiếp cận toàn diện, kết hợp kiến thức y học hiện đại và sự quan tâm đến các khía cạnh tâm lý, xã hội của sức khỏe phụ nữ.",
    experience: [
      {
        role: "Trưởng khoa Phụ Sản",
        workplace: "Bệnh viện Quốc tế Vinmec, TP. HCM",
        period: "2018 - Hiện tại",
        description:
          "Quản lý chuyên môn và điều phối đội ngũ y tế của khoa Phụ Sản",
      },
      {
        role: "Bác sĩ tư vấn cao cấp",
        workplace: "Phòng khám Đa khoa Quốc tế, TP. HCM",
        period: "2012 - 2018",
        description: "Tư vấn và điều trị các vấn đề sức khỏe sinh sản phụ nữ",
      },
      {
        role: "Nghiên cứu viên",
        workplace: "Đại học Y Melbourne, Úc",
        period: "2008 - 2012",
        description: "Nghiên cứu về vô sinh và các phương pháp hỗ trợ sinh sản",
      },
    ],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    specializations: [
      "Kế hoạch hóa gia đình",
      "Khám sức khỏe tiền hôn nhân",
      "Tư vấn vô sinh",
    ],
    certifications: [
      "Hội Sản Phụ Khoa Việt Nam",
      "Hiệp hội Sức khỏe Sinh sản Châu Á",
    ],
    bookedShifts: {
      "6/6/2025": [0], // 0: 8h-10h, 1: 10h-12h, 2: 13h-15h, 3: 15h-17h
      "7/6/2025": [1, 2],
      "8/6/2025": [0, 1, 2, 3],
      "9/6/2025": [0, 1],
      "10/6/2025": [2, 3],
      "11/6/2025": [0, 1],
      "12/6/2025": [1, 3],
      "13/6/2025": [0, 3],
      "14/6/2025": [1, 2, 3],
      "15/6/2025": [2, 3],
      "16/6/2025": [],
      "17/6/2025": [0, 1],
      "18/6/2025": [0, 2, 3],
      "19/6/2025": [0],
      "20/6/2025": [1, 3],
    },
  },
  {
    id: 2,
    name: "BS. Trần Văn Nam",
    specialty: "Nam khoa",
    shortBio:
      "Chuyên gia nam khoa với kinh nghiệm điều trị các vấn đề sức khỏe nam giới",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 98,
    yearsExperience: 12,
    bio: "BS. Trần Văn Nam là bác sĩ chuyên khoa Nam học với hơn 12 năm kinh nghiệm. Ông tốt nghiệp Đại học Y Dược TP.HCM và hoàn thành chương trình chuyên khoa sâu về Nam học và Y học giới tính tại Singapore.\n\nBS. Nam đặc biệt chú trọng đến việc tạo môi trường thoải mái cho bệnh nhân nam giới khi thảo luận về các vấn đề nhạy cảm liên quan đến sức khỏe sinh sản và tình dục. Ông nổi tiếng với phương pháp tư vấn thân thiện và cởi mở, giúp bệnh nhân vượt qua tâm lý e ngại khi tìm kiếm sự giúp đỡ y tế.",
    experience: [
      {
        role: "Trưởng phòng khám Nam khoa",
        workplace: "Bệnh viện Đa khoa Tâm Anh, TP. HCM",
        period: "2016 - Hiện tại",
        description: "Điều trị và tư vấn các vấn đề sức khỏe nam giới",
      },
      {
        role: "Bác sĩ Nam khoa",
        workplace: "Bệnh viện Đại học Y Dược TP. HCM",
        period: "2010 - 2016",
        description:
          "Khám và điều trị các bệnh lý về nam khoa và sức khỏe sinh sản nam",
      },
    ],

    languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
    specializations: [
      "STI/STD",
      "HIV/AIDS",
      "Tư vấn tình dục an toàn",
      "Sức khỏe nam giới",
    ],
    certifications: [
      "Hiệp hội Y tế Công cộng Việt Nam",
      "Chương trình phòng chống HIV/AIDS Quốc gia",
    ],
    bookedShifts: {
      "6/6/2025": [1, 2],
      "7/6/2025": [0, 3],
      "8/6/2025": [1, 2],
      "9/6/2025": [0, 2, 3],
      "10/6/2025": [1],
      "11/6/2025": [],
      "12/6/2025": [0, 1, 2],
      "13/6/2025": [3],
      "14/6/2025": [0, 1],
      "15/6/2025": [0, 2, 3],
      "16/6/2025": [1, 2],
      "17/6/2025": [0, 3],
      "18/6/2025": [2, 3],
      "19/6/2025": [0, 1],
      "20/6/2025": [1, 3],
    },
  },
  {
    id: 3,
    name: "ThS. Lê Thị Hương",
    specialty: "Tư vấn tâm lý",
    shortBio: "Nhà tư vấn tâm lý chuyên về các vấn đề giới tính và tình dục",
    image:
      "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 156,
    yearsExperience: 10,
    bio: "ThS. Lê Thị Hương là nhà tư vấn tâm lý với hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn sức khỏe tâm lý liên quan đến giới tính và tình dục. Bà tốt nghiệp Thạc sĩ Tâm lý học Lâm sàng tại Đại học Khoa học Xã hội và Nhân văn, ĐHQG TP.HCM và được đào tạo chuyên sâu về Tư vấn Tình dục học tại Hoa Kỳ.\n\nThS. Hương có kinh nghiệm phong phú trong việc hỗ trợ các cá nhân và cặp đôi vượt qua các thách thức về mối quan hệ, bản dạng giới, xu hướng tính dục và sức khỏe tình dục. Bà nổi tiếng với phương pháp tiếp cận không phán xét và tôn trọng đa dạng văn hóa.",
    experience: [
      {
        role: "Nhà tư vấn tâm lý cao cấp",
        workplace: "Trung tâm Tư vấn Tâm lý Thăng Long, TP. HCM",
        period: "2015 - Hiện tại",
        description:
          "Tư vấn các vấn đề tâm lý liên quan đến giới tính và tình dục",
      },
      {
        role: "Giảng viên",
        workplace:
          "Khoa Tâm lý học, Đại học Khoa học Xã hội và Nhân văn, ĐHQG TP.HCM",
        period: "2012 - Hiện tại",
        description:
          "Giảng dạy các môn học về tâm lý học giới tính và tư vấn tâm lý",
      },
    ],

    languages: ["Tiếng Việt", "Tiếng Anh"],
    specializations: [
      "Tư vấn tâm lý",
      "Căng thẳng và lo âu",
      "Xác định giới tính",
      "Rối loạn tâm lý liên quan đến tình dục",
    ],
    certifications: [
      "Hiệp hội Tâm lý học Việt Nam",
      "Hiệp hội Tâm lý học Lâm sàng Châu Á",
    ],
    bookedShifts: {
      "6/6/2025": [0, 3],
      "7/6/2025": [],
      "8/6/2025": [1, 3],
      "9/6/2025": [0, 1, 2],
      "10/6/2025": [2, 3],
      "11/6/2025": [0, 1],
      "12/6/2025": [1],
      "13/6/2025": [0, 2, 3],
      "14/6/2025": [],
      "15/6/2025": [0, 1, 3],
      "16/6/2025": [2],
      "17/6/2025": [0, 1, 2],
      "18/6/2025": [3],
      "19/6/2025": [0, 1, 2],
      "20/6/2025": [1, 2, 3],
    },
  },
  {
    id: 4,
    name: "BS. Phạm Thị Lan Anh",
    specialty: "Tư vấn sức khỏe giới tính",
    shortBio:
      "Bác sĩ chuyên về giáo dục giới tính và sức khỏe tình dục cho thanh thiếu niên",
    image:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 78,
    yearsExperience: 8,
    bio: "BS. Phạm Thị Lan Anh là bác sĩ chuyên về sức khỏe sinh sản và giáo dục giới tính với 8 năm kinh nghiệm. Bà tốt nghiệp Đại học Y Hà Nội và được đào tạo thêm về Tư vấn Sức khỏe Tình dục cho Thanh thiếu niên tại Thái Lan.\n\nBS. Lan Anh đặc biệt quan tâm đến việc cung cấp thông tin chính xác và phù hợp với độ tuổi về sức khỏe sinh sản và tình dục cho thanh thiếu niên. Bà có kinh nghiệm trong việc thiết kế và triển khai các chương trình giáo dục giới tính tại nhiều trường học và cộng đồng khác nhau.",
    experience: [
      {
        role: "Bác sĩ tư vấn",
        workplace: "Trung tâm Chăm sóc Sức khỏe Sinh sản Thanh niên, TP. HCM",
        period: "2016 - Hiện tại",
        description:
          "Tư vấn và giáo dục về sức khỏe sinh sản và tình dục cho thanh thiếu niên",
      },
      {
        role: "Điều phối viên dự án",
        workplace: "Tổ chức Marie Stopes International Việt Nam",
        period: "2013 - 2016",
        description:
          "Quản lý các dự án về sức khỏe sinh sản cho thanh niên tại các vùng nông thôn",
      },
    ],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    specializations: [
      "Sức khỏe LGBTQ+",
      "Tư vấn chuyển giới",
      "Tư vấn tâm lý",
      "Liệu pháp hormone",
    ],
    certifications: [
      "Mạng lưới Sức khỏe LGBTQ+ Đông Nam Á",
      "Chứng chỉ chuyên môn về Y tế Giới tính",
    ],
    bookedShifts: {
      "6/6/2025": [2, 3],
      "7/6/2025": [0, 1, 2],
      "8/6/2025": [],
      "9/6/2025": [1, 2],
      "10/6/2025": [0, 3],
      "11/6/2025": [0, 1, 2],
      "12/6/2025": [3],
      "13/6/2025": [0, 1],
      "14/6/2025": [1, 2],
      "15/6/2025": [0, 3],
      "16/6/2025": [0, 1, 2],
      "17/6/2025": [],
      "18/6/2025": [1, 2, 3],
      "19/6/2025": [0, 2],
      "20/6/2025": [0, 1, 3],
    },
  },
];

export default consultants; // Export mặc định
export { consultants }; // Export có tên
