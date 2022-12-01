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
