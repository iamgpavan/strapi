# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## 🔍 Audit Logging System

This Strapi application includes a comprehensive audit logging system that automatically tracks all content changes.

### Features

- **Automatic Logging**: All create, update, and delete operations are automatically logged
- **User Tracking**: Captures admin users, API users, and system operations
- **Change Detection**: Identifies and stores exactly what changed in updates
- **Rich Metadata**: Records IP addresses, user agents, timestamps, and HTTP context
- **Flexible Filtering**: Query logs by content type, user, action, date range
- **Scalable**: Designed for multi-node deployments with async processing
- **Configurable**: Enable/disable globally or exclude specific content types

### API Endpoints

#### Get All Audit Logs

```http
GET /api/audit-logs
```

**Query Parameters:**

- `filters[contentType]` - Filter by content type (e.g., `api::article.article`)
- `filters[userId]` - Filter by user ID
- `filters[action]` - Filter by action (`create`, `update`, `delete`)
- `filters[userType]` - Filter by user type (`admin`, `api`, `system`)
- `filters[startDate]` - Filter logs after this date (ISO 8601)
- `filters[endDate]` - Filter logs before this date (ISO 8601)
- `pagination[page]` - Page number (default: 1)
- `pagination[pageSize]` - Items per page (default: 25)
- `sort` - Sort order (default: `createdAt:desc`)

**Example:**

```bash
# Get all article updates in the last 7 days
GET /api/audit-logs?filters[contentType]=api::article.article&filters[action]=update&filters[startDate]=2025-10-22T00:00:00.000Z

# Get all changes by a specific user
GET /api/audit-logs?filters[userId]=123&pagination[pageSize]=50

# Get admin panel changes with pagination
GET /api/audit-logs?filters[userType]=admin&pagination[page]=2
```

**Response:**

```json
{
  "data": [
    {
      "id": "abc123",
      "documentId": "xyz789",
      "contentType": "api::article.article",
      "recordId": "rec456",
      "action": "update",
      "userId": "user123",
      "userType": "admin",
      "userEmail": "admin@example.com",
      "changedFields": ["title", "description"],
      "beforeData": {
        "title": "Old Title",
        "description": "Old Description"
      },
      "afterData": {
        "title": "New Title",
        "description": "New Description"
      },
      "metadata": {
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "method": "PUT",
        "url": "/api/articles/rec456"
      },
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 5,
      "total": 123
    }
  }
}
```

#### Get Single Audit Log

```http
GET /api/audit-logs/:id
```

### Configuration

Edit `config/audit-log.ts` to customize behavior:

```typescript
export default ({ env }) => ({
  enabled: env.bool('AUDIT_LOG_ENABLED', true),
  excludeContentTypes: ['admin::permission', 'api::audit-log.audit-log'],
  captureFullPayload: env.bool('AUDIT_LOG_FULL_PAYLOAD', true),
  async: env.bool('AUDIT_LOG_ASYNC', true),
});
```

**Environment Variables:**

```env
AUDIT_LOG_ENABLED=true          # Enable/disable audit logging
AUDIT_LOG_FULL_PAYLOAD=true     # Store complete record snapshots
AUDIT_LOG_ASYNC=true             # Use async logging (recommended)
```

### Access Control

Audit logs are protected by the `can-read-audit-logs` policy:

- **Admin Users**: Full access by default
- **API Users**: Require explicit permission
- **Unauthenticated**: Access denied

To grant API users access, assign the `api::audit-log.audit-log.find` permission through the Users & Permissions plugin.

### What Gets Logged

Each audit log entry contains:

- **contentType**: The content type that was modified
- **recordId**: The ID of the specific record
- **action**: What happened (`create`, `update`, `delete`)
- **userId**: Who made the change
- **userType**: Type of user (`admin`, `api`, `system`)
- **userEmail**: Email of the authenticated user
- **changedFields**: Array of fields that changed (updates only)
- **beforeData**: Data before the change
- **afterData**: Data after the change
- **fullPayload**: Complete record snapshot (configurable)
- **metadata**: Request context (IP, user agent, HTTP method, URL)
- **createdAt**: When the change occurred

### Architecture

See [DESIGN_NOTE.md](./DESIGN_NOTE.md) for detailed architecture documentation including:

- System design and data flow
- Scalability considerations
- Multi-node deployment
- Performance optimization
- Security and privacy

### Excluded Content Types

By default, the following are excluded from logging to reduce noise:

- Admin system types (`admin::*`)
- Plugin types (`plugin::*`)
- The audit log itself (`api::audit-log.audit-log`)

Add additional exclusions in `config/audit-log.ts`.

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
