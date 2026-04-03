import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PredictionService {

  async predict(prices: number[]) {

    const response = await axios.post(
      'http://localhost:8000/predict',
      { prices }
    );

    return response.data;
  }

}