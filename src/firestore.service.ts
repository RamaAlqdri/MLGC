import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as path from 'path';

@Injectable()
export class FirestoreService {
  private firestore: Firestore;

  constructor() {
    // Ganti path ini sesuai dengan lokasi file JSON service account Anda
    // const serviceAccount = 'config/submissionmlgc-ramaalqd-7efa41a039f3.json';
    const serviceAccount = path.join(__dirname, '../config', 'secret-key.json');

    this.firestore = new Firestore({
      projectId: 'submissionmlgc-ramaalqd', // Ganti dengan project ID Google Cloud Anda
      keyFilename: serviceAccount, // Menyediakan path ke file JSON service account
      databaseId: 'mlgc',
    });
  }

  getDb() {
    return this.firestore;
  }
}
