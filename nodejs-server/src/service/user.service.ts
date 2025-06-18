import { PrismaService } from '@/repository/prisma.service';
import { CreateUserRequest } from '@/model/create-user.request';
import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserRepository } from '@/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from '@/model/login.request';
import { S3Service } from './s3.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private s3Service: S3Service,
  ) { }

  async create(createUserDto: CreateUserRequest, profilePicture?: Express.Multer.File) {
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
      profile_picture_url = await this.s3Service.uploadImageToS3(profilePicture.buffer, profilePicture.mimetype, 'users');
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

  async login(loginDto: LoginRequest) {
    const user = await this.userRepository.getByEmail(loginDto.email)

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email
    };
  }
} 