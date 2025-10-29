const axios = require('axios');

const API_BASE = 'http://localhost:1337';

async function testUpdateWithLogging() {
  console.log('=== Testing Article Update with Debug Logging ===\n');

  // Step 1: Login
  console.log('1. Logging in...');
  const loginResponse = await axios.post(`${API_BASE}/admin/login`, {
    email: 'admin@strapi.local',
    password: 'Admin123!',
  });
  const token = loginResponse.data.data.token;
  console.log('✓ Logged in successfully\n');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Step 2: Create a test article
  console.log('2. Creating test article...');
  const createResponse = await axios.post(
    `${API_BASE}/content-manager/collection-types/api::article.article`,
    {
      title: 'Debug Test Article',
      description: 'Original description for debugging',
      slug: 'debug-test-' + Date.now(),
      content: 'Original content',
    },
    { headers }
  );
  console.log('Create response:', JSON.stringify(createResponse.data, null, 2));
  const articleId = createResponse.data.data.documentId || createResponse.data.data.id;
  console.log(`✓ Created article: ${articleId}\n`);

  // Wait a moment
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Step 3: Update the article
  console.log('3. Updating article...');
  const updateResponse = await axios.put(
    `${API_BASE}/content-manager/collection-types/api::article.article/${articleId}`,
    {
      title: 'UPDATED Debug Test Article',
      description: 'MODIFIED description after update',
      content: 'MODIFIED content',
    },
    { headers }
  );
  console.log('✓ Article updated\n');

  // Wait for async logging
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Step 4: Query audit logs
  console.log('4. Checking audit logs...');
  const auditResponse = await axios.get(
    `${API_BASE}/content-manager/collection-types/api::audit-log.audit-log?filters[$and][0][recordId][$eq]=${articleId}&sort=createdAt:desc`,
    { headers }
  );

  const logs = auditResponse.data.results;
  console.log(`Found ${logs.length} audit logs for article ${articleId}\n`);

  logs.forEach((log, idx) => {
    console.log(`--- Log ${idx + 1}: ${log.action.toUpperCase()} ---`);
    console.log('Changed Fields:', log.changedFields);
    console.log('Before Data:', log.beforeData);
    console.log('After Data:', log.afterData);
    console.log('Full Payload present:', log.fullPayload ? 'Yes' : 'No');
    console.log('');
  });

  console.log('\n=== Test Complete ===');
}

testUpdateWithLogging().catch(console.error);
