/**
 * Timezone utilities for Vietnam (UTC+7) timezone handling
 */

/**
 * Format date for Vietnam timezone (UTC+7)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string|null} - Formatted date string for backend or null
 */
export const formatDateForVietnamTimezone = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Create date object in Vietnam timezone (UTC+7)
    const date = new Date(dateString + 'T00:00:00+07:00');
    
    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return null;
    }
    
    // Convert to Vietnam timezone and format as YYYY-MM-DD
    const vietnamDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
    return vietnamDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for Vietnam timezone:', error);
    return null;
  }
};

/**
 * Get current date in Vietnam timezone
 * @returns {string} - Current date in YYYY-MM-DD format
 */
export const getCurrentVietnamDate = () => {
  const now = new Date();
  const vietnamDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  return vietnamDate.toISOString().split('T')[0];
};

/**
 * Format date for display in Vietnamese locale
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date for display
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh"
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return "Ngày không hợp lệ";
  }
};

/**
 * Format datetime for display in Vietnamese locale
 * @param {string} dateTimeString - DateTime string
 * @returns {string} - Formatted datetime for display
 */
export const formatDateTimeForDisplay = (dateTimeString) => {
  if (!dateTimeString) return "Chưa cập nhật";
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh"
    });
  } catch (error) {
    console.error('Error formatting datetime for display:', error);
    return "Ngày không hợp lệ";
  }
};

/**
 * Check if a date is in the future relative to Vietnam timezone
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} - True if date is in the future
 */
export const isDateInFuture = (dateString) => {
  if (!dateString) return false;
  
  try {
    const inputDate = new Date(dateString + 'T00:00:00+07:00');
    const currentVietnamDate = new Date(getCurrentVietnamDate() + 'T00:00:00+07:00');
    
    return inputDate > currentVietnamDate;
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Validate date range for menstrual cycle
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {object} - Validation result with isValid and errors
 */
export const validateMenstrualCycleDates = (startDate, endDate) => {
  const errors = [];
  
  // Check if start date is in future
  if (isDateInFuture(startDate)) {
    errors.push('Ngày bắt đầu chu kỳ không thể ở tương lai');
  }
  
  // Check if end date is in future (if provided)
  if (endDate && isDateInFuture(endDate)) {
    errors.push('Ngày kết thúc chu kỳ không thể ở tương lai');
  }
  
  // Check if end date is after start date
  if (startDate && endDate) {
    const start = new Date(startDate + 'T00:00:00+07:00');
    const end = new Date(endDate + 'T00:00:00+07:00');
    
    if (end <= start) {
      errors.push('Ngày kết thúc chu kỳ phải sau ngày bắt đầu');
    }
    
    // Check period length (max 10 days)
    const periodLength = (end - start) / (1000 * 60 * 60 * 24);
    if (periodLength > 10) {
      errors.push('Thời gian kinh nguyệt không thể vượt quá 10 ngày');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate cycle date range (simplified version for form validation)
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {boolean} - True if valid date range
 */
export const validateCycleDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // Allow empty end date
  
  try {
    const start = new Date(startDate + 'T00:00:00+07:00');
    const end = new Date(endDate + 'T00:00:00+07:00');
    
    // End date must be after start date
    if (end <= start) return false;
    
    // Period length cannot exceed 10 days
    const periodLength = (end - start) / (1000 * 60 * 60 * 24);
    if (periodLength > 10) return false;
    
    return true;
  } catch (error) {
    console.error('Error validating cycle date range:', error);
    return false;
  }
};