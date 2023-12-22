import React from 'react';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import AvailableSeat from './AvailableSeat';
import SeatElementUnavailable from './SeatElementUnavailable';

const SeatElement = ({
  element,
  width,
  currentPassengerId,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
  currentPassengerId: string;
}) => {
  // console.log('seat element', element.type);

  const seatServiceFromElement = element?.available_services?.find(
    (service) => service.passenger_id === currentPassengerId
  );

  if (!seatServiceFromElement) return <SeatElementUnavailable width={width} />;

  const seatLabel =
    element?.designator?.charAt(element.designator.length - 1) ?? '';
  const isFeePayable =
    !isNaN(+seatServiceFromElement?.total_amount) &&
    +seatServiceFromElement?.total_amount !== 0;

  return (
    <AvailableSeat
      width={width}
      seatLabel={seatLabel}
      isFeePayable={isFeePayable}
      selected={false}
    />
  );
};

export default SeatElement;
