import {
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import axios from 'axios';
  
  @Injectable()
  export class IamportService {
    async getToken() {
      const rsp = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: process.env.IMP_KEY,
          imp_secret: process.env.IMP_SECRET,
        },
      });
      return rsp.data.response.access_token;
    }
  
    async getPaymentData({ access_token, impUid }) {
      try {
        const rsp = await axios({
          url: `https://api.iamport.kr/payments/${impUid}`,
          method: 'get',
          headers: { Authorization: access_token },
        });
        return rsp.data.response;
      } catch (error) {
        throw new UnprocessableEntityException(
          'ERROR 422: No Relevant Payment Found. Please Check Again.',
        );
      }
    }
  
    async requestCancel({
      access_token,
      impUid: imp_uid,
      payPrice: cancel_request_amount,
    }) {
      try {
        const rsp = await axios({
          url: 'https://api.iamport.kr/payments/cancel',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token,
          },
          data: {
            imp_uid,
            amount: cancel_request_amount,
          },
        });
        return rsp.data;
      } catch (error) {
        throw new InternalServerErrorException(
          'ERROR 500: Please Check Payment Amount Again.',
        );
      }
    }
  }
  