/**
 * Audit Log Repository
 * Single Responsibility: Handles database operations for audit logs
 */

import type { Core } from '@strapi/strapi';
import { IAuditLogRepository, IAuditLogData } from '../interfaces';

export class AuditLogRepository implements IAuditLogRepository {
  private strapi: Core.Strapi;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
  }

  public async create(data: IAuditLogData): Promise<any> {
    try {
      const logEntry = await this.strapi.documents('api::audit-log.audit-log').create({
        data: {
          contentType: data.contentType,
          recordId: String(data.recordId),
          action: data.action,
          userId: data.userId ? String(data.userId) : null,
          userType: data.userType || 'system',
          userEmail: data.userEmail || null,
          changedFields: data.changedFields || null,
          beforeData: data.beforeData || null,
          afterData: data.afterData || null,
          fullPayload: data.fullPayload || null,
          metadata: data.metadata || null,
        },
      });

      return logEntry;
    } catch (error) {
      this.strapi.log.error('Failed to create audit log entry:', error);
      throw error;
    }
  }
}
