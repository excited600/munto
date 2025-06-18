import { IsString, IsDateString } from 'class-validator';

export class CreateSocialGatheringRequest {
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