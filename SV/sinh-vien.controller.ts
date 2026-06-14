// src/sinh-vien/sinh-vien.controller.ts
import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, ParseIntPipe,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { SinhVienService }     from './sinh-vien.service';
import { CreateSinhVienDto }   from './dto/sinh-vien.dto';
import { UpdateSinhVienDto }   from './dto/sinh-vien.dto';
import { QuerySinhVienDto }    from './dto/sinh-vien.dto';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) {}

  // ─────────────────────────────────────────────────────────
  // POST /sinh-vien
  // Tạo mới một sinh viên
  // ─────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSinhVienDto: CreateSinhVienDto) {
    const sinhVien = await this.sinhVienService.create(createSinhVienDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tạo sinh viên thành công',
      data: sinhVien,
    };
  }

  // ─────────────────────────────────────────────────────────
  // GET /sinh-vien
  // Lấy danh sách sinh viên (phân trang, tìm kiếm)
  // Query: ?search=An&trangThai=Đang học&lopHocId=1&page=1&limit=10
  // ─────────────────────────────────────────────────────────
  @Get()
  async findAll(@Query() query: QuerySinhVienDto) {
    const result = await this.sinhVienService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách sinh viên thành công',
      ...result,
    };
  }

  // ─────────────────────────────────────────────────────────
  // GET /sinh-vien/:id
  // Lấy chi tiết một sinh viên theo ID
  // ─────────────────────────────────────────────────────────
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sinhVien = await this.sinhVienService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin sinh viên thành công',
      data: sinhVien,
    };
  }

  // ─────────────────────────────────────────────────────────
  // GET /sinh-vien/ma/:maSv
  // Lấy sinh viên theo mã số SV
  // ─────────────────────────────────────────────────────────
  @Get('ma/:maSv')
  async findByMaSv(@Param('maSv') maSv: string) {
    const sinhVien = await this.sinhVienService.findByMaSv(maSv);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin sinh viên thành công',
      data: sinhVien,
    };
  }

  // ─────────────────────────────────────────────────────────
  // PUT /sinh-vien/:id
  // Cập nhật toàn bộ thông tin sinh viên
  // ─────────────────────────────────────────────────────────
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSinhVienDto: UpdateSinhVienDto,
  ) {
    const sinhVien = await this.sinhVienService.update(id, updateSinhVienDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật sinh viên thành công',
      data: sinhVien,
    };
  }

  // ─────────────────────────────────────────────────────────
  // PATCH /sinh-vien/:id
  // Cập nhật một phần thông tin sinh viên
  // ─────────────────────────────────────────────────────────
  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSinhVienDto: UpdateSinhVienDto,
  ) {
    const sinhVien = await this.sinhVienService.update(id, updateSinhVienDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật sinh viên thành công',
      data: sinhVien,
    };
  }

  // ─────────────────────────────────────────────────────────
  // DELETE /sinh-vien/:id
  // Xóa sinh viên theo ID
  // ─────────────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.sinhVienService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
