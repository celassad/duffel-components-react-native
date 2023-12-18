import { Offer, OfferSliceSegment } from '../duffelTypes';

export function withPlural(quantity: number, singular: string, plural: string) {
  return quantity > 1 ? `${quantity} ${plural}` : `${quantity} ${singular}`;
}

export function capitalizeFirstLetter(str: string) {
  const str2 = str.charAt(0).toUpperCase() + str.slice(1);
  return str2;
}

export const getSegmentList = (offer: Offer) =>
  offer.slices.reduce(
    (accumulator, slice) => [...accumulator, ...slice.segments],
    new Array<OfferSliceSegment>()
  );
