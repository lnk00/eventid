import { component$, Resource } from '@builder.io/qwik';
import { RequestHandler, useEndpoint } from '@builder.io/qwik-city';
import dotenv from 'dotenv';
import days from 'dayjs';
import dayjs from 'dayjs';

export interface Event {
  name: string;
  description: string;
  distance: number;
  url: string;
  image: string;
  date: string;
}

export const urlBuilder = () => {
  const token = process.env.TICKETMASTER_API_KEY;
  const type = 'music';
  const location = '48.8566140,2.3522219';
  const radius = '100';
  const unit = 'km';
  const local = '*';
  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));
  const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${token}&keyword=${type}&latlong=${location}&radius=${radius}&unit=${unit}&locale=${local}&startDateTime=${startDate
    .toISOString()
    .replace(/.\d+Z$/g, 'Z')}&endDateTime=${endDate
    .toISOString()
    .replace(/.\d+Z$/g, 'Z')}&page=1`;

  return url;
};

export const onGet: RequestHandler<Event[]> = async () => {
  dotenv.config();

  const events: Event[] = [];
  const url = urlBuilder();
  const res = await fetch(url);
  const data = await res.json();

  data._embedded.events.forEach((element: any) => {
    events.push({
      name: element.name,
      description: element.description,
      distance: element.distance,
      url: element.url,
      image: element.images.find((img: any) => img.ratio === '4_3').url,
      date: dayjs(element.dates.start.dateTime).format('DD MMM YY - hh:mm A'),
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
    <div class="flex items-center justify-center h-screen w-screen bg-white">
      <Resource
        value={events}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={(events: Event[]) => {
          return (
            <div class="flex">
              {events.map((event) => (
                <div class="bg-white rounded-md shadow-lg mr-8 w-[260px]">
                  <img src={event.image} class="rounded-t-md h-48" />
                  <div class="p-4">
                    <div class="mb-1 flex justify-between items-center">
                      <p class="text-lg font-bold">{event.name}</p>
                      <div class="flex items-center">
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
                    <div class="bg-zinc-100 rounded px-2 py-1 text-xs items-center inline-flex mb-1">
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
  );
});
