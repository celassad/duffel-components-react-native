import React from 'react';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import AmenityElement from './AmenityElement';
import EmptyElement from './EmptyElement';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';
import SeatElement from './SeatElement';

export default function Element({
  element,
  width,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
}) {
  const totalSize = width - ELEMENT_BORDER_WIDTH * 2 - MARGIN * 2;
  switch (element.type) {
    case 'empty':
      return <EmptyElement width={totalSize} />;
    case 'seat':
      return <SeatElement element={element} width={totalSize} />;
    default:
      return <AmenityElement amenity={element.type} width={totalSize} />;
  }
}
