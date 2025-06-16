import { IsString, IsUUID } from 'class-validator';

export class ParticipateSocialGatheringDto {
  @IsString()
  imp_uid: string;
} 