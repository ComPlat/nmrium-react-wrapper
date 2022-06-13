import { EventType, EventData } from './types';

const ALLOWED_ORIGINS: string[] = [
  'https://nmrxiv.org',
  'http://localhost',
  'http://localhost:3000',
];

const namespace = 'nmr-wrapper';

function parseOrigin(origin: string) {
  const urlSegments = origin.split('://');
  const hostSegments = urlSegments[1].split('.');

  const url = `${urlSegments[0]}://${hostSegments
    .slice(hostSegments.length > 1 ? 1 : 0)
    .join('.')}`;

  return url;
}

function trigger<T extends EventType>(type: T, data: EventData<T>) {
  window.postMessage({ type: `${namespace}:${type}`, data }, '*');
}

function on<T extends EventType>(
  type: T,
  dataListener: (data: EventData<T>) => void,
  options?: boolean | AddEventListenerOptions,
) {
  function listener(event: MessageEvent) {
    const {
      origin,
      data: { type: targetType, data },
    } = event;

    if (!ALLOWED_ORIGINS.includes(parseOrigin(origin))) {
      throw new Error(`Invalid Origin ${origin}`);
    }

    if (`${namespace}:${type}` === targetType) {
      dataListener?.(data);
    }
  }
  window.addEventListener(`message`, listener, options);

  return () => window.removeEventListener(`message`, listener);
}

export default { trigger, on };
