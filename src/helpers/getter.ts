import { urlBuilder } from '~/helpers/builders';
import dayjs from 'dayjs';
import { Event } from '~/models/event';

export const getEvents = async (location: string, token: string) => {
  const events: Event[] = [];
  const url = urlBuilder(location, token);
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
