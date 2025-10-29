import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::audit-log.audit-log', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const filters: any = {};
    const queryFilters: any = query.filters || {};
    const queryPagination: any = query.pagination || {};

    if (queryFilters.contentType) {
      filters.contentType = queryFilters.contentType;
    }

    if (queryFilters.userId) {
      filters.userId = queryFilters.userId;
    }

    if (queryFilters.action) {
      filters.action = queryFilters.action;
    }

    if (queryFilters.userType) {
      filters.userType = queryFilters.userType;
    }

    if (queryFilters.startDate || queryFilters.endDate) {
      filters.createdAt = {};
      if (queryFilters.startDate) {
        filters.createdAt.$gte = queryFilters.startDate;
      }
      if (queryFilters.endDate) {
        filters.createdAt.$lte = queryFilters.endDate;
      }
    }

    const page = parseInt(queryPagination.page || '1');
    const pageSize = parseInt(queryPagination.pageSize || '25');
    const sortParam: any = query.sort || 'createdAt:desc';
    const sort = typeof sortParam === 'string' ? sortParam.split(',') : sortParam;

    const results = await strapi.documents('api::audit-log.audit-log').findMany({
      filters,
      sort,
      start: (page - 1) * pageSize,
      limit: pageSize,
    });

    const total = await strapi.documents('api::audit-log.audit-log').count({ filters });

    return {
      data: results,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const result = await strapi.documents('api::audit-log.audit-log').findOne({
      documentId: id,
    });

    return { data: result };
  },
}));
