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
import { TopCity } from './models/topCity';

export interface SharedStore {
  token: string;
  location: string;
  topCities: TopCity[];
}
export const CTX = createContext<SharedStore>('stores');

export default component$(() => {
  dotenv.config();

  const store = useStore({
    token: process.env.TICKETMASTER_API_KEY!,
    location: '48.85951116665961,2.335703471976787',
    topCities: [
      {
        label: 'Los Angeles, USA',
        position: '34.08529901255528,-118.39357320557158',
      },
      {
        label: 'Paris, France',
        position: '48.85951116665961,2.335703471976787',
      },
      {
        label: 'Madrid, Spain',
        position: '40.42584819565037,-3.689844845968338',
      },
      {
        label: 'Marseille, France',
        position: '43.31773918157906,5.373087073541116',
      },
      {
        label: 'Toronto, Canada',
        position: '43.7020145146627,-79.3423847221593',
      },
      {
        label: 'Las Vegas, USA',
        position: '36.12568067615163,-115.18264791503012',
      },
    ],
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
