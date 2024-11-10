import { IsString, IsNotEmpty } from 'class-validator';

export class PredictionDto {
  @IsString()
  @IsNotEmpty()
  result: string; // Hasil prediksi model (Cancer / Non-cancer)

  @IsString()
  @IsNotEmpty()
  suggestion: string; // Saran terkait hasil prediksi
}
