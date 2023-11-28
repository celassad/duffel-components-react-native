import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { Offer, OfferSlice, Passenger } from '../../../duffelTypes';
import PassengerBagage from './PassengerBaggage';

export default function BaggageSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
  t,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
  t: any;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        handleModal();
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleModal}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback style={{ flex: 1 }}>
            <View style={styles.overlayStyle}>
              <ScrollView
                style={{ height: 350, paddingBottom: 10 }}
                keyboardShouldPersistTaps="always"
              >
                <BaggageSelectionView
                  t={t}
                  offer={offer}
                  passengers={passengers}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function BaggageSelectionView({
  offer,
  passengers,
  t,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
}) {
  return (
    <>
      {offer.slices?.[0] ? (
        <SliceBaggageSelection
          offer={offer}
          slice={offer.slices?.[0]}
          passengers={passengers}
          t={t}
        />
      ) : (
        <></>
      )}
    </>
  );
}
function SliceBaggageSelection({
  offer,
  slice,
  passengers,
  t,
}: {
  offer: Offer;
  slice: OfferSlice;
  passengers: Passenger[];
  t: any;
}) {
  const title = `${t('flightFrom')} ${slice.origin.iata_city_code} ${t('to')} ${
    slice.destination.iata_city_code
  }`;

  return (
    <View>
      <Text style={styles.sliceTitle}>{title}</Text>
      {passengers?.map((p, i) => {
        return (
          <PassengerBagage
            t={t}
            passenger={p}
            index={i}
            slice={slice}
            offer={offer}
          />
        );
      })}
    </View>
  );
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    padding: 30,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sliceTitle: {
    fontWeight: 'bold',
    color: 'hsl(203, 14%, 23%)',
    fontSize: 18,
    marginBottom: 20,
  },
});
