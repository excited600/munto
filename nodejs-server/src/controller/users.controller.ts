import { JwtAuthGuard } from '@/controller/jwt-auth.guard';
import { CreateUserRequest } from '@/model/create-user.request';
import { UserService } from '@/service/user.service';
import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginRequest } from '@/model/login.request';
import { User } from './user-decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profile_picture'))
  async create(
    @Body() createUserDto: CreateUserRequest,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, profilePicture);
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  findOne(@User('email') sessionEmail: string,) {
    return this.userService.findByEmail(sessionEmail);
  }

  @Post('signin')
  async login(@Body() loginDto: LoginRequest) {
    return this.userService.login(loginDto);
  }
} 