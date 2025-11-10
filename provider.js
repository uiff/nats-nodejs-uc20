#!/usr/bin/env node
import { connect, StringCodec } from 'nats';
import { requestToken } from './auth.js';
import {
  CLIENT_NAME,
  PROVIDER_ID,
  NATS_SERVER,
  NATS_SUBJECT,
  PUBLISH_INTERVAL_MS,
} from './config.js';

const sc = StringCodec();

async function startProvider() {
  console.log(`[provider] Starte Node.js Provider für ${PROVIDER_ID}`);
  const token = await requestToken();
  const nc = await connect({
    servers: NATS_SERVER.split(','),
    token,
    name: `${CLIENT_NAME}-node-provider`,
  });

  console.log('[provider] NATS verbunden:', nc.getServer().toString());

  const publish = () => {
    const payload = {
      providerId: PROVIDER_ID,
      temperature: Number((20 + Math.random() * 10).toFixed(2)),
      timestamp: new Date().toISOString(),
    };
    nc.publish(NATS_SUBJECT, sc.encode(JSON.stringify(payload)));
    console.log('[provider] publish', payload);
  };

  const timer = setInterval(publish, PUBLISH_INTERVAL_MS);
  publish();

  const cleanup = async () => {
    clearInterval(timer);
    await nc.drain();
    console.log('[provider] Verbindung geschlossen.');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

startProvider().catch((err) => {
  console.error('[provider] Fehler:', err.message);
  process.exit(1);
});
