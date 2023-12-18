import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { Offer, OfferSliceSegment, Passenger } from '../../../duffelTypes';
import TabFooter from '../../CommonComponents/TabFooter';
import TabHeader from '../../CommonComponents/TabHeader';
import { capitalizeFirstLetter, getSegmentList, withPlural } from '../../tools';

export default function SeatSelectionModal({
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
                style={{ paddingBottom: 10 }}
                keyboardShouldPersistTaps="always"
              >
                <SeatSelectionView
                  t={t}
                  offer={offer}
                  passengers={passengers}
                  handleModal={handleModal}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function SeatSelectionView({
  offer,
  passengers,
  t,
  handleModal,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  handleModal: () => void;
}) {
  const [index, setIndex] = useState(0);
  const segments = getSegmentList(offer);
  const nbTabs = segments?.length ?? 0;
  const totalPrice = '0';
  const totalBags = 0;

  return (
    <View>
      <TabHeader nbTabs={nbTabs} index={index} setIndex={setIndex} />
      <TabView
        index={index}
        offer={offer}
        segments={segments}
        passengers={passengers}
        t={t}
      />
      <TotalPrice price={totalPrice} nbBags={totalBags} t={t} />
      <TabFooter
        index={index}
        setIndex={setIndex}
        t={t}
        handleModal={handleModal}
        nbTabs={nbTabs}
      />
    </View>
  );
}

function TabView({
  offer,
  passengers,
  t,
  index,
  segments,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  index: number;
  segments: OfferSliceSegment[];
}) {
  const segment = segments?.[index];
  if (!segment) {
    return <View />;
  }
  return (
    <View>
      <SegmentSeatSelection
        offer={offer}
        segment={segment}
        passengers={passengers}
        t={t}
      />
    </View>
  );
}

function TotalPrice({
  price,
  nbBags,
  t,
}: {
  price: string;
  nbBags: number;
  t: any;
}) {
  const text = capitalizeFirstLetter(
    `${t('priceFor')} ${withPlural(nbBags, `${t('seat')}`, `${t('seats')}`)}`
  );
  return (
    <>
      <View style={styles.dividerStyle} />
      <View style={styles.totalPriceViewStyle}>
        <Text style={styles.priceLabel}>{text}</Text>
        <Text style={styles.priceText}>{price}</Text>
      </View>
    </>
  );
}

function SegmentSeatSelection({
  offer,
  segment,
  passengers,
  t,
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passengers: Passenger[];
  t: any;
}) {
  const title = `${t('flightFrom')} ${segment.origin.iata_code} ${t('to')} ${
    segment.destination.iata_code
  }`;
  console.log(passengers?.length, offer?.id);
  return (
    <View>
      <Text style={styles.sliceTitle}>{title}</Text>
      <Text>test</Text>
    </View>
  );
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  dividerStyle: {
    backgroundColor: 'lightgrey',
    height: 1,
    width: '100%',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 14,
  },
  totalPriceViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  overlayStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    padding: 30,
    maxHeight: '90%',
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
