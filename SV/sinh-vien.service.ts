// src/sinh-vien/sinh-vien.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { SinhVien } from './sinh-vien.entity';
import { CreateSinhVienDto } from './dto/sinh-vien.dto';
import { UpdateSinhVienDto } from './dto/sinh-vien.dto';
import { QuerySinhVienDto }  from './dto/sinh-vien.dto';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepo: Repository<SinhVien>,
  ) {}

  // ─────────────────────────────────────────────────────────
  // CREATE – Tạo sinh viên mới
  // ─────────────────────────────────────────────────────────
  async create(dto: CreateSinhVienDto): Promise<SinhVien> {
    // Kiểm tra trùng mã sinh viên
    const existMaSv = await this.sinhVienRepo.findOne({
      where: { maSv: dto.maSv },
    });
    if (existMaSv) {
      throw new ConflictException(`Mã sinh viên "${dto.maSv}" đã tồn tại`);
    }

    // Kiểm tra trùng email
    const existEmail = await this.sinhVienRepo.findOne({
      where: { email: dto.email },
    });
    if (existEmail) {
      throw new ConflictException(`Email "${dto.email}" đã được sử dụng`);
    }

    const sinhVien = this.sinhVienRepo.create(dto);
    return this.sinhVienRepo.save(sinhVien);
  }

  // ─────────────────────────────────────────────────────────
  // READ – Lấy danh sách (có phân trang & tìm kiếm)
  // ─────────────────────────────────────────────────────────
  async findAll(query: QuerySinhVienDto): Promise<{
    data: SinhVien[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, trangThai, lopHocId, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<SinhVien>[] = [];

    if (search) {
      // Tìm theo maSv HOẶC hoTen
      where.push({ maSv:  Like(`%${search}%`), ...(trangThai && { trangThai }), ...(lopHocId && { lopHocId }) });
      where.push({ hoTen: Like(`%${search}%`), ...(trangThai && { trangThai }), ...(lopHocId && { lopHocId }) });
    } else {
      const cond: FindOptionsWhere<SinhVien> = {};
      if (trangThai) cond.trangThai = trangThai;
      if (lopHocId)  cond.lopHocId  = lopHocId;
      where.push(cond);
    }

    const [data, total] = await this.sinhVienRepo.findAndCount({
      where,
      relations: ['lopHoc'],
      order: { createdAt: 'DESC' },
      skip:  (page - 1) * limit,
      take:  limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─────────────────────────────────────────────────────────
  // READ – Lấy một sinh viên theo ID
  // ─────────────────────────────────────────────────────────
  async findOne(id: number): Promise<SinhVien> {
    const sinhVien = await this.sinhVienRepo.findOne({
      where: { id },
      relations: ['lopHoc', 'diemSos'],
    });
    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên với ID ${id}`);
    }
    return sinhVien;
  }

  // ─────────────────────────────────────────────────────────
  // READ – Lấy sinh viên theo mã SV
  // ─────────────────────────────────────────────────────────
  async findByMaSv(maSv: string): Promise<SinhVien> {
    const sinhVien = await this.sinhVienRepo.findOne({
      where: { maSv },
      relations: ['lopHoc'],
    });
    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên "${maSv}"`);
    }
    return sinhVien;
  }

  // ─────────────────────────────────────────────────────────
  // UPDATE – Cập nhật thông tin sinh viên
  // ─────────────────────────────────────────────────────────
  async update(id: number, dto: UpdateSinhVienDto): Promise<SinhVien> {
    const sinhVien = await this.findOne(id);   // ném 404 nếu không tìm thấy

    // Kiểm tra email trùng (nếu có thay đổi email)
    if (dto.email && dto.email !== sinhVien.email) {
      const existEmail = await this.sinhVienRepo.findOne({
        where: { email: dto.email },
      });
      if (existEmail) {
        throw new ConflictException(`Email "${dto.email}" đã được sử dụng`);
      }
    }

    // Kiểm tra mã SV trùng (nếu có thay đổi)
    if (dto.maSv && dto.maSv !== sinhVien.maSv) {
      const existMaSv = await this.sinhVienRepo.findOne({
        where: { maSv: dto.maSv },
      });
      if (existMaSv) {
        throw new ConflictException(`Mã sinh viên "${dto.maSv}" đã tồn tại`);
      }
    }

    Object.assign(sinhVien, dto);
    return this.sinhVienRepo.save(sinhVien);
  }

  // ─────────────────────────────────────────────────────────
  // DELETE – Xóa sinh viên theo ID
  // ─────────────────────────────────────────────────────────
  async remove(id: number): Promise<{ message: string }> {
    const sinhVien = await this.findOne(id);   // ném 404 nếu không tìm thấy
    await this.sinhVienRepo.remove(sinhVien);
    return { message: `Đã xóa sinh viên "${sinhVien.hoTen}" (${sinhVien.maSv})` };
  }
}
