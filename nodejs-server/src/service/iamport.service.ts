import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  private readonly IMP_KEY = process.env.IAMPORT_REST_API_KEY;
  private readonly IMP_SECRET = process.env.IAMPORT_REST_API_SECRET;

  async getPaymentResult(imp_uid: string) {
    try {
      const getToken = await axios.post("https://api.iamport.kr/users/getToken", {
        imp_key: this.IMP_KEY,
        imp_secret: this.IMP_SECRET
      });

      const { access_token } = getToken.data.response;

      const paymentResult = await axios.get(
        `https://api.iamport.kr/payments/${imp_uid}`,
        { headers: { Authorization: access_token } }
      );

      return paymentResult.data.response;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  }
} 