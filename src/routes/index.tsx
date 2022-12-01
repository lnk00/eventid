import {
  component$,
  Resource,
  useResource$,
  useContext,
} from '@builder.io/qwik';
import { Event } from '~/models/event';
import Card from '~/components/card';
import SearchBar from '~/components/searchBar';
import { CTX } from '~/root';
import { getEvents } from '~/helpers/getter';

export default component$(() => {
  const store = useContext(CTX);

  const events = useResource$<Event[]>(async (ctx) => {
    ctx.track(() => store.location);
    const res = await getEvents(store.location, store.token);
    return res;
  });

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
          onPending={() => (
            <div class="h-[376px] w-full bg-zinc-100 rounded flex items-center justify-center"></div>
          )}
          onRejected={() => (
            <div class="h-[376px] w-full bg-zinc-100 rounded flex items-center justify-center"></div>
          )}
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
