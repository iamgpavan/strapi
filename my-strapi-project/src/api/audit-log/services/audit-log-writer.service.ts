/**
 * Audit Log Writer Service
 * Single Responsibility: Writes audit logs (synchronously or asynchronously)
 * Depends on abstractions (Dependency Inversion Principle)
 */

import type { Core } from '@strapi/strapi';
import { IAuditLogWriter, IAuditLogData, IAuditLogRepository } from '../interfaces';
import { AuditLogConfigService } from './config.service';

export class AuditLogWriterService implements IAuditLogWriter {
  private strapi: Core.Strapi;
  private repository: IAuditLogRepository;
  private configService: AuditLogConfigService;

  constructor(
    strapi: Core.Strapi,
    repository: IAuditLogRepository,
    configService: AuditLogConfigService
  ) {
    this.strapi = strapi;
    this.repository = repository;
    this.configService = configService;
  }

  public async write(data: IAuditLogData): Promise<any> {
    // Check if logging is enabled
    if (!this.configService.isEnabled()) {
      return null;
    }

    // Check if content type should be logged
    if (!this.configService.shouldLog(data.contentType)) {
      return null;
    }

    return await this.repository.create(data);
  }

  public async writeAsync(data: IAuditLogData): Promise<void> {
    setImmediate(async () => {
      try {
        await this.write(data);
      } catch (error) {
        this.strapi.log.error('Async audit log write failed:', error);
      }
    });
  }
}
