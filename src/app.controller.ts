import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as tf from '@tensorflow/tfjs-node';
// import { Express } from 'express';

@Controller('predict')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('histories')
  async getHistories() {
    const histories = await this.appService.findAll();
    return {
      status: 'success',
      data: histories,
    };
  }

  @Post('')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      // limits: { fileSize: 1000000 },
    }),
  )
  async predict(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          status: 'fail',
          message: 'No file uploaded',
        },
        HttpStatus.BAD_REQUEST, // Status code 400
      );
    }
    if (file.size > 1000000) {
      throw new HttpException(
        {
          status: 'fail',
          message:
            'Payload content length greater than maximum allowed: 1000000',
        },
        HttpStatus.PAYLOAD_TOO_LARGE, // Status code 413
      );
    }
    try {
      // Validasi ukuran file

      // Konversi gambar menjadi array tensor
      const imageTensor = await this.convertImageToTensor(file.buffer);

      // Lakukan prediksi dengan model
      const prediction = await this.appService.predict(imageTensor);
      const result = prediction === 'Cancer' ? 'Cancer' : 'Non-cancer';
      const suggestion =
        prediction === 'Cancer'
          ? 'Segera periksa ke dokter!'
          : 'Penyakit kanker tidak terdeteksi.';

      const predictionData = await this.appService.create({
        result: result,
        suggestion: suggestion,
      });
      // console.log(predictionData);

      return {
        status: 'success',
        message: 'Model is predicted successfully',
        data: {
          id: predictionData.id,
          result: predictionData.result,
          suggestion: predictionData.suggestion,
          createdAt: predictionData.createdAt.toString(),
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        {
          status: 'fail',
          message: 'Terjadi kesalahan dalam melakukan prediksi',
        },
        HttpStatus.BAD_REQUEST, // Status code 400
      );
    }
  }

  async convertImageToTensor(buffer: Buffer): Promise<tf.Tensor> {
    const image = await tf.node.decodeImage(buffer); // Decoding image buffer into tensor
    return image.resizeNearestNeighbor([224, 224]).toFloat().expandDims(0); // Resize image to model's input size
  }
}
