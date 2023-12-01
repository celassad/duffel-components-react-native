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
import { capitalizeFirstLetter, withPlural } from './helpers';
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

function TabFooter({
  index,
  setIndex,
  t,
  handleModal,
  nbTabs,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
  handleModal: () => void;
  nbTabs: number;
}) {
  const isLastIndex = useMemo(() => {
    return index === nbTabs - 1;
  }, [index, nbTabs]);

  if (index === 0) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.buttonContainerStyle} />
        <NextButton t={t} index={index} setIndex={setIndex} />
      </View>
    );
  } else if (isLastIndex) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <BackButton t={t} index={index} setIndex={setIndex} />
        <ConfirmButton t={t} onPress={handleModal} />
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <BackButton t={t} index={index} setIndex={setIndex} />
        <NextButton t={t} index={index} setIndex={setIndex} />
      </View>
    );
  }
}

function BackButton({
  index,
  setIndex,
  t,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
}) {
  return (
    <Button
      title={t('back')}
      onPress={() => {
        setIndex(index - 1);
      }}
      titleStyle={styles.secondaryButtonTitleStyle}
      buttonStyle={styles.secondaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
  );
}

function NextButton({
  index,
  setIndex,
  t,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
}) {
  return (
    <Button
      title={t('next')}
      onPress={() => {
        setIndex(index + 1);
      }}
      titleStyle={styles.primaryButtonTitleStyle}
      buttonStyle={styles.primaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
  );
}

function ConfirmButton({ onPress, t }: { onPress: () => void; t: any }) {
  return (
    <Button
      title={t('confirm')}
      onPress={onPress}
      titleStyle={styles.primaryButtonTitleStyle}
      buttonStyle={styles.primaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
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
    <View style={styles.totalPriceViewStyle}>
      <Text style={styles.priceLabel}>{text}</Text>
      <Text style={styles.priceText}>{price}</Text>
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
  secondaryButtonTitleStyle: {
    textTransform: 'capitalize',
    color: 'black',
  },
  secondaryButtonStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  primaryButtonTitleStyle: {
    textTransform: 'capitalize',
    color: 'white',
  },
  primaryButtonStyle: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  buttonContainerStyle: {
    flex: 1,
    margin: 5,
  },
  buttonTitle: {
    textTransform: 'capitalize',
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
