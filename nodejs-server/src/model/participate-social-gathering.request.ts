import { IsString } from 'class-validator';

export class ParticipateSocialGatheringRequest {
  @IsString()
  imp_uid: string;
} 