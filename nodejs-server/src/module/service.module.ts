import { RepositoryModule } from "./repository.module";
import { SocialGatheringsController } from "@/controller/social-gatherings.controller";
import { SocialGatheringsService } from "@/service/social-gatherings.service";
import { IamportService } from "@/service/iamport.service";
import { Module } from "@nestjs/common";
import { UsersController } from "@/controller/users.controller";
import { UserService } from "@/service/user.service";
import { JwtStrategy } from "@/service/jwt.strategy";
import { S3Service } from "@/service/s3.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "@/repository/prisma.service";
import { RedisCacheProvider } from "@/service/redis-cache.provider";


@Module({
    imports: [RepositoryModule, PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),],
    controllers: [SocialGatheringsController, UsersController],
    providers: [PrismaService, SocialGatheringsService, IamportService, UserService, S3Service, JwtStrategy, RedisCacheProvider],
    exports: [PrismaService, SocialGatheringsService, UserService]
  })
  export class ServiceModule {}