/**
 * Before Data Capture Service
 * Single Responsibility: Captures and manages data before updates
 */

import type { Core } from '@strapi/strapi';
import { IBeforeDataCapture } from '../interfaces';

export class BeforeDataCaptureService implements IBeforeDataCapture {
  private strapi: Core.Strapi;
  private dataStore: Map<string | number, any>;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
    this.dataStore = new Map();
  }

  public async capture(event: any, contentType: string): Promise<any> {
    const { params } = event;

    try {
      const recordId = params.where?.documentId || params.where?.id;
      if (!recordId) {
        return null;
      }

      let existingData;

      if (params.where?.documentId) {
        // Query by documentId using documents API
        existingData = await this.strapi.documents(contentType as any).findOne({
          documentId: params.where.documentId,
        });
      } else if (params.where?.id) {
        // Query by numeric id using db API
        const results = await this.strapi.db.query(contentType).findMany({
          where: { id: params.where.id },
          limit: 1,
        });
        existingData = results[0];
      }

      if (existingData) {
        // Store by both id and documentId for flexible retrieval
        this.dataStore.set(existingData.id, existingData);
        if (existingData.documentId) {
          this.dataStore.set(existingData.documentId, existingData);
        }
      }

      return existingData;
    } catch (error) {
      this.strapi.log.warn('Failed to capture before data:', error);
      return null;
    }
  }

  public retrieve(recordId: string | number): any | null {
    return this.dataStore.get(recordId) || null;
  }

  public cleanup(recordId: string | number): void {
    const data = this.dataStore.get(recordId);

    if (data) {
      // Remove both id and documentId entries
      this.dataStore.delete(data.id);
      if (data.documentId) {
        this.dataStore.delete(data.documentId);
      }
    }

    // Also try to remove the provided key directly
    this.dataStore.delete(recordId);
  }

  public getStoreSize(): number {
    return this.dataStore.size;
  }
}
