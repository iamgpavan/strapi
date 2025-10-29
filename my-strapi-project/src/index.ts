import type { Core } from '@strapi/strapi';
import { AuditLogServiceFactory } from './api/audit-log/services/factory';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Create orchestrator using factory (Dependency Injection)
    const auditOrchestrator = AuditLogServiceFactory.createOrchestrator(strapi);

    const contentTypes = Object.keys(strapi.contentTypes);

    contentTypes.forEach((uid) => {
      strapi.db.lifecycles.subscribe({
        models: [uid],

        async beforeUpdate(event) {
          await auditOrchestrator.captureBeforeUpdate(event, uid);
        },

        async afterCreate(event) {
          await auditOrchestrator.logCreate(event, uid);
        },

        async afterUpdate(event) {
          await auditOrchestrator.logUpdate(event, uid);
        },

        async afterDelete(event) {
          await auditOrchestrator.logDelete(event, uid);
        },
      });
    });
  },
};
