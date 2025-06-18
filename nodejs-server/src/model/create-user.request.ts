import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  introduction?: string;
  
  @IsString()
  is_host: string;
} 