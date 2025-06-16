import { IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateSocialGatheringDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  price: string;

  @IsDateString()
  start_datetime: Date;

  @IsDateString()
  end_datetime: Date;
} 