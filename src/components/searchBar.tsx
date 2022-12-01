import { component$, useContext } from '@builder.io/qwik';
import { CTX } from '~/root';

export default component$(() => {
  const store = useContext(CTX);

  return (
    <>
      <div class="flex items-center rounded-lg border-zinc-100 border-2 h-12 w-full overflow-hidden pl-4">
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
        <div class="ml-auto h-full w-24 rounded-r-lg bg-teal-400 hover:bg-teal-300 shrink-0 font-semibold text-white flex justify-center items-center cursor-pointer">
          Search
        </div>
      </div>
      <div class="flex items-center mt-2 w-full h-8">
        {store.topCities.map((city) => {
          return (
            <div
              onClick$={() => (store.location = city.position)}
              class="rounded bg-zinc-100 hover:bg-teal-300 hover:text-white font-semibold text-xs h-full flex items-center justify-center px-2 cursor-pointer mr-2"
            >
              {city.label}
            </div>
          );
        })}
      </div>
    </>
  );
});
