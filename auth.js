import fetch from 'node-fetch';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT, TOKEN_SCOPE } from './config.js';

// Match the Python sample behaviour: ignore self-signed certs during local testing.
// For production deployments, replace this with a proper CA certificate.
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function requestToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: TOKEN_SCOPE,
  });

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed: ${response.status} ${text}`);
  }

  const json = await response.json();
  if (!json.access_token) {
    throw new Error('Token response does not contain access_token');
  }
  return json.access_token;
}
