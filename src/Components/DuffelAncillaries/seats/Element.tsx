import React from 'react';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import { SelectedService, WithServiceInformation } from '../types';
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
  isUnique,
  selectSeat,
  isSeatSelected,
}: {
  element: SeatMapCabinRowSectionElement;
  sectionIndex: number;
  elementIndex: number;
  currentPassengerId: string;
  width: number;
  isUnique: boolean;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService> | undefined;
}) => {
  const totalSize = width - MARGIN * 2;
  console.log(elementIndex);
  // return  <EmptyElement width={totalSize} />

  switch (element.type) {
    case 'empty':
      return <EmptyElement width={totalSize} />;
    case 'seat':
      return (
        <SeatElement
          currentPassengerId={currentPassengerId}
          element={element}
          width={totalSize}
          selectSeat={selectSeat}
          isSeatSelected={isSeatSelected}
        />
      );
    default:
      return (
        <AmenityElement
          amenity={element.type}
          sectionIndex={sectionIndex}
          width={totalSize}
          isUnique={isUnique}
        />
      );
  }
};

export default Element;
