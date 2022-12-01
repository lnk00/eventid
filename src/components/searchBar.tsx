import { component$ } from '@builder.io/qwik';

export interface TopCity {
  label: string;
  position: string;
}

export const topCities: TopCity[] = [
  {
    label: 'Log Angeles, USA',
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
];

export default component$(() => {
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
        {topCities.map((city) => {
          return (
            <div class="rounded bg-zinc-100 hover:bg-teal-300 hover:text-white font-semibold text-xs h-full flex items-center justify-center px-2 cursor-pointer mr-2">
              {city.label}
            </div>
          );
        })}
      </div>
    </>
  );
});