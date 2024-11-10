import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import { PredictionDto } from './dto/prediction.dto';
import { HistoriesResponse } from './dto/histories-respones.dto';
import { FirestoreService } from './firestore.service';
import { PredictionResponseDto } from './dto/prediction-response.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly firebaseService: FirestoreService) {}

  private db = this.firebaseService.getDb();
  private model: tf.GraphModel;

  async create(
    createPredictionDto: PredictionDto,
  ): Promise<PredictionResponseDto> {
    const predictionRef = this.db.collection('predictions').doc(); // Membuat doc baru dengan ID otomatis
    const createdAt = new Date().toISOString();

    const prediction = {
      ...createPredictionDto,
      createdAt,
      id: predictionRef.id,
    };

    await predictionRef.set(prediction);

    return prediction;
  }
  async findAll(): Promise<HistoriesResponse[]> {
    const snapshot = await this.db.collection('predictions').get();
    const predictions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        history: {
          id: doc.id,
          result: data.result,
          suggestion: data.suggestion,
          createdAt: new Date(data.createdAt).toISOString(),
        },
      };
    });

    return predictions;
  }

  async onModuleInit() {
    const modelPath = process.env.MODEL_URL;
    if (modelPath) {
      await this.loadModel(modelPath);
    } else {
      console.error('MODEL_PATH is not defined in .env');
    }
  }
  async loadModel(modelPath: string): Promise<void> {
    this.model = await tf.loadGraphModel(modelPath);
  }

  async predict(imageData: tf.Tensor): Promise<string> {
    const prediction = this.model.predict(imageData) as tf.Tensor;
    const predictionValue = prediction.arraySync()[0][0];
    if (predictionValue > 0.5) {
      return 'Cancer';
    } else {
      return 'Non-cancer';
    }
  }
}
