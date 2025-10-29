import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::audit-log.audit-log', ({ strapi }) => ({
  async createAuditLog(data) {
    try {
      const auditLogConfig: any = strapi.config.get('audit-log');

      if (!auditLogConfig?.enabled) {
        return null;
      }

      if (auditLogConfig?.excludeContentTypes?.includes(data.contentType)) {
        return null;
      }

      const logEntry = await strapi.documents('api::audit-log.audit-log').create({
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
      strapi.log.error('Audit log creation failed:', error);
      return null;
    }
  },

  calculateDiff(oldData, newData) {
    if (!oldData || !newData) {
      return { changedFields: [], beforeData: {}, afterData: {} };
    }

    const changedFields = [];
    const beforeData = {};
    const afterData = {};

    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    allKeys.forEach((key) => {
      if (key === 'updatedAt' || key === 'createdAt' || key === 'publishedAt') {
        return;
      }

      const oldValue = oldData[key];
      const newValue = newData[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changedFields.push(key);
        beforeData[key] = oldValue;
        afterData[key] = newValue;
      }
    });

    return { changedFields, beforeData, afterData };
  },

  async logAsync(logData) {
    setImmediate(async () => {
      await this.createAuditLog(logData);
    });
  },
}));
