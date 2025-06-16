import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HostGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const hostUuid = request.body.host_uuid;

    const user = await this.prisma.user.findUnique({
      where: { uuid: hostUuid },
    });

    if (!user || !user.is_host) {
      throw new UnauthorizedException('Only hosts can create social gatherings');
    }

    return true;
  }
} 