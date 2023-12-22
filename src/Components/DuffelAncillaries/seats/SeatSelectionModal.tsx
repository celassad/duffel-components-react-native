import React, { useCallback, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Text } from 'react-native-elements';
import {
  Offer,
  OfferSliceSegment,
  Passenger,
  SeatMap,
  SeatMapCabinRowSectionElement
} from '../../../duffelTypes';
import TabFooter from '../../CommonComponents/TabFooter';
import TabHeader from '../../CommonComponents/TabHeader';
import { capitalizeFirstLetter, getSegmentList, withPlural } from '../../tools';
import { SelectedService, WithServiceInformation } from '../types';
import SeatMapView from './SeatMapView';

const MODAL_PADDING = 20;

export default function SeatSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
  t,
  seatMaps,
  selectedServices,
  setSelectedServices,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
  t: any;
  seatMaps: SeatMap[];
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
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
              <SeatSelectionView
                t={t}
                offer={offer}
                passengers={passengers}
                handleModal={handleModal}
                seatMaps={seatMaps}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
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
  seatMaps,
  selectedServices,
  setSelectedServices,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  handleModal: () => void;
  seatMaps: SeatMap[];
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
}) {
  const [index, setIndex] = useState(0);
  const segments = getSegmentList(offer);
  const nbTabs = segments?.length * passengers?.length ?? 0;
  const totalPrice = '0';
  const totalBags = 0;

  return (
    <View>
      <TabHeader nbTabs={nbTabs} index={index} setIndex={setIndex} />
      <TabView
        key={index}
        index={index}
        offer={offer}
        segments={segments}
        passengers={passengers}
        seatMaps={seatMaps}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
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
  seatMaps,
  selectedServices,
  setSelectedServices,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  index: number;
  segments: OfferSliceSegment[];
  seatMaps: SeatMap[];
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
}) {
  const nbPassengers = passengers?.length;
  const segmentIndex = Math.floor(index / nbPassengers);
  const passengerIndex = index % nbPassengers;
  const segment = segments?.[segmentIndex];
  const passenger = passengers?.[passengerIndex];
  const seatMap = seatMaps?.[segmentIndex];

  const selectSeat = useCallback(
    (element: SeatMapCabinRowSectionElement) => {
      let services = [...selectedServices];
      const elementService = element.available_services?.filter(
        (e) => e.passenger_id === passenger?.id
      )?.[0];
      // const isSelected = services.filter(
      //   (s) =>
      //     s.serviceInformation.type === 'seat' &&
      //     s.serviceInformation.passengerId === passenger.id && 
      //     s.serviceInformation.designator === element.designator
      // )?.[0];

      if (elementService && element.type === 'seat') {
        const currentSelectedSeatIndex = services.findIndex(
          (s) =>
            s.serviceInformation.type === 'seat' &&
            s.serviceInformation.passengerId === passenger?.id &&
            s.serviceInformation.segmentId === segment?.id
        );
        if (currentSelectedSeatIndex > -1) {
          services.splice(currentSelectedSeatIndex, 1);
        }
        services.push({
          id: elementService.id,
          quantity: 1,
          serviceInformation: {
            type: element.type,
            segmentId: segment?.id ?? '',
            passengerId: passenger?.id ?? '',
            passengerName: `${passenger?.given_name} ${passenger?.family_name}`,
            designator: element.designator,
            disclosures: element.disclosures,
            total_amount: elementService.total_amount,
            total_currency: elementService.total_currency,
          },
        });
        setSelectedServices(services);
      }
    },
    [selectedServices, setSelectedServices, passenger, segment]
  );

  const isSeatSelected = useCallback(
    (element: SeatMapCabinRowSectionElement) => {
      return selectedServices.filter(
        (s) =>
          s.serviceInformation.type === 'seat' &&
          s.serviceInformation.designator === element.designator
      )?.[0];
    },
    [selectedServices]
  );

  if (!segment || !passenger || !seatMap) {
    return <View />;
  }

  return (
    <SegmentSeatSelection
      key={segment.id}
      offer={offer}
      segment={segment}
      seatMap={seatMap}
      passenger={passenger}
      selectSeat={selectSeat}
      isSeatSelected={isSeatSelected}
      t={t}
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
  passenger,
  t,
  seatMap,
  selectSeat,
  isSeatSelected,
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passenger: Passenger;
  t: any;
  seatMap: SeatMap;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService> | undefined;
}) {
  const title = `${t('flightFrom')} ${segment.origin.iata_code} ${t('to')} ${
    segment.destination.iata_code
  }`;
  return (
    <View style={styles.SeatSelectionView}>
      <Text style={styles.sliceTitle}>{title}</Text>
      <Text
        style={styles.passengerName}
      >{`${passenger.given_name} ${passenger.family_name}`}</Text>
      <SeatMapView
        segment={segment}
        passenger={passenger}
        offer={offer}
        t={t}
        seatMap={seatMap}
        selectSeat={selectSeat}
        isSeatSelected={isSeatSelected}
      />
    </View>
  );
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  SeatSelectionView: {
    height: '80%',
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
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
    padding: MODAL_PADDING,
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
    marginBottom: 5,
  },
});
