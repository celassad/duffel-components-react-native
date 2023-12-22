import React from 'react';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import { getPassengerInitials } from '../../tools';
import { SelectedService, WithServiceInformation } from '../types';
import AvailableSeat from './AvailableSeat';
import SeatElementUnavailable from './SeatElementUnavailable';

const SeatElement = ({
  element,
  width,
  currentPassengerId,
  selectSeat,
  isSeatSelected,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
  currentPassengerId: string;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService> | undefined;
}) => {
  // console.log('seat element', element.type);

  const seatServiceFromElement = element?.available_services?.find(
    (service) => service.passenger_id === currentPassengerId
  );

  if (!seatServiceFromElement) return <SeatElementUnavailable width={width} />;

  const selected = isSeatSelected(element);
  const seatLabel = selected
    ? getPassengerInitials(selected.serviceInformation.passengerName)
    : element?.designator?.charAt(element.designator.length - 1) ?? '';
  const isFeePayable =
    !isNaN(+seatServiceFromElement?.total_amount) &&
    +seatServiceFromElement?.total_amount !== 0;

  return (
    <AvailableSeat
      width={width}
      seatLabel={seatLabel}
      isFeePayable={isFeePayable}
      selected={selected != null}
      onPress={() => selectSeat(element)}
    />
  );
};

export default SeatElement;
