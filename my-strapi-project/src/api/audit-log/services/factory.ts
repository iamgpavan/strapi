/**
 * Service Factory (Dependency Injection Container)
 * Single Responsibility: Creates and manages service instances
 * Follows Inversion of Control principle
 */

import type { Core } from '@strapi/strapi';
import { AuditLogConfigService } from './config.service';
import { UserContextExtractorService } from './user-context-extractor.service';
import { MetadataExtractorService } from './metadata-extractor.service';
import { DiffCalculatorService } from './diff-calculator.service';
import { BeforeDataCaptureService } from './before-data-capture.service';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { AuditLogWriterService } from './audit-log-writer.service';
import { AuditLogOrchestratorService } from './audit-log-orchestrator.service';

export class AuditLogServiceFactory {
  private static instances: Map<string, any> = new Map();

  public static createOrchestrator(strapi: Core.Strapi): AuditLogOrchestratorService {
    const cacheKey = 'orchestrator';

    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey);
    }

    // Create dependencies
    const configService = this.createConfigService(strapi);
    const userContextExtractor = this.createUserContextExtractor();
    const metadataExtractor = this.createMetadataExtractor();
    const diffCalculator = this.createDiffCalculator();
    const beforeDataCapture = this.createBeforeDataCapture(strapi);
    const repository = this.createRepository(strapi);
    const writer = this.createWriter(strapi, repository, configService);

    // Create orchestrator with all dependencies
    const orchestrator = new AuditLogOrchestratorService(
      strapi,
      configService,
      userContextExtractor,
      metadataExtractor,
      diffCalculator,
      writer,
      beforeDataCapture
    );

    this.instances.set(cacheKey, orchestrator);
    return orchestrator;
  }

  private static createConfigService(strapi: Core.Strapi): AuditLogConfigService {
    const cacheKey = 'config';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new AuditLogConfigService(strapi));
    }
    return this.instances.get(cacheKey);
  }

  private static createUserContextExtractor(): UserContextExtractorService {
    const cacheKey = 'userContextExtractor';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new UserContextExtractorService());
    }
    return this.instances.get(cacheKey);
  }

  private static createMetadataExtractor(): MetadataExtractorService {
    const cacheKey = 'metadataExtractor';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new MetadataExtractorService());
    }
    return this.instances.get(cacheKey);
  }

  private static createDiffCalculator(): DiffCalculatorService {
    const cacheKey = 'diffCalculator';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new DiffCalculatorService());
    }
    return this.instances.get(cacheKey);
  }

  private static createBeforeDataCapture(strapi: Core.Strapi): BeforeDataCaptureService {
    const cacheKey = 'beforeDataCapture';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new BeforeDataCaptureService(strapi));
    }
    return this.instances.get(cacheKey);
  }

  private static createRepository(strapi: Core.Strapi): AuditLogRepository {
    const cacheKey = 'repository';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new AuditLogRepository(strapi));
    }
    return this.instances.get(cacheKey);
  }

  private static createWriter(
    strapi: Core.Strapi,
    repository: AuditLogRepository,
    configService: AuditLogConfigService
  ): AuditLogWriterService {
    const cacheKey = 'writer';
    if (!this.instances.has(cacheKey)) {
      this.instances.set(cacheKey, new AuditLogWriterService(strapi, repository, configService));
    }
    return this.instances.get(cacheKey);
  }

  // Clear all cached instances (useful for testing)
  public static clearInstances(): void {
    this.instances.clear();
  }
}
