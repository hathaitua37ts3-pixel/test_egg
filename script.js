// ==========================================
// --- PHẦN 1: ĐẾM NGƯỢC (Giữ nguyên) ---
// ==========================================
// Định dạng: YYYY-MM-DDTHH:mm:ss+07:00 (Múi giờ Việt Nam)
const targetDate = new Date('2026-08-10T00:00:00+07:00');

function updateCountdown() {
  const now = new Date();
  const vnTimeStr = now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
  const vnTime = new Date(vnTimeStr);
  const targetVnTimeStr = targetDate.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
  const targetVnTime = new Date(targetVnTimeStr);
  const diffTime = targetVnTime - vnTime;
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (days < 0) days = 0;
  document.getElementById('countdown').innerText = `Còn ${days} ngày`;
}

// Chạy ngay lần đầu và cập nhật mỗi 1 tiếng
updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60);


// ==========================================
// --- PHẦN 2: XỬ LÝ SỰ KIỆN THẤT TỊCH ---
// ==========================================

// --- CẤU HÌNH BACK-END ---
// BẠN CẦN THAY THẾ DÒNG NÀY BẰNG LINK WEB APP NHẬN ĐƯỢC TỪ GOOGLE APPS SCRIPT
const WEB_APP_URL = "BA_N_PHAI_DA_N_URL_GAS_VA_O_DAY"; 

// Lấy các nguyên tố DOM
const btnThattich = document.getElementById('btn-thattich');
const wishOverlay = document.getElementById('wish-overlay');
const closeWish = document.getElementById('close-wish');
const btnSendWish = document.getElementById('btn-send-wish');
const wishContent = document.getElementById('wish-content');

// --- 1. Xử lý Ẩn/Hiện tờ giấy nguyện ước ---
function toggleWishPaper(show) {
  if (show) {
    wishOverlay.classList.add('active');
    wishContent.focus(); // Tự động focus vào ô nhập liệu
  } else {
    wishOverlay.classList.remove('active');
    wishContent.value = ''; // Xóa nội dung cũ khi đóng
    btnSendWish.innerText = 'Gửi Nguyện Ước'; // Reset trạng thái nút
    btnSendWish.disabled = false;
  }
}

// Sự kiện click nút chính
btnThattich.addEventListener('click', () => toggleWishPaper(true));

// Sự kiện click nút đóng (x)
closeWish.addEventListener('click', () => toggleWishPaper(false));

// Sự kiện click ra ngoài tờ giấy để đóng
wishOverlay.addEventListener('click', (e) => {
  if (e.target === wishOverlay) {
    toggleWishPaper(false);
  }
});

// --- 2. Xử lý Gửi nguyện ước sang Back-end ---
btnSendWish.addEventListener('click', function() {
  const content = wishContent.value.trim();

  // Kiểm tra nếu chưa viết gì
  if (!content) {
    alert("Bạn hãy viết lời nguyện ước trước khi gửi nhé!");
    wishContent.focus();
    return;
  }

  // Khóa nút để tránh gửi nhiều lần
  btnSendWish.innerText = 'Đang gửi...';
  btnSendWish.disabled = true;

  // Sử dụng Fetch API để gửi dữ liệu dạng POST sang GAS
  fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors', // Chế độ này cần thiết khi gọi sang GAS Web App
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', 
    body: JSON.stringify({
      wish: content,
      timestamp: new Date().toLocaleString("vi-VN")
    })
  })
  .then(response => {
    // Với mode 'no-cors', ta không đọc được response trả về, 
    // nhưng nếu fetch không lỗi là coi như đã gửi thành công.
    alert("Gửi nguyện ước thành công! Chúc nguyện ước của bạn thành sự thật ✨");
    toggleWishPaper(false); // Đóng tờ giấy
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Có lỗi xảy ra khi gửi. Bạn hãy kiểm tra lại cấu hình Web App URL nhé!");
    btnSendWish.innerText = 'Gửi Nguyện Ước';
    btnSendWish.disabled = false;
  });
});
