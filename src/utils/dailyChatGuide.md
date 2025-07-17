# Daily.co Chat Integration Guide

## Tổng quan

Hệ thống đã được tích hợp để lưu trữ tin nhắn chat từ Daily.co meeting vào database. Người dùng có thể:

1. **Gửi tin nhắn qua Daily.co**: Tin nhắn sẽ được gửi qua Daily.co và tự động lưu vào database
2. **Xem tin nhắn realtime**: Tin nhắn từ Daily.co sẽ hiển thị ngay lập tức
3. **Xem lịch sử chat**: Tất cả tin nhắn đã lưu có thể xem lại

## Cách sử dụng

### 1. Trong meeting room:

- Nhấn nút Chat để mở chat panel
- Chọn chế độ chat:
  - **Database**: Chat riêng của hệ thống
  - **Daily.co Live**: Chat qua Daily.co meeting

### 2. Gửi tin nhắn Daily.co:

- Chọn chế độ "Daily.co Live"
- Nhập tin nhắn và gửi
- Tin nhắn sẽ được gửi qua Daily.co và lưu vào database

### 3. Xem lịch sử:

- Nhấn nút "Lịch sử" để xem tin nhắn đã lưu
- Nhấn "Live" để quay lại chế độ realtime

## Tính năng kỹ thuật

### Event Listeners:
- `app-message`: Lắng nghe tin nhắn từ Daily.co
- Tự động lưu tin nhắn vào database với prefix `[Daily Chat]`

### Error Handling:
- Nếu lưu database thất bại, tin nhắn vẫn hiển thị trong UI
- Logging chi tiết để debug

### State Management:
- `dailyMessages`: Lưu tin nhắn Daily.co realtime
- `messages`: Lưu tin nhắn từ database
- `chatMode`: Chế độ chat hiện tại
- `showHistory`: Hiển thị lịch sử hay realtime

## Cấu trúc tin nhắn Daily.co

```javascript
{
  id: "daily-{timestamp}-{userId}",
  fromId: "userId",
  fromName: "User Name",
  data: { message: "Nội dung tin nhắn" },
  timestamp: new Date(),
  isDailyMessage: true,
  isLocal: true // chỉ cho tin nhắn của người gửi
}
```

## Database Format

Tin nhắn Daily.co được lưu với format:
- Message: `[Daily Chat] {nội dung tin nhắn}`
- IsSystemMessage: false
- SenderName: Tên người gửi
- SenderRole: Vai trò trong cuộc họp 