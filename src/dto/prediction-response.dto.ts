import { IsString, IsDateString } from 'class-validator';

export class PredictionResponseDto {
  @IsString()
  id: string; // ObjectID dari MongoDB

  @IsString()
  result: string; // Hasil prediksi

  @IsString()
  suggestion: string; // Saran terkait hasil prediksi

  @IsDateString()
  createdAt: string; // Tanggal pembuatan data
}
