import { component$, Resource } from '@builder.io/qwik';
import { RequestHandler, useEndpoint } from '@builder.io/qwik-city';
import dayjs from 'dayjs';
import { Event } from '~/models/event';
import Card from '~/components/card';
import SearchBar from '~/components/searchBar';
import { urlBuilder } from '~/helpers/builders';

export const onGet: RequestHandler<Event[]> = async () => {
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
    <div class="flex flex-col items-center justify-center h-screen w-screen bg-white px-8">
      <div class="mb-8 max-w-4xl w-full">
        <div class="flex items-baseline">
          <h1 class="font-black text-teal-400 text-6xl mb-4">Events nearby</h1>
          <h2 class="font-black text-zinc-300 text-2xl ml-2">This week</h2>
        </div>
        <SearchBar></SearchBar>
      </div>
      <div class="flex items-center max-w-4xl justify-center w-full">
        <Resource
          value={events}
          onPending={() => <div>Loading...</div>}
          onRejected={() => <div>Error</div>}
          onResolved={(events: Event[]) => {
            return (
              <div class="flex flex-wrap justify-between w-full">
                {events.map((event) => (
                  <Card event={event}></Card>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
});
