import {
  component$,
  useStyles$,
  createContext,
  useStore,
  useContextProvider,
} from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import dotenv from 'dotenv';
import globalStyles from './global.css?inline';

export interface SharedStore {
  token: string;
  location: string;
}
export const CTX = createContext<SharedStore>('stores');

export default component$(() => {
  dotenv.config();

  const store = useStore({
    token: process.env.TICKETMASTER_API_KEY!,
    location: '48.85951116665961,2.335703471976787',
  });
  useContextProvider(CTX, store);

  useStyles$(globalStyles);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
