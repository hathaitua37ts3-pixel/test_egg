// --- THIẾT LẬP NGÀY MỤC TIÊU ---
// Định dạng: YYYY-MM-DDTHH:mm:ss+07:00 (Múi giờ Việt Nam)
const targetDate = new Date('2026-08-10T00:00:00+07:00');

function updateCountdown() {
  // Lấy thời gian hiện tại
  const now = new Date();
  
  // Ép kiểu tính toán trên múi giờ Việt Nam (Asia/Ho_Chi_Minh)
  const vnTimeStr = now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
  const vnTime = new Date(vnTimeStr);
  
  const targetVnTimeStr = targetDate.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
  const targetVnTime = new Date(targetVnTimeStr);

  // Tính khoảng cách (tính bằng milliseconds)
  const diffTime = targetVnTime - vnTime;
  
  // Quy đổi ra số ngày (làm tròn lên)
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Không cho hiển thị số âm nếu đã qua ngày
  if (days < 0) days = 0;

  // Cập nhật giao diện
  document.getElementById('countdown').innerText = `Còn ${days} ngày`;
}

// Chạy ngay lần đầu
updateCountdown();

// Cập nhật lại mỗi 1 tiếng đồng hồ (để tự động qua ngày mới nếu người dùng treo tab)
setInterval(updateCountdown, 1000 * 60 * 60);
