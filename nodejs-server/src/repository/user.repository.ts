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
}