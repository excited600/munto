import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User } from "@prisma/client";


@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User not found by email: ${email}`);
    }
    return user;
  }

  async create(data: {email: string, name: string, introduction: string | null, isHost: boolean, profile_picture_url: string | null, password: string}) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        introduction: data.introduction,
        is_host: data.isHost,
        profile_picture_url: data.profile_picture_url,
        password: data.password,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  }
}