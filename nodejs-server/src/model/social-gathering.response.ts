import { SocialGathering } from '@prisma/client';
import { DateTime } from 'luxon';

export class SocialGatheringResponse {
  id: number;
  host_uuid: string;
  name: string;
  location: string;
  thumbnail_url: string;
  price: number;
  view_count: number;
  start_datetime: string;
  end_datetime: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;

  static from(socialGathering: SocialGathering): SocialGatheringResponse {
    
    const toKST = (date: Date | string): string => {
      const jsDate = typeof date === 'string' ? new Date(date) : date;

      const isoString = DateTime.fromJSDate(jsDate)
        .setZone('Asia/Seoul')
        .toISO();
      
      if (!isoString) {
        throw new Error('date must not be null');
      }
      
      return isoString;
    };

    return {
      ...socialGathering,
      start_datetime: toKST(socialGathering.start_datetime),
      end_datetime: toKST(socialGathering.end_datetime),
      created_at: toKST(socialGathering.created_at),
      updated_at: toKST(socialGathering.updated_at),
    } as SocialGatheringResponse;
  }
}