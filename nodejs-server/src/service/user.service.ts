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

  async create(createUserRequest: CreateUserRequest, profilePicture?: Express.Multer.File) {
    const { email, name, password } = createUserRequest;
    const introduction = createUserRequest.introduction ?? null;
    const isHost = createUserRequest.is_host === 'true'

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserRequest.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    let profilePictureUrl: string | null = null;
    if (profilePicture) {
      profilePictureUrl = await this.s3Service.uploadImageToS3(profilePicture.buffer, profilePicture.mimetype, 'users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({
      email,
      name,
      introduction,
      isHost,
      profile_picture_url: profilePictureUrl,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.getByEmail(email)
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