import { SeatMapCabinRowSectionElementAmenity } from "duffel-components-react-native/src/Components/DuffelAncillaries/types";
import { SeatMap, SeatMapCabin, SeatMapCabinRow, SeatMapCabinRowSectionElement } from "duffel-components-react-native/src/duffelTypes";


export const getCabinsForSegmentAndDeck = (forDeck: number, seatMap: SeatMap) =>
  seatMap.cabins.filter((cabin) => cabin.deck === forDeck);

export const getSymbols = (
  cabins: SeatMapCabin[]
): Set<SeatMapCabinRowSectionElementAmenity> => {
  const results: Set<SeatMapCabinRowSectionElementAmenity> = new Set();
  for (const cabin of cabins) {
    for (const row of cabin.rows) {
      for (const section of row.sections) {
        for (const element of section.elements) {
          if (element.type !== "seat" && element.type !== "empty") {
            results.add(element.type);
          }
        }
      }
    }
  }
  return results;
};

export const getRowNumber = (row: SeatMapCabinRow): string | null | undefined => {
  const seats = Object.values(row.sections)
    .map((section) => section.elements)
    .reduce((acc, val) => acc.concat(val), [])
    .filter(
      (element) => element.type === "seat"
    ) as SeatMapCabinRowSectionElement[];

  return seats.length > 0
    ? seats[0]?.designator?.substring(0, seats[0]?.designator?.length - 1)
    : null;
};