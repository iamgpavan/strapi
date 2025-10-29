export const getUserContext = (event) => {
  const ctx = event?.params?.data?.ctx || strapi.requestContext?.get();

  if (!ctx) {
    return {
      userId: null,
      userType: 'system',
      userEmail: null,
    };
  }

  if (ctx.state?.user) {
    return {
      userId: ctx.state.user.id,
      userType: 'api',
      userEmail: ctx.state.user.email || null,
    };
  }

  if (ctx.state?.admin) {
    return {
      userId: ctx.state.admin.id,
      userType: 'admin',
      userEmail: ctx.state.admin.email || null,
    };
  }

  return {
    userId: null,
    userType: 'system',
    userEmail: null,
  };
};

export const extractMetadata = (event) => {
  const ctx = event?.params?.data?.ctx || strapi.requestContext?.get();

  if (!ctx) {
    return {};
  }

  return {
    ip: ctx.request?.ip || null,
    userAgent: ctx.request?.headers['user-agent'] || null,
    method: ctx.request?.method || null,
    url: ctx.request?.url || null,
  };
};

export const shouldLogContentType = (uid: string) => {
  const auditLogConfig: any = strapi.config.get('audit-log');

  if (!auditLogConfig?.enabled) {
    return false;
  }

  if (auditLogConfig?.excludeContentTypes?.includes(uid)) {
    return false;
  }

  return true;
};
