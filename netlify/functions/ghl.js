const fetch = require('node-fetch');

const GHL_BASE = 'https://services.leadconnectorhq.com';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const apiKey = event.headers['x-api-key'];
  if (!apiKey) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Missing x-api-key header' }) };
  }

  const ghlPath = event.path.replace('/.netlify/functions/ghl', '') || '/';
  const queryString = event.rawQuery ? '?' + event.rawQuery : '';
  const url = `${GHL_BASE}${ghlPath}${queryString}`;

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
