#!/usr/bin/env node
import { connect, StringCodec } from 'nats';
import { requestToken } from './auth.js';
import { CLIENT_NAME, NATS_SERVER, NATS_SUBJECT } from './config.js';

const sc = StringCodec();

async function startConsumer() {
  console.log(`[consumer] Lausche auf ${NATS_SUBJECT}`);
  const token = await requestToken();
  const nc = await connect({
    servers: NATS_SERVER.split(','),
    token,
    name: `${CLIENT_NAME}-node-consumer`,
  });

  const sub = nc.subscribe(NATS_SUBJECT);
  console.log('[consumer] NATS verbunden:', nc.getServer().toString());

  for await (const msg of sub) {
    const decoded = sc.decode(msg.data);
    try {
      const json = JSON.parse(decoded);
      console.log('[consumer] Nachricht', json);
    } catch (err) {
      console.log('[consumer] Raw payload', decoded);
    }
  }
}

startConsumer().catch((err) => {
  console.error('[consumer] Fehler:', err.message);
  process.exit(1);
});
