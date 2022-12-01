import dotenv from 'dotenv';

export const urlBuilder = () => {
  dotenv.config();

  const token = process.env.TICKETMASTER_API_KEY;
  const type = 'music';
  const location = '34.08529901255528,-118.39357320557158';
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
