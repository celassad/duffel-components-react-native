import {
  SeatMapCabinRowSectionElementDesignator,
  SeatMapCabinRowSectionElementDisclosures,
} from '../../duffelTypes';

export type SelectedService = {
  id: string;
  quantity: number;
};

export type SeatMapCabinRowSectionElementAmenity = string;
export type Ancillaries = 'bags' | 'seats' | 'cancel_for_any_reason';

export type WithServiceInformation<TypeToExtend> = {
  serviceInformation: ServiceInformation;
} & TypeToExtend;

export type ServiceInformation =
  | BaggageServiceInformation
  | SeatServiceInformation
  | CancelForAnyReasonerviceInformation;

interface BaggageServiceInformation {
  type: 'baggage';
  segmentId: string;
  passengerId: string;
  passengerName: string;
  total_amount: string;
  total_currency: string;
  designator?: undefined;
}

interface SeatServiceInformation {
  type: 'seat';
  segmentId: string;
  passengerId: string;
  passengerName: string;
  designator: SeatMapCabinRowSectionElementDesignator | undefined;
  disclosures: SeatMapCabinRowSectionElementDisclosures | undefined;
  total_amount: string;
  total_currency: string;
}

interface CancelForAnyReasonerviceInformation {
  type: 'cancel_for_any_reason';
  segmentId?: undefined;
  sliceId?: undefined;
  total_amount: string;
  designator?: undefined;
  total_currency: string;
  passengerName?: undefined;
}
