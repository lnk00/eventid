import { component$, Resource } from '@builder.io/qwik';
import { RequestHandler, useEndpoint } from '@builder.io/qwik-city';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

export interface TopCity {
  label: string;
  position: string;
}

export const topCities: TopCity[] = [
  {
    label: 'New york, USA',
    position: '',
  },
  {
    label: 'Paris, France',
    position: '',
  },
  {
    label: 'Berlin, Germany',
    position: '',
  },
  {
    label: 'Seoul, Korea',
    position: '',
  },
  {
    label: 'Toronto, Canada',
    position: '',
  },
  {
    label: 'Buenos aires, Argentina',
    position: '',
  },
];

export interface Event {
  name: string;
  description: string;
  distance: number;
  url: string;
  image: string;
  date: string;
  price?: {
    currency: string;
    min: number;
    max: number;
  };
}

export const urlBuilder = () => {
  const token = process.env.TICKETMASTER_API_KEY;
  const type = 'music';
  const location = '40.434733611106836,-3.689844845968338';
  const radius = '100';
  const unit = 'km';
  const local = '*';
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${token}&keyword=${type}&latlong=${location}&radius=${radius}&unit=${unit}&locale=${local}&startDateTime=${startDate
    .toISOString()
    .replace(/.\d+Z$/g, 'Z')}&endDateTime=${endDate
    .toISOString()
    .replace(/.\d+Z$/g, 'Z')}&sort=random`;

  return url;
};

export const onGet: RequestHandler<Event[]> = async () => {
  dotenv.config();

  const events: Event[] = [];
  const url = urlBuilder();
  const res = await fetch(url);
  const data = await res.json();

  if (!data._embedded) {
    return [];
  }

  data._embedded.events.forEach((element: any) => {
    events.push({
      name: element.name,
      description: element.description,
      distance: element.distance,
      url: element.url,
      image: element.images.find((img: any) => img.ratio === '4_3').url,
      date: dayjs(element.dates.start.dateTime).format('DD MMM YY - hh:mm A'),
      price: element.priceRanges
        ? {
            currency: element.priceRanges
              ? element.priceRanges['0'].currency
              : '',
            min: element.priceRanges ? element.priceRanges['0'].min : 0,
            max: element.priceRanges ? element.priceRanges['0'].max : 0,
          }
        : undefined,
    });
  });

  const e = events.reduce((acc: Event[], ev: Event) => {
    const isFound = acc.find((elem: Event) => elem.name === ev.name);
    if (!isFound) {
      acc.push(ev);
    }
    return acc;
  }, []);

  return e.slice(0, 3);
};

export default component$(() => {
  const events = useEndpoint<typeof onGet>();

  return (
    <div class="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <div class="mb-8 max-w-4xl w-full">
        <h1 class="font-black text-teal-400 text-6xl mb-4">Events nearby</h1>
        <div class="flex items-center rounded-full border-zinc-100 border-2 h-12 w-full overflow-hidden pl-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 mr-2 text-zinc-300"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>

          <input
            type="search"
            placeholder="Paris, France"
            class="w-full focus:outline-none mr-2"
          />
          <div class="ml-auto h-full w-24 rounded-r-full bg-teal-400 hover:bg-teal-300 shrink-0 font-semibold text-white flex justify-center items-center cursor-pointer">
            Search
          </div>
        </div>
        <div class="flex items-center mt-2 w-full h-8 px-6">
          {topCities.map((city) => {
            return (
              <div class="rounded bg-zinc-100 hover:bg-teal-300 hover:text-white font-semibold text-xs h-full flex items-center justify-center px-2 cursor-pointer mr-2">
                {city.label}
              </div>
            );
          })}
        </div>
      </div>
      <div class="flex items-center max-w-4xl justify-center w-screen">
        <Resource
          value={events}
          onPending={() => <div>Loading...</div>}
          onRejected={() => <div>Error</div>}
          onResolved={(events: Event[]) => {
            return (
              <div class="flex justify-between w-full">
                {events.map((event) => (
                  <div class="bg-white rounded-md shadow-lg w-[260px]">
                    <img src={event.image} class="rounded-t-md h-48" />
                    <div class="p-4 flex flex-col">
                      <div class="mb-1 flex justify-between items-center">
                        <p class="text-lg font-black text-ellipsis whitespace-nowrap overflow-hidden">
                          {event.name}
                        </p>
                        <div class="flex items-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-3 h-3 text-teal-400 -mt-0.5"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.453 4.26 1.763a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <p class="text-xs text-teal-400 ml-1">
                            {event.distance} KM
                          </p>
                        </div>
                      </div>
                      <div class="bg-zinc-100 rounded px-2 py-1 text-xs items-center inline-flex self-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3"
                        >
                          <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
                          <path
                            fillRule="evenodd"
                            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span class="ml-1">{event.date}</span>
                      </div>

                      {event.price ? (
                        <div class="rounded bg-teal-100 p-2 flex justify-between items-center mt-2">
                          <div class="flex items-baseline">
                            <p class="font-semibold text-xs mr-1">From</p>
                            <p class="font-black mr-1">{event.price.min}€</p>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>

                          <div class="flex items-baseline">
                            <p class="font-semibold text-xs mr-1">To</p>
                            <p class="font-black mr-1">{event.price.max}€</p>
                          </div>
                        </div>
                      ) : (
                        <div class="rounded bg-teal-100 p-2 flex justify-between items-center mt-2">
                          <div class="flex items-baseline">
                            <p class="font-black mr-1">Unkown Price</p>
                          </div>
                        </div>
                      )}

                      <div class="bg-teal-400 hover:bg-teal-300 py-2 text-white rounded cursor-pointer mt-2 text-center">
                        <p>Get your tickets</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
});
