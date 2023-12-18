import React from 'react';
import { View } from 'react-native';
import { Offer, Passenger, SeatMap } from '../../duffelTypes';
import BaggageSelectionCard from './bags/BaggageSelectionCard';
import SeatSelectionCard from './seats/SeatSelectionCard';
import { SelectedService } from './types';

type DuffelAncillariesProps = {
  offer: Offer;
  passengers: Passenger[];
  lng: 'en' | 'fr';
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
  seatMaps: SeatMap[] | undefined;
};

export default function DuffelAncillaries(props: DuffelAncillariesProps) {
  return (
    <View>
      <BaggageSelectionCard
        lng={props.lng}
        offer={props.offer}
        passengers={props.passengers}
        selectedBaggageServices={props.selectedBaggageServices}
        setSelectedBaggageServices={props.setSelectedBaggageServices}
      />
      <View style={{ height: 12 }} />
      <SeatSelectionCard
        lng={props.lng}
        offer={props.offer}
        passengers={props.passengers}
        seatMaps={props.seatMaps}
      />
    </View>
  );
}
