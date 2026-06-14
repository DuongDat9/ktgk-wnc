// src/sinh-vien/sinh-vien.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { LopHoc }  from '../lop-hoc/lop-hoc.entity';
import { DiemSo }  from '../diem-so/diem-so.entity';

export enum GioiTinh  { NAM = 'Nam', NU = 'Nữ', KHAC = 'Khác' }
export enum TrangThai {
  DANG_HOC       = 'Đang học',
  TAM_DUNG       = 'Tạm dừng',
  DA_TOT_NGHIEP  = 'Đã tốt nghiệp',
  DA_THOI_HOC    = 'Đã thôi học',
}

@Entity('sinh_vien')
export class SinhVien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ma_sv', length: 20, unique: true })
  maSv: string;

  @Column({ name: 'ho_ten', length: 100 })
  hoTen: string;

  @Column({ name: 'ngay_sinh', type: 'date' })
  ngaySinh: string;

  @Column({ type: 'enum', enum: GioiTinh, default: GioiTinh.NAM })
  gioiTinh: GioiTinh;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'so_dien_thoai', length: 15, nullable: true })
  soDienThoai?: string;

  @Column({ name: 'dia_chi', type: 'text', nullable: true })
  diaChi?: string;

  @Column({ name: 'lop_hoc_id' })
  lopHocId: number;

  @ManyToOne(() => LopHoc, (lop) => lop.sinhViens, { eager: false })
  @JoinColumn({ name: 'lop_hoc_id' })
  lopHoc: LopHoc;

  @OneToMany(() => DiemSo, (diem) => diem.sinhVien)
  diemSos: DiemSo[];

  @Column({ name: 'trang_thai', type: 'enum', enum: TrangThai, default: TrangThai.DANG_HOC })
  trangThai: TrangThai;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
