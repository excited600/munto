export interface ParticipantInfo {
  user_uuid: string;
  name: string;
  profile_picture_url: string | null;
  temperature: number;
  introduction: string | null;
}