import { uploadImageToS3 } from '@/service/s3.service';
import { PrismaService } from '@/repository/prisma.service';
import { CreateUserDto } from '@/model/create-user.dto';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, profilePicture?: Express.Multer.File) {
    const { email, name, introduction, password } = createUserDto;
    const isHost = createUserDto.is_host === 'true'

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
    
    let profile_picture_url: string | null = null;
    if (profilePicture) {
      profile_picture_url = await uploadImageToS3(profilePicture.buffer, profilePicture.mimetype, 'users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        name,
        introduction,
        is_host: isHost,
        profile_picture_url,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
    });
  }

  async findOne(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
    }

    return user;
  }
} 