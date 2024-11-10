import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreService } from './firestore.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FirestoreService],
})
export class AppModule {}
