import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = 'munto-root';
const S3_BASE_URL = 'https://munto-root.s3.ap-northeast-2.amazonaws.com/';

export async function uploadImageToS3(buffer: Buffer, mimetype: string, key_prefix: string): Promise<string> {
  const key = `${key_prefix}/${uuidv4()}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );
  return S3_BASE_URL + key;
} 