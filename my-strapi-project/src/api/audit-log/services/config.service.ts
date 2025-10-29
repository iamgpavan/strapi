/**
 * Configuration Service
 * Single Responsibility: Manages audit log configuration
 */

import type { Core } from '@strapi/strapi';
import { IAuditLogConfig, IContentTypeFilter } from '../interfaces';

export class AuditLogConfigService implements IContentTypeFilter {
  private strapi: Core.Strapi;
  private config: IAuditLogConfig;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
    this.loadConfig();
  }

  private loadConfig(): void {
    const config = this.strapi.config.get('audit-log') as any;
    this.config = {
      enabled: config?.enabled ?? true,
      captureFullPayload: config?.captureFullPayload ?? false,
      async: config?.async ?? true,
      excludeContentTypes: config?.excludeContentTypes ?? [],
    };
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public shouldCaptureFullPayload(): boolean {
    return this.config.captureFullPayload;
  }

  public isAsyncEnabled(): boolean {
    return this.config.async;
  }

  public shouldLog(contentType: string): boolean {
    return !this.config.excludeContentTypes.includes(contentType);
  }

  public getConfig(): IAuditLogConfig {
    return { ...this.config };
  }
}
