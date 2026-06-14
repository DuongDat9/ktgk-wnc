// src/sinh-vien/dto/create-sinh-vien.dto.ts
import {
  IsString, IsEmail, IsEnum, IsOptional,
  IsNotEmpty, IsDateString, IsInt, MinLength, MaxLength,
} from 'class-validator';
import { GioiTinh, TrangThai } from '../sinh-vien.entity';

export class CreateSinhVienDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống' })
  @MaxLength(20)
  maSv: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MinLength(2)
  @MaxLength(100)
  hoTen: string;

  @IsDateString({}, { message: 'Ngày sinh không hợp lệ (YYYY-MM-DD)' })
  ngaySinh: string;

  @IsEnum(GioiTinh, { message: 'Giới tính phải là Nam | Nữ | Khác' })
  @IsOptional()
  gioiTinh?: GioiTinh;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  soDienThoai?: string;

  @IsString()
  @IsOptional()
  diaChi?: string;

  @IsInt({ message: 'Lớp học ID phải là số nguyên' })
  lopHocId: number;

  @IsEnum(TrangThai)
  @IsOptional()
  trangThai?: TrangThai;
}


// src/sinh-vien/dto/update-sinh-vien.dto.ts
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSinhVienDto extends PartialType(CreateSinhVienDto) {}


// src/sinh-vien/dto/query-sinh-vien.dto.ts
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TrangThai } from '../sinh-vien.entity';

export class QuerySinhVienDto {
  @IsOptional()
  @IsString()
  search?: string;           // tìm theo maSv hoặc hoTen

  @IsOptional()
  @IsEnum(TrangThai)
  trangThai?: TrangThai;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  lopHocId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
