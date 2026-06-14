-- ============================================================
-- FILE: student_management.sql
-- MÔ TẢ: CSDL Quản lý Sinh viên
-- FRAMEWORK: NestJS + TypeORM + MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS student_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management;

-- ------------------------------------------------------------
-- BẢNG: lop_hoc (Lớp học)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lop_hoc (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ten_lop     VARCHAR(50)  NOT NULL COMMENT 'Tên lớp, VD: CNTT01',
  khoa_hoc    VARCHAR(20)  NOT NULL COMMENT 'Khoá học, VD: K2021',
  khoa        VARCHAR(100) NOT NULL COMMENT 'Khoa, VD: Công nghệ thông tin',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ten_lop (ten_lop)
) ENGINE=InnoDB COMMENT='Danh sách lớp học';

-- ------------------------------------------------------------
-- BẢNG: sinh_vien (Sinh viên) — đối tượng chính của bài
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sinh_vien (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ma_sv       VARCHAR(20)  NOT NULL COMMENT 'Mã sinh viên, VD: SV001',
  ho_ten      VARCHAR(100) NOT NULL COMMENT 'Họ và tên đầy đủ',
  ngay_sinh   DATE         NOT NULL COMMENT 'Ngày sinh',
  gioi_tinh   ENUM('Nam','Nữ','Khác') NOT NULL DEFAULT 'Nam',
  email       VARCHAR(150) NOT NULL COMMENT 'Email liên hệ',
  so_dien_thoai VARCHAR(15) NULL COMMENT 'Số điện thoại',
  dia_chi     TEXT         NULL COMMENT 'Địa chỉ thường trú',
  lop_hoc_id  INT          NOT NULL COMMENT 'FK → lop_hoc',
  trang_thai  ENUM('Đang học','Tạm dừng','Đã tốt nghiệp','Đã thôi học')
              NOT NULL DEFAULT 'Đang học',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ma_sv    (ma_sv),
  UNIQUE KEY uq_email    (email),
  CONSTRAINT fk_sv_lop FOREIGN KEY (lop_hoc_id)
    REFERENCES lop_hoc(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Danh sách sinh viên';

-- ------------------------------------------------------------
-- BẢNG: mon_hoc (Môn học)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mon_hoc (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ma_mon      VARCHAR(20)  NOT NULL,
  ten_mon     VARCHAR(150) NOT NULL,
  so_tin_chi  TINYINT      NOT NULL DEFAULT 3,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ma_mon (ma_mon)
) ENGINE=InnoDB COMMENT='Danh sách môn học';

-- ------------------------------------------------------------
-- BẢNG: diem_so (Điểm số)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diem_so (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  sinh_vien_id INT           NOT NULL,
  mon_hoc_id   INT           NOT NULL,
  diem_giua_ky DECIMAL(4,2)  NULL,
  diem_cuoi_ky DECIMAL(4,2)  NULL,
  diem_tong_ket DECIMAL(4,2) NULL,
  hoc_ky       TINYINT       NOT NULL DEFAULT 1,
  nam_hoc      VARCHAR(10)   NOT NULL COMMENT 'VD: 2023-2024',
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_diem (sinh_vien_id, mon_hoc_id, hoc_ky, nam_hoc),
  CONSTRAINT fk_diem_sv  FOREIGN KEY (sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
  CONSTRAINT fk_diem_mon FOREIGN KEY (mon_hoc_id)   REFERENCES mon_hoc(id)   ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Bảng điểm sinh viên';

-- ------------------------------------------------------------
-- DỮ LIỆU MẪU
-- ------------------------------------------------------------

INSERT INTO lop_hoc (ten_lop, khoa_hoc, khoa) VALUES
  ('CNTT01', 'K2021', 'Công nghệ thông tin'),
  ('CNTT02', 'K2021', 'Công nghệ thông tin'),
  ('KTPM01', 'K2022', 'Kỹ thuật phần mềm');

INSERT INTO mon_hoc (ma_mon, ten_mon, so_tin_chi) VALUES
  ('COMP101', 'Nhập môn lập trình',    3),
  ('COMP201', 'Cơ sở dữ liệu',         3),
  ('COMP301', 'Lập trình Web',          3),
  ('MATH101', 'Toán rời rạc',           2);

INSERT INTO sinh_vien (ma_sv, ho_ten, ngay_sinh, gioi_tinh, email, so_dien_thoai, dia_chi, lop_hoc_id, trang_thai) VALUES
  ('SV001', 'Nguyễn Văn An',   '2003-05-12', 'Nam', 'an.nv@student.edu.vn',   '0901234567', 'Hà Nội',    1, 'Đang học'),
  ('SV002', 'Trần Thị Bình',   '2003-08-20', 'Nữ',  'binh.tt@student.edu.vn', '0912345678', 'Hà Đông',   1, 'Đang học'),
  ('SV003', 'Lê Minh Cường',   '2002-11-30', 'Nam', 'cuong.lm@student.edu.vn','0923456789', 'Đống Đa',   2, 'Đang học'),
  ('SV004', 'Phạm Thị Dung',   '2004-01-15', 'Nữ',  'dung.pt@student.edu.vn', '0934567890', 'Cầu Giấy',  3, 'Đang học');

INSERT INTO diem_so (sinh_vien_id, mon_hoc_id, diem_giua_ky, diem_cuoi_ky, diem_tong_ket, hoc_ky, nam_hoc) VALUES
  (1, 1, 7.5, 8.0, 7.8, 1, '2023-2024'),
  (1, 2, 6.0, 7.5, 6.9, 1, '2023-2024'),
  (2, 1, 8.5, 9.0, 8.8, 1, '2023-2024'),
  (3, 3, 7.0, 8.5, 7.9, 2, '2023-2024');
