import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import {
  Offer,
  OfferSliceSegment,
  Passenger,
  SelectedService,
  Service,
} from '../../../duffelTypes';
import BaggageSelectionController from './BaggageSelectionController';
import IncludedBaggageBanner from './IncludedBaggageBanner';

export default function PassengerBagage({
  passenger,
  index,
  segment,
  offer,
  t,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  passenger: Passenger;
  index: number;
  segment: OfferSliceSegment;
  offer: Offer;
  t: any;
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
}) {
  const includedBaggage = segment?.passengers?.[index]?.baggages;
  const segmentId = segment?.id ?? '';
  const hasIncludedBaggage = includedBaggage?.reduce(
    (sum, bag) => sum + bag.quantity,
    0
  );

  const passengerServicesForSegment = offer?.available_services?.filter(
    ({ type, passenger_ids, segment_ids }) =>
      type === 'baggage' &&
      passenger_ids.includes(passenger.id) &&
      segment_ids.includes(segmentId)
  ) as Service[];

  return (
    <View style={{ marginBottom: 10 }} key={passenger.id}>
      <Text
        style={styles.passengerName}
      >{`${passenger.given_name} ${passenger.family_name}`}</Text>
      {hasIncludedBaggage && includedBaggage ? (
        <IncludedBaggageBanner includedBaggage={includedBaggage} t={t} />
      ) : null}

      {passengerServicesForSegment.map((availableService) => (
        <BaggageSelectionController
          key={availableService.id}
          t={t}
          availableService={availableService}
          selectedBaggageServices={selectedBaggageServices}
          setSelectedBaggageServices={setSelectedBaggageServices}
        />
      ))}
      {passengerServicesForSegment.length === 0 && (
        <Text style={styles.addBagageNotAvailableText}>{t('noBaggage')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addBagageNotAvailableText: {
    color: '#74747C',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 14,
  },
  passengerName: {
    fontWeight: 'bold',
    color: 'hsl(203, 14%, 23%)',
    padding: 10,
    fontSize: 16,
  },
});
