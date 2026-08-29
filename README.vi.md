# Webnovel Writer (DSH Plugin & Engine)

[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](package.json)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-Plugin-purple.svg)](https://github.com/deepseek-ai/deepseek-harness)

**Hệ thống AI Multi-Agent & RAG chuyên sâu cho sáng tác tiểu thuyết mạng (Web Novel) trường thiên.**

Được thiết kế để giải quyết bài toán lớn nhất của AI khi viết truyện dài hàng trăm đến hàng triệu chữ: **Giữ vững thiết lập, không bao giờ quên chi tiết, kiểm soát phục bút và duy trì mạch lạc cốt truyện.**

---

## 🌟 Tại Sao Hệ Thống Này Vượt Trội?

Viết một chương truyện đầu tiên bằng AI rất dễ, nhưng viết đến chương 80, chương 200 thì các AI thông thường sẽ bắt đầu bị "ảo giác" và "quên tình tiết":
- Nhân vật bị lệch tính cách (OOC - Out Of Character).
- Hệ thống cảnh giới, cấp bậc sức mạnh và logic thế giới đánh nhau chan chát.
- Phục bút gài ở chương trước không bao giờ được thu hồi.
- Nhịp độ truyện bị loãng, thiếu cảm xúc cao trào (sảng điểm).

**Webnovel Writer** biến quy trình sáng tác thành một hệ thống quản lý trạng thái tương tự như Git:
* Mỗi chương viết xong được lưu thành một bản **Commit**.
* Toàn bộ sự kiện mới, trang bị thu được, nhân vật mới quen được nạp tự động vào **Vector DB & SQLite Index**.
* Bộ lọc **13-Checkers** tự động kiểm duyệt nhịp độ, logic và tính cách trước khi xuất bản.

---

## 🛠️ Các Lệnh & Tính Năng Chính:

| Lệnh / Tool | Tên Tiếng Việt | Mô Tả |
|---|---|---|
| `webnovel_init` / `/webnovel-init` | **Khởi Tạo Tác Phẩm** | Phỏng vấn theo từng giai đoạn để xây dựng: Khung truyện, Thiết lập thế giới, Hồ sơ nhân vật, Hệ thống sức mạnh, Kim thủ chỉ và Dàn ý tổng thể. |
| `webnovel_plan` / `/webnovel-plan` | **Lập Dàn Ý Quyển & Chương** | Dựa trên tổng cương để chia quyển, chia từng chương, tính toán dòng thời gian và điểm cao trào. |
| `webnovel_write` / `/webnovel-write` | **Soạn Thảo Chương Truyện** | Quy trình trọn gói: Chuẩn bị ngữ cảnh RAG ➔ Khởi thảo ➔ Tự đánh giá ➔ Trau chuốt ➔ Lưu trữ ➔ Khóa dữ liệu trạng thái. |
| `webnovel_review` / `/webnovel-review` | **Đánh Giá & Kiểm Duyệt** | Đánh giá từ 6 chiều: Điểm sảng, Tính nhất quán, Nhịp độ, Tránh OOC, Độ liền mạch, Sức giữ chân độc giả. |
| `webnovel_status` / `/webnovel-query` | **Tra Cứu Trạng Thái** | Tra cứu đồ thị quan hệ nhân vật, tiến độ phục bút, cấp bậc tu vi hiện tại. |
| `webnovel_doctor` / `/webnovel-doctor` | **Bác Sĩ Kiểm Tra Sức Khỏe** | Kiểm tra tính toàn vẹn của thư mục, cơ sở dữ liệu SQLite, RAG Index và các file thiết lập. |
| `webnovel_dashboard` | **Bảng Điều Khiển Trực Quan** | Mở Web Dashboard giao diện trực quan xem dòng thời gian, đồ thị nhân vật và thống kê từ vựng. |

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Cài đặt cho DeepSeek Harness (DSH)
1. Mở giao diện DSH Web UI (`http://127.0.0.1:3080`).
2. Vào **Settings** ➔ **Plugin Market** ➔ tab **Advanced**.
3. Nhập: `github:hungdaimedia-gif/webnovel-writer` và bấm **Install**.

### 2. Cài đặt thủ công bằng Python (Chạy độc lập):
```powershell
# Cài đặt thư viện phụ thuộc
pip install -r requirements.txt

# Kiểm tra trạng thái hệ thống
python webnovel-writer/scripts/webnovel.py doctor
```

---

## 📂 Cấu Trúc Thư Mục Truyện Chuẩn:

Khi khởi tạo một bộ truyện, hệ thống sẽ tạo cấu trúc chuyên nghiệp:
```
Tên_Bộ_Truyện/
├── 设定集/                 # Bộ thiết lập
│   ├── 世界观.md            # Thế giới quan & Quy tắc xã hội
│   ├── 主角卡.md            # Hồ sơ nhân vật chính
│   ├── 力量体系.md          # Hệ thống cấp bậc sức mạnh
│   └── 金手指.md            # Thiết lập Cheat / Hệ thống
├── 大纲/                   # Dàn ý
│   ├── 总纲.md              # Dàn ý tổng thể toàn bộ truyện
│   └── 卷1-时间线.md        # Dàn ý chi tiết & mốc thời gian Quyển 1
├── 正文/                   # Toàn bộ chương truyện xuất bản
│   ├── 第0001章-Tên_Chương.md
│   └── 第0002章-Tên_Chương.md
└── .story-system/          # Cơ sở dữ liệu trí nhớ dài hạn (SQLite & Vector Index)
```

---

## 📜 Giấy Phép & Bản Quyền
Mã nguồn phát hành theo giấy phép **GPL v3**.
Tác giả gốc: [lingfengQAQ/webnovel-writer](https://github.com/lingfengQAQ/webnovel-writer).  
Bản phân phối & tích hợp DeepSeek Harness: [hungdaimedia-gif/webnovel-writer](https://github.com/hungdaimedia-gif/webnovel-writer).
