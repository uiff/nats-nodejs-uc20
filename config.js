import 'dotenv/config';

export const HUB_HOST = process.env.HUB_HOST ?? '192.168.10.108';
export const HUB_PORT = Number(process.env.HUB_PORT ?? 49360);
export const PROVIDER_ID = process.env.PROVIDER_ID ?? 'sampleprovider';
export const CLIENT_NAME = process.env.CLIENT_NAME ?? 'sampleprovider';
export const CLIENT_ID = process.env.CLIENT_ID ?? '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET ?? '';
export const TOKEN_SCOPE = process.env.TOKEN_SCOPE ?? 'hub.variables.readwrite';
export const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT ?? `https://${HUB_HOST}/oauth2/token`;
export const NATS_SUBJECT = process.env.NATS_SUBJECT ?? `demo.samples.temperature`;
export const PUBLISH_INTERVAL_MS = Number(process.env.PUBLISH_INTERVAL_MS ?? 1000);
export const NATS_SERVER = process.env.NATS_SERVER ?? `nats://${HUB_HOST}:${HUB_PORT}`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('[config] CLIENT_ID oder CLIENT_SECRET fehlen – bitte .env ausfüllen.');
}
