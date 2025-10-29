/**
 * Audit Log Orchestrator Service
 * Single Responsibility: Orchestrates the audit logging process
 * Open/Closed Principle: Can be extended without modifying existing code
 * Dependency Inversion: Depends on abstractions, not concrete implementations
 */

import type { Core } from '@strapi/strapi';
import {
  IAuditLogData,
  IUserContextExtractor,
  IMetadataExtractor,
  IDiffCalculator,
  IAuditLogWriter,
  IBeforeDataCapture,
} from '../interfaces';
import { AuditLogConfigService } from './config.service';

export class AuditLogOrchestratorService {
  private strapi: Core.Strapi;
  private configService: AuditLogConfigService;
  private userContextExtractor: IUserContextExtractor;
  private metadataExtractor: IMetadataExtractor;
  private diffCalculator: IDiffCalculator;
  private writer: IAuditLogWriter;
  private beforeDataCapture: IBeforeDataCapture;

  constructor(
    strapi: Core.Strapi,
    configService: AuditLogConfigService,
    userContextExtractor: IUserContextExtractor,
    metadataExtractor: IMetadataExtractor,
    diffCalculator: IDiffCalculator,
    writer: IAuditLogWriter,
    beforeDataCapture: IBeforeDataCapture
  ) {
    this.strapi = strapi;
    this.configService = configService;
    this.userContextExtractor = userContextExtractor;
    this.metadataExtractor = metadataExtractor;
    this.diffCalculator = diffCalculator;
    this.writer = writer;
    this.beforeDataCapture = beforeDataCapture;
  }

  public async logCreate(event: any, contentType: string): Promise<void> {
    const { result } = event;
    const userContext = this.userContextExtractor.extract(event);
    const metadata = this.metadataExtractor.extract(event);

    const logData: IAuditLogData = {
      contentType,
      recordId: result.documentId || result.id,
      action: 'create',
      userId: userContext.userId,
      userType: userContext.userType,
      userEmail: userContext.userEmail,
      changedFields: null,
      beforeData: null,
      afterData: result,
      fullPayload: this.configService.shouldCaptureFullPayload() ? result : null,
      metadata,
    };

    await this.writeLog(logData);
  }

  public async captureBeforeUpdate(event: any, contentType: string): Promise<void> {
    await this.beforeDataCapture.capture(event, contentType);
  }

  public async logUpdate(event: any, contentType: string): Promise<void> {
    const { result } = event;
    const userContext = this.userContextExtractor.extract(event);
    const metadata = this.metadataExtractor.extract(event);

    const recordId = result.documentId || result.id;
    const beforeData = this.beforeDataCapture.retrieve(recordId);

    // Clean up stored data
    this.beforeDataCapture.cleanup(recordId);

    const diff = this.diffCalculator.calculate(beforeData, result);

    const logData: IAuditLogData = {
      contentType,
      recordId,
      action: 'update',
      userId: userContext.userId,
      userType: userContext.userType,
      userEmail: userContext.userEmail,
      changedFields: diff.changedFields,
      beforeData: diff.beforeData,
      afterData: diff.afterData,
      fullPayload: this.configService.shouldCaptureFullPayload() ? result : null,
      metadata,
    };

    await this.writeLog(logData);
  }

  public async logDelete(event: any, contentType: string): Promise<void> {
    const { result } = event;
    const userContext = this.userContextExtractor.extract(event);
    const metadata = this.metadataExtractor.extract(event);

    const logData: IAuditLogData = {
      contentType,
      recordId: result.documentId || result.id,
      action: 'delete',
      userId: userContext.userId,
      userType: userContext.userType,
      userEmail: userContext.userEmail,
      changedFields: null,
      beforeData: result,
      afterData: null,
      fullPayload: this.configService.shouldCaptureFullPayload() ? result : null,
      metadata,
    };

    await this.writeLog(logData);
  }

  private async writeLog(logData: IAuditLogData): Promise<void> {
    if (this.configService.isAsyncEnabled()) {
      await this.writer.writeAsync(logData);
    } else {
      await this.writer.write(logData);
    }
  }
}
