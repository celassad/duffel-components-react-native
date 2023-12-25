import React from 'react';
import { Passenger, SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import { SelectedService, WithServiceInformation } from '../types';
import AmenityElement from './AmenityElement';
import EmptyElement from './EmptyElement';
import { MARGIN } from './helpers';
import SeatElement from './SeatElement';

const Element = ({
  element,
  sectionIndex,
  elementIndex,
  currentPassenger,
  width,
  isUnique,
  selectSeat,
  isSelected,
}: {
  element: SeatMapCabinRowSectionElement;
  sectionIndex: number;
  elementIndex: number;
  currentPassenger: Passenger;
  width: number;
  isUnique: boolean;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSelected: WithServiceInformation<SelectedService> | undefined;
}) => {
  const totalSize = width - MARGIN * 2;

  switch (element.type) {
    case 'empty':
      return <EmptyElement width={totalSize} />;
    case 'seat':
      return (
        <SeatElement
          key={`Seat-${elementIndex}`}
          currentPassenger={currentPassenger}
          element={element}
          width={totalSize}
          selectSeat={selectSeat}
          isSeatSelected={isSelected}
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

export default React.memo(Element);
