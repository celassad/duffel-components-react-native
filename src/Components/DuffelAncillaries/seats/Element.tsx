import React from 'react';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import AmenityElement from './AmenityElement';
import EmptyElement from './EmptyElement';
import { MARGIN } from './helpers';
import SeatElement from './SeatElement';

const Element = ({
  element,
  sectionIndex,
  elementIndex,
  currentPassengerId,
  width,
  isUnique
}: {
  element: SeatMapCabinRowSectionElement;
  sectionIndex: number;
  elementIndex: number;
  currentPassengerId: string;
  width: number;
  isUnique: boolean;
}) => {
  const totalSize = width - MARGIN * 2;

  // return  <EmptyElement width={totalSize} />
  
  switch (element.type) {
    case 'empty':
      return <EmptyElement width={totalSize} />;
    case 'seat':
      return <SeatElement currentPassengerId={currentPassengerId} element={element} width={totalSize} />;
    default:
      return <AmenityElement amenity={element.type} sectionIndex={sectionIndex} elementIndex={elementIndex} width={totalSize} isUnique={isUnique} />;
  }
}

export default Element