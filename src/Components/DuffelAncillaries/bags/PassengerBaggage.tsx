import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Offer, OfferSlice, Passenger, Service } from '../../../duffelTypes';
import BaggageSelectionController from './BaggageSelectionController';
import IncludedBaggageBanner from './IncludedBaggageBanner';

export default function PassengerBagage({
  passenger,
  index,
  slice,
  offer,
  t,
}: {
  passenger: Passenger;
  index: number;
  slice: OfferSlice;
  offer: Offer;
  t: any;
}) {
  const includedBaggage = slice.segments?.[0]?.passengers?.[index]?.baggages;
  const segmentId = slice.segments?.[0]?.id ?? '';
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
    <View>
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
          passengerId={passenger.id}
          segmentId={segmentId}
          availableService={availableService}
          // selectedServices={selectedServices}
          // quantity={
          //     selectedServices.find(
          //         ({ id }) => id == availableService.id
          //     )?.quantity || 0
          // }
          // onQuantityChanged={(newQuantity) =>
          //     onBaggageQuantityChanged(
          //         newQuantity,
          //         segmentId,
          //         passengerId,
          //         passengerName,
          //         availableService,
          //         selectedServices,
          //         setSelectedServices
          //     )
          // }
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
