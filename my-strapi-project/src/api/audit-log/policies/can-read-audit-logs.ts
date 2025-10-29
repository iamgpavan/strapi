export default async (policyContext, config, { strapi }) => {
  const { state } = policyContext;

  if (state.admin) {
    return true;
  }

  if (state.user) {
    const userPermissions = state.user.role?.permissions || [];
    const hasPermission = userPermissions.some(
      (permission) => permission.action === 'api::audit-log.audit-log.find'
    );
    return hasPermission;
  }

  return false;
};
