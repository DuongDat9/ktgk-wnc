# 📚 Student Management – Bài Kiểm Tra Giữa Kỳ Web

**Framework:** NestJS + TypeORM + MySQL  
**Đối tượng phụ trách:** `SinhVien` (Sinh viên)

---

## 🗂️ Cấu trúc file

```
student-management/
├── sql/
│   └── student_management.sql        ← CSDL (Phần 1)
└── src/
    ├── app.module.ts                 ← App root + TypeORM config
    └── sinh-vien/
        ├── sinh-vien.entity.ts       ← Entity (TypeORM)
        ├── sinh-vien.module.ts       ← Module + Provider
        ├── sinh-vien.service.ts      ← Business logic (CRUD)
        ├── sinh-vien.controller.ts   ← REST API endpoints
        └── dto/
            └── sinh-vien.dto.ts      ← CreateDto, UpdateDto, QueryDto
```

---

## Phần 1 – CSDL (3 điểm nhóm)

File: `sql/student_management.sql`

| Bảng | Mô tả |
|---|---|
| `lop_hoc` | Danh sách lớp học |
| `sinh_vien` | Danh sách sinh viên (**đối tượng chính**) |
| `mon_hoc` | Danh sách môn học |
| `diem_so` | Bảng điểm sinh viên |

**Chạy file SQL:**
```bash
mysql -u root -p < sql/student_management.sql
```

---

## Phần 2 – CRUD SinhVien (7 điểm cá nhân)

### Cài đặt & chạy

```bash
npm install
# Tạo file .env ở thư mục gốc:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=student_management

npm run start:dev
```

---

### ✅ CREATE – Tạo sinh viên mới (1 điểm)

**Endpoint:** `POST /sinh-vien`

```json
{
  "maSv": "SV005",
  "hoTen": "Nguyễn Thị Lan",
  "ngaySinh": "2003-07-15",
  "gioiTinh": "Nữ",
  "email": "lan.nt@student.edu.vn",
  "soDienThoai": "0945678901",
  "diaChi": "Hoàn Kiếm, Hà Nội",
  "lopHocId": 1,
  "trangThai": "Đang học"
}
```

**Response 201:**
```json
{
  "statusCode": 201,
  "message": "Tạo sinh viên thành công",
  "data": { "id": 5, "maSv": "SV005", ... }
}
```

**Kiểm tra:** Trùng `maSv` → 409, Sai format → 400.

---

### 📖 READ – Đọc danh sách / chi tiết (1 điểm)

**Lấy danh sách (có phân trang, tìm kiếm):**

`GET /sinh-vien?search=Lan&trangThai=Đang học&page=1&limit=10`

**Lấy chi tiết theo ID:**

`GET /sinh-vien/5`

**Lấy theo mã SV:**

`GET /sinh-vien/ma/SV005`

**Response 200:** trả về `data`, `total`, `page`, `totalPages`.

---

### ✏️ UPDATE – Cập nhật thông tin (1 điểm)

**Cập nhật toàn bộ:** `PUT /sinh-vien/5`

**Cập nhật một phần:** `PATCH /sinh-vien/5`

```json
{
  "soDienThoai": "0999888777",
  "trangThai": "Tạm dừng"
}
```

**Kiểm tra:** Không tìm thấy → 404, Email trùng → 409.

---

### 🗑️ DELETE – Xóa sinh viên (1 điểm)

**Endpoint:** `DELETE /sinh-vien/5`

**Response 200:**
```json
{
  "statusCode": 200,
  "message": "Đã xóa sinh viên \"Nguyễn Thị Lan\" (SV005)"
}
```

**Kiểm tra:** Không tìm thấy → 404 NotFoundException.

---

### 📊 Lưu đồ thuật toán – Activity Diagram (2 điểm)

Activity Diagram CRUD đã được vẽ trong bài kiểm tra.
<img width="2704" height="5917" alt="607583006-e43ee850-011c-4cef-9848-4d649ccb1aa8" src="https://github.com/user-attachments/assets/856c21be-cf82-480f-90c4-2b085590f741" />
Các nhánh quyết định theo chuẩn UML:

- ◆ **Validate DTO** → Hợp lệ / Không hợp lệ (400)
- ◆ **Kiểm tra tồn tại** → Có / Không (409 hoặc 404)
- ◆ **Tìm theo ID** → Tìm thấy / Không tìm thấy (404)

---

## Entity – Bảng sinh_vien

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Khóa chính |
| `ma_sv` | VARCHAR(20) UNIQUE | Mã sinh viên |
| `ho_ten` | VARCHAR(100) | Họ và tên |
| `ngay_sinh` | DATE | Ngày sinh |
| `gioi_tinh` | ENUM | Nam / Nữ / Khác |
| `email` | VARCHAR(150) UNIQUE | Email |
| `so_dien_thoai` | VARCHAR(15) | Số điện thoại |
| `dia_chi` | TEXT | Địa chỉ |
| `lop_hoc_id` | INT (FK) | Khóa ngoại → lop_hoc |
| `trang_thai` | ENUM | Đang học / Tạm dừng / ... |
| `created_at` | DATETIME | Ngày tạo |
| `updated_at` | DATETIME | Ngày cập nhật |

---

*Commit code lên GitHub Repo của nhóm theo hướng dẫn của giảng viên.*
