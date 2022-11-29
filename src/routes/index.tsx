import { component$ } from '@builder.io/qwik';

export default component$(() => {
  console.log(process.env.TICKETMASTER_API_KEY);

  return <div>Eventid</div>;
});
