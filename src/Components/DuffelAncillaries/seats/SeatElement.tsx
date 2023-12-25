import {
  SelectedService,
  WithServiceInformation,
} from 'duffel-components-react-native/src/Components/DuffelAncillaries/types';
import React from 'react';
import { Passenger, SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import { getPassengerInitials } from '../../tools';
import AvailableSeat from './AvailableSeat';
import SeatElementUnavailable from './SeatElementUnavailable';

const SeatElement = ({
  element,
  width,
  currentPassenger,
  selectSeat,
  isSeatSelected,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
  currentPassenger: Passenger;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: WithServiceInformation<SelectedService> | undefined;
}) => {
  const seatServiceFromElement = element?.available_services?.find(
    (service) => service.passenger_id === currentPassenger.id
  );

  const seatLabel =
    isSeatSelected != null
      ? getPassengerInitials(isSeatSelected.serviceInformation.passengerName)
      : element?.designator?.charAt(element.designator.length - 1) ?? '';

  const isFeePayable =
    !isNaN(+(seatServiceFromElement?.total_amount ?? 0)) &&
    +(seatServiceFromElement?.total_amount ?? 0) !== 0;

  if (!seatServiceFromElement) return <SeatElementUnavailable width={width} />;

  return (
    <AvailableSeat
      width={width}
      seatLabel={seatLabel}
      isFeePayable={isFeePayable}
      selected={isSeatSelected != null}
      onPress={() => selectSeat(element)}
    />
  );
};

export default React.memo(SeatElement);
