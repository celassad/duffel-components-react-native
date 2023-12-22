import React, { useMemo } from 'react';
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
  const seatServiceFromElement = element?.available_services?.find(
    (service) => service.passenger_id === currentPassengerId
  );

  const selected = isSeatSelected(element);
  const seatLabel = selected
    ? getPassengerInitials(selected.serviceInformation.passengerName)
    : element?.designator?.charAt(element.designator.length - 1) ?? '';
  const isFeePayable =
    !isNaN(+(seatServiceFromElement?.total_amount ?? 0)) &&
    +(seatServiceFromElement?.total_amount ?? 0) !== 0;

  const isSelected = selected != null;
  const onPressSelect = useMemo(
    () => (!isSelected ? () => selectSeat(element) : undefined),
    [element, isSelected, selectSeat]
  );
  if (isSelected) console.log('selected', selected);

  if (!seatServiceFromElement) return <SeatElementUnavailable width={width} />;

  return (
    <AvailableSeat
      width={width}
      seatLabel={seatLabel}
      isFeePayable={isFeePayable}
      selected={isSelected}
      onPress={onPressSelect}
    />
  );
};

export default SeatElement;
