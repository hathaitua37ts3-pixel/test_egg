// ============================================================
// 1. CẤU HÌNH LIÊN KẾT TỚI GOOGLE APPS SCRIPT
// Dán link Web App của bạn vừa copy ở Phần 1 vào giữa 2 dấu ngoặc kép:
const API_URL = "https://script.google.com/macros/s/AKfycb.../exec";
// ============================================================

let localLastUpdated = 0; // Biến kiểm tra phiên bản dữ liệu

/**
 * HÀM 1: Lấy dữ liệu từ máy chủ GAS về
 * Tương đương với: google.script.run.withSuccessHandler(...).getGameDataFromSheet()
 */
async function loadGameData(callback) {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    if (data) {
      localLastUpdated = data.lastUpdated || 0;
      if (typeof callback === "function") {
        callback(data);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ máy chủ:", error);
  }
}

/**
 * HÀM 2: Lưu dữ liệu lên máy chủ GAS
 * Tương đương với: google.script.run.saveGameDataToSheet(clientData)
 */
async function saveGameData(clientData) {
  try {
    // Cập nhật timestamp tạm trên máy
    localLastUpdated = Date.now();
    clientData.lastUpdated = localLastUpdated;

    // Gửi ngầm lên Google Apps Script
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // Bắt buộc để trình duyệt không chặn CORS của Google
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(clientData)
    });

    console.log("Đã gửi dữ liệu lưu lên máy chủ thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu lên máy chủ:", error);
  }
}

/**
 * HÀM 3: TỰ ĐỘNG ĐỒNG BỘ 2 CHIỀU (Polling)
 * Cứ mỗi 2.5 giây, tự kiểm tra xem máy của đối phương có cập nhật dữ liệu mới không
 */
function startRealtimeSync(onUpdateCallback) {
  setInterval(async () => {
    try {
      const res = await fetch(API_URL);
      const serverData = await res.json();
      
      // Nếu server có dữ liệu và dữ liệu đó MỚI HƠN phiên bản hiện tại ở máy này
      if (serverData && serverData.lastUpdated && serverData.lastUpdated > localLastUpdated) {
        console.log("Phát hiện dữ liệu mới từ máy bên kia, đang cập nhật...");
        localLastUpdated = serverData.lastUpdated;
        
        if (typeof onUpdateCallback === "function") {
          onUpdateCallback(serverData);
        }
      }
    } catch (e) {
      // Bỏ qua nếu mất mạng chốc lát
    }
  }, 2500); // 2500ms = 2.5 giây
}

// ============================================================
// VÍ DỤ CÁCH GẮN VÀO GAME CỦA BẠN:
// ============================================================

// 1. Khi vừa mở web -> Tải dữ liệu trang trại lần đầu
window.addEventListener("DOMContentLoaded", () => {
  loadGameData((gameData) => {
    console.log("Dữ liệu trang trại ban đầu:", gameData);
    // TODO: Viết hàm render giao diện trứng, trang trại của bạn ở đây
    // renderFarm(gameData);
  });

  // Bật chế độ tự động đồng bộ khi máy kia thao tác
  startRealtimeSync((newData) => {
    // Khi máy kia có thao tác bấm gì đó, hàm này sẽ tự chạy để vẽ lại giao diện
    // renderFarm(newData);
  });
});

// 2. Khi bạn bấm nút (ví dụ: Ấp trứng, nhặt trứng, bán trứng):
function onUserAction(newDataState) {
  // 1. Cập nhật giao diện máy mình ngay lập tức
  // renderFarm(newDataState);

  // 2. Bắn dữ liệu lên máy chủ để máy bên kia nhận được
  saveGameData(newDataState);
}
