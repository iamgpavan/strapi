/**
 * Interfaces for Audit Logging System
 * Following SOLID principles with proper abstractions
 */

export interface IAuditLogData {
  contentType: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  userId: string | null;
  userType: 'admin' | 'api' | 'system';
  userEmail: string | null;
  changedFields: string[] | null;
  beforeData: any | null;
  afterData: any | null;
  fullPayload: any | null;
  metadata: any | null;
}

export interface IUserContext {
  userId: string | null;
  userType: 'admin' | 'api' | 'system';
  userEmail: string | null;
}

export interface IMetadata {
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
}

export interface IDiffResult {
  changedFields: string[];
  beforeData: any;
  afterData: any;
}

export interface IAuditLogConfig {
  enabled: boolean;
  captureFullPayload: boolean;
  async: boolean;
  excludeContentTypes: string[];
}

// Service Interfaces - Interface Segregation Principle
export interface IUserContextExtractor {
  extract(event: any): IUserContext;
}

export interface IMetadataExtractor {
  extract(event: any): IMetadata;
}

export interface IDiffCalculator {
  calculate(oldData: any, newData: any): IDiffResult;
}

export interface IAuditLogWriter {
  write(data: IAuditLogData): Promise<any>;
  writeAsync(data: IAuditLogData): Promise<void>;
}

export interface IAuditLogRepository {
  create(data: IAuditLogData): Promise<any>;
}

export interface IContentTypeFilter {
  shouldLog(contentType: string): boolean;
}

export interface IBeforeDataCapture {
  capture(event: any, contentType: string): Promise<any>;
  retrieve(recordId: string | number): any | null;
  cleanup(recordId: string | number): void;
}
