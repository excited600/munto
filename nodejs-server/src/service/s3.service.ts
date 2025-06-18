import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly BUCKET = 'munto-root';
  private readonly S3_BASE_URL = 'https://munto-root.s3.ap-northeast-2.amazonaws.com/';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadImageToS3(buffer: Buffer, mimetype: string, key_prefix: string): Promise<string> {
    const key = `${key_prefix}/${uuidv4()}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      })
    );
    return this.S3_BASE_URL + key;
  }
} 