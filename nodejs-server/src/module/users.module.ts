import { UsersController } from "@/controller/users.controller";
import { UsersService } from "@/service/users.service";
import { AuthModule } from "./auth.module";
import { PrismaModule } from "./prisma.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
  })
  export class UsersModule {} 