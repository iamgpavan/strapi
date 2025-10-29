export default {
  routes: [
    {
      method: 'GET',
      path: '/audit-logs',
      handler: 'audit-log.find',
      config: {
        policies: ['api::audit-log.can-read-audit-logs'],
      },
    },
    {
      method: 'GET',
      path: '/audit-logs/:id',
      handler: 'audit-log.findOne',
      config: {
        policies: ['api::audit-log.can-read-audit-logs'],
      },
    },
  ],
};
