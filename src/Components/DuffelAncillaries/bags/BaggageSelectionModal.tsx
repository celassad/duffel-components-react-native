import React, { useMemo, useState } from 'react';
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
import { SelectedService, WithServiceInformation } from '../types';
import PassengerBagage from './PassengerBaggage';

export default function BaggageSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
  t,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
  t: any;
  selectedBaggageServices: WithServiceInformation<SelectedService>[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
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
                <BaggageSelectionView
                  t={t}
                  offer={offer}
                  passengers={passengers}
                  handleModal={handleModal}
                  selectedBaggageServices={selectedBaggageServices}
                  setSelectedBaggageServices={setSelectedBaggageServices}
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
  handleModal,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  handleModal: () => void;
  selectedBaggageServices: WithServiceInformation<SelectedService>[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
}) {
  const [index, setIndex] = useState(0);
  const segments = getSegmentList(offer);
  const nbTabs = segments?.length ?? 0;
  const totalPrice = useMemo(() => {
    var price = 0;
    var currency = '';
    selectedBaggageServices?.map((s) => {
      price += Number(s.serviceInformation.total_amount) * s.quantity;
      currency = s.serviceInformation.total_currency;
    });
    return `${price} ${currency}`;
  }, [selectedBaggageServices]);

  const totalBags = useMemo(() => {
    var bags = 0;
    selectedBaggageServices?.map((s) => {
      bags += s.quantity;
    });
    return bags;
  }, [selectedBaggageServices]);

  return (
    <View>
      <TabHeader nbTabs={nbTabs} index={index} setIndex={setIndex} />
      <TabView
        index={index}
        offer={offer}
        segments={segments}
        passengers={passengers}
        t={t}
        selectedBaggageServices={selectedBaggageServices}
        setSelectedBaggageServices={setSelectedBaggageServices}
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
    `${t('priceFor')} ${withPlural(
      nbBags,
      `${t('extraBag')}`,
      `${t('extraBags')}`
    )}`
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

function TabView({
  offer,
  passengers,
  t,
  index,
  selectedBaggageServices,
  setSelectedBaggageServices,
  segments,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  index: number;
  selectedBaggageServices: WithServiceInformation<SelectedService>[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
  segments: OfferSliceSegment[];
}) {
  const segment = segments?.[index];
  if (!segment) {
    return <View />;
  }
  return (
    <View>
      <SegmentBaggageSelection
        offer={offer}
        segment={segment}
        passengers={passengers}
        t={t}
        selectedBaggageServices={selectedBaggageServices}
        setSelectedBaggageServices={setSelectedBaggageServices}
      />
    </View>
  );
}

function SegmentBaggageSelection({
  offer,
  segment,
  passengers,
  t,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passengers: Passenger[];
  t: any;
  selectedBaggageServices: WithServiceInformation<SelectedService>[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
}) {
  const title = `${t('flightFrom')} ${segment.origin.iata_code} ${t('to')} ${
    segment.destination.iata_code
  }`;

  return (
    <View>
      <Text style={styles.sliceTitle}>{title}</Text>
      {passengers?.map((p, i) => {
        return (
          <PassengerBagage
            t={t}
            key={p.id}
            passenger={p}
            index={i}
            segment={segment}
            offer={offer}
            selectedBaggageServices={selectedBaggageServices}
            setSelectedBaggageServices={setSelectedBaggageServices}
          />
        );
      })}
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
