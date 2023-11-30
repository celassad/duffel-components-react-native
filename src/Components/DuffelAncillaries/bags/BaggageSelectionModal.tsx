import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import {
  Offer,
  OfferSlice,
  Passenger,
  SelectedService,
} from '../../../duffelTypes';
import { withPlural } from './helpers';
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
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
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
                style={{ height: '70%', paddingBottom: 10 }}
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

function TabHeader({
  nbTabs,
  index,
  setIndex,
}: {
  nbTabs: number;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  var indicators: JSX.Element[] = [];

  for (let i = 0; i < nbTabs; i++) {
    indicators.push(
      <Indicator index={i} selectedIndex={index} setIndex={setIndex} />
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 10,
      }}
    >
      <>{indicators}</>
    </View>
  );
}

function Indicator({
  index,
  selectedIndex,
  setIndex,
}: {
  index: number;
  selectedIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const isSelected = index === selectedIndex;
  return (
    <Icon
      name="circle"
      size={10}
      iconStyle={{ padding: 6 }}
      color={isSelected ? 'black' : 'lightgrey'}
      onPress={() => {
        setIndex(index);
      }}
    />
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
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
}) {
  const [index, setIndex] = useState(0);
  const nbTabs = offer.slices?.length ?? 0;
  const isLastIndex = useMemo(() => {
    return index === nbTabs - 1;
  }, [index, nbTabs]);

  const totalPrice = useMemo(() => {
    var price = 0;
    var currency = '';
    selectedBaggageServices.map((s) => {
      price += Number(s.service.total_amount) * s.quantity;
      currency = s.service.total_currency;
    });
    return `${price} ${currency}`;
  }, [selectedBaggageServices]);

  const totalBags = useMemo(() => {
    var bags = 0;
    selectedBaggageServices.map((s) => {
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
        passengers={passengers}
        t={t}
        selectedBaggageServices={selectedBaggageServices}
        setSelectedBaggageServices={setSelectedBaggageServices}
      />
      <View
        style={{ backgroundColor: 'lightgrey', height: 1, width: '100%' }}
      />
      <TotalPrice price={totalPrice} nbBags={totalBags} t={t} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {index === 0 ? (
          <View />
        ) : (
          <Button
            title={t('back')}
            onPress={() => {
              setIndex(index - 1);
            }}
            titleStyle={styles.buttonTitle}
          />
        )}
        {isLastIndex ? (
          <Button
            title={t('confirm')}
            onPress={handleModal}
            titleStyle={styles.buttonTitle}
          />
        ) : (
          <Button
            title={t('next')}
            onPress={() => {
              setIndex(index + 1);
            }}
            titleStyle={styles.buttonTitle}
          />
        )}
      </View>
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
  const text = `${t('priceFor')} ${withPlural(
    nbBags,
    `${t('extraBag')}`,
    `${t('extraBags')}`
  )}`;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 14, textTransform: 'capitalize' }}>{text}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{price}</Text>
    </View>
  );
}

function TabView({
  offer,
  passengers,
  t,
  index,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  index: number;
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
}) {
  const slice = offer.slices?.[index];
  if (!slice) {
    return <></>;
  }
  return (
    <View>
      <SliceBaggageSelection
        offer={offer}
        slice={slice}
        passengers={passengers}
        t={t}
        selectedBaggageServices={selectedBaggageServices}
        setSelectedBaggageServices={setSelectedBaggageServices}
      />
    </View>
  );
}

function SliceBaggageSelection({
  offer,
  slice,
  passengers,
  t,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  offer: Offer;
  slice: OfferSlice;
  passengers: Passenger[];
  t: any;
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
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
  buttonTitle: {
    textTransform: 'capitalize',
  },
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
