import { colors } from 'duffel-components-react-native/src/colors';
import { SeatAmenityIcon } from 'duffel-components-react-native/src/Components/CommonComponents/Icons';
import {
  getCabinsForSegmentAndDeck,
  getRowNumber,
  getSymbols,
} from 'duffel-components-react-native/src/Components/DuffelAncillaries/seats/helpers';
import Legend from 'duffel-components-react-native/src/Components/DuffelAncillaries/seats/Legend';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { Text } from 'react-native-elements';
import {
  Offer,
  OfferSliceSegment,
  Passenger,
  SeatMap,
  SeatMapCabin,
  SeatMapCabinRow,
  SeatMapCabinRowSection,
  SeatMapCabinRowSectionElement,
} from '../../../duffelTypes';
import TabFooter from '../../CommonComponents/TabFooter';
import TabHeader from '../../CommonComponents/TabHeader';
import { capitalizeFirstLetter, getSegmentList, withPlural } from '../../tools';

const windowWidth = Dimensions.get('window').width;
const MODAL_PADDING = 30;

export default function SeatSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
  t,
  seatMaps,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
  t: any;
  seatMaps: SeatMap[];
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
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  handleModal: () => void;
  seatMaps: SeatMap[];
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
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
  index: number;
  segments: OfferSliceSegment[];
  seatMaps: SeatMap[];
}) {
  const nbPassengers = passengers?.length;
  const segmentIndex = Math.floor(index / nbPassengers);
  const passengerIndex = index % nbPassengers;
  const segment = segments?.[segmentIndex];
  const passenger = passengers?.[passengerIndex];
  if (!segment || !passenger) {
    return <View />;
  }
  return (
    <ScrollView style={{ maxHeight: '80%' }}>
      <TouchableOpacity activeOpacity={1}>
        <SegmentSeatSelection
          key={segment.id}
          offer={offer}
          segment={segment}
          seatMap={seatMaps?.[segmentIndex]}
          passenger={passenger}
          t={t}
        />
      </TouchableOpacity>
    </ScrollView>
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
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passenger: Passenger;
  t: any;
  seatMap: SeatMap;
}) {
  const title = `${t('flightFrom')} ${segment.origin.iata_code} ${t('to')} ${
    segment.destination.iata_code
  }`;
  return (
    <View>
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
      />
    </View>
  );
}

function SeatMapView({
  offer,
  segment,
  passenger,
  t,
  seatMap,
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passenger: Passenger;
  t: any;
  seatMap: SeatMap;
}) {
  const [selectedDeck, setSelectedDeck] = React.useState(0);
  if (!seatMap || !seatMap.cabins || !seatMap.cabins.length)
    return <SeatMapUnavailable />;

  const cabins = getCabinsForSegmentAndDeck(selectedDeck, seatMap);
  const hasMultipleDecks = cabins.length !== seatMap.cabins.length;
  const anyHasWings = seatMap.cabins.some((cabin) => cabin.wings);

  if (!cabins || !cabins.length) {
    return <SeatMapUnavailable />;
  }
  const symbols = getSymbols(cabins);
  return (
    <View style={{ width: '100%' }}>
      <Legend symbols={symbols} />
      {cabins.map((cabin, index) => {
        return <Cabin cabin={cabin} />;
      })}
    </View>
  );
}

function Cabin({ cabin }: { cabin: SeatMapCabin }) {
  const cabinWidth = windowWidth - MODAL_PADDING * 2;
  const maxNbElements = getMaxElements(cabin.rows);
  return (
    <View>
      {cabin.rows.map((row, index) => {
        return (
          <Row row={row} width={cabinWidth} maxNbElements={maxNbElements} />
        );
      })}
    </View>
  );
}

const AISLE_SPACE = 0;

function Row({
  row,
  width,
  maxNbElements,
}: {
  row: SeatMapCabinRow;
  width: number;
  maxNbElements: number;
}) {
  const rowNumber = getRowNumber(row);
  const rowLength = Object.keys(row.sections).length;
  const totalAisleSpace = AISLE_SPACE * rowLength;
  return (
    <ViewWithGap style={{ flexDirection: 'row' }}>
      {row.sections.map((section, index) => {
        return (
          <RowSection
            section={section}
            rowNumber={rowNumber}
            rowLength={rowLength}
            width={(width - totalAisleSpace) / rowLength}
            maxNbElements={maxNbElements}
          />
        );
      })}
    </ViewWithGap>
  );
}

function getMaxElements(rows: SeatMapCabinRow[]) {
  let nbElements = 0;
  rows.map((r) => {
    r.sections.map((s) => {
      if (s.elements.length > nbElements) nbElements = s.elements.length;
    });
  });
  return nbElements;
}

type ViewWithGapProps = {
  children: JSX.Element[];
  rowGap?: number;
  columnGap?: number;
} & ViewProps;

function ViewWithGap(props: ViewWithGapProps) {
  let newChildren: JSX.Element[] = [];
  props.children.map((child, index) => {
    newChildren.push(child);
    if (index !== props.children.length - 1) {
      newChildren.push(
        <View
          style={{ width: props.rowGap ?? 0, height: props.columnGap ?? 0 }}
        />
      );
    }
  });
  return <View {...props}>{newChildren}</View>;
}

function RowSection({
  section,
  rowNumber,
  rowLength,
  width,
  maxNbElements,
}: {
  section: SeatMapCabinRowSection;
  rowNumber: string | null | undefined;
  rowLength: number;
  width: number;
  maxNbElements: number;
}) {
  const isOneSectionRow = rowLength === 1;
  return (
    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
      {section.elements.map((element, index) => {
        return <Element element={element} width={width / maxNbElements} />;
      })}
    </View>
  );
}

function Element({
  element,
  width,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
}) {
  const totalSize = width - ELEMENT_BORDER_WIDTH * 2 - MARGIN * 2;
  switch (element.type) {
    case 'empty':
      return <EmptyElement width={totalSize} />;
    case 'seat':
      return <SeatElement element={element} width={totalSize} />;
    default:
      return <AmenityElement amenity={element.type} width={totalSize} />;
  }
}

const SIZE = 30;
const MARGIN = 1;
const ELEMENT_BORDER_WIDTH = 1;

function SeatElement({
  element,
  width,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
}) {
  return (
    <View
      style={{
        width: width,
        height: width,
        backgroundColor: colors.SEAT_BACKGROUND,
        margin: MARGIN,
        borderColor: colors.SEAT_OUTLINE,
        borderRadius: 4,
        borderWidth: ELEMENT_BORDER_WIDTH,
      }}
    ></View>
  );
}

function AmenityElement({
  amenity,
  width,
}: {
  amenity: string;
  width: number;
}) {
  const name = amenity.split('_')[0];
  return (
    <View
      style={{
        width: width,
        height: width,
        margin: MARGIN,
        justifyContent: 'center',
      }}
    >
      <SeatAmenityIcon amenity={name} size={6} />
    </View>
  );
}

function EmptyElement({ width }: { width: number }) {
  return <View style={{ width: width, height: width, margin: MARGIN }} />;
}

function SeatMapUnavailable() {
  return (
    <View>
      <Text>SeatMap unavailable</Text>
    </View>
  );
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 20,
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
