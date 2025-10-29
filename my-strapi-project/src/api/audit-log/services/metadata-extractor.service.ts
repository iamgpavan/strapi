/**
 * Metadata Extractor Service
 * Single Responsibility: Extracts metadata from lifecycle events
 */

import { IMetadataExtractor, IMetadata } from '../interfaces';

export class MetadataExtractorService implements IMetadataExtractor {
  public extract(event: any): IMetadata {
    const state = event?.state;
    const metadata: IMetadata = {};

    if (state?.request) {
      metadata.ip = state.request.ip || state.request.socket?.remoteAddress;
      metadata.userAgent = state.request.headers?.['user-agent'];
      metadata.method = state.request.method;
      metadata.url = state.request.url;
    }

    return metadata;
  }
}
