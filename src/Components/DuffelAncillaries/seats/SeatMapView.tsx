import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
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
import { SelectedService, WithServiceInformation } from '../types';
import Element from './Element';
import {
  getCabinsForSegmentAndDeck,
  getRowNumber,
  getSymbols,
} from './helpers';
import Legend from './Legend';

const windowWidth = Dimensions.get('window').width;
const MODAL_PADDING = 30;

const SeatMapView = ({
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
  ) => WithServiceInformation<SelectedService>;
}) => {
  console.log(offer.id, segment.id, t('Welcome'));

  const cabins = useMemo(
    () => getCabinsForSegmentAndDeck(0, seatMap),
    [seatMap]
  );
  const symbols = useMemo(() => getSymbols(cabins), [cabins]);

  if (!seatMap || !seatMap.cabins || !seatMap.cabins.length)
    return <SeatMapUnavailable />;

  if (!cabins || !cabins.length) {
    return <SeatMapUnavailable />;
  }

  return (
    <View style={{ width: '100%', marginVertical: 30, flex: 1 }}>
      <Legend symbols={symbols} />
      {cabins.map((cabin: SeatMapCabin) => {
        return (
          <Cabin
            cabin={cabin}
            selectSeat={selectSeat}
            isSeatSelected={isSeatSelected}
            currentPassengerId={passenger.id}
          />
        );
      })}
    </View>
  );
};

function Cabin({
  cabin,
  currentPassengerId,
  selectSeat,
  isSeatSelected,
}: {
  cabin: SeatMapCabin;
  currentPassengerId: string;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService>;
}) {
  const cabinWidth = windowWidth - MODAL_PADDING * 2;
  const maxNbElements = useMemo(() => getMaxElements(cabin.rows), [cabin.rows]);

  const renderItem = ({
    item,
    index,
  }: {
    item: SeatMapCabinRow;
    index: number;
  }) => {
    return (
      <TouchableOpacity activeOpacity={1}>
        <Row
          key={`Row_${index}`}
          row={item}
          currentPassengerId={currentPassengerId}
          width={cabinWidth}
          maxNbElements={maxNbElements}
          selectSeat={selectSeat}
          isSeatSelected={isSeatSelected}
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={cabin.rows}
      renderItem={renderItem}
      // initialNumToRender={1}
    />
  );
}

const AISLE_SPACE = 4;

function Row({
  row,
  width,
  maxNbElements,
  currentPassengerId,
  selectSeat,
  isSeatSelected,
}: {
  row: SeatMapCabinRow;
  width: number;
  maxNbElements: number;
  currentPassengerId: string;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService>;
}) {
  const rowNumber = useMemo(() => getRowNumber(row), [row]);
  const rowLength = useMemo(() => Object.keys(row.sections).length, [row]);
  const totalAisleSpace = AISLE_SPACE * rowLength;

  return (
    <View style={{ flexDirection: 'row' }}>
      {row.sections.map((section: SeatMapCabinRowSection, index: number) => {
        return (
          <RowSection
            key={`Section_${rowNumber}_${index}`}
            section={section}
            currentPassengerId={currentPassengerId}
            sectionIndex={index}
            width={(width - totalAisleSpace) / rowLength}
            maxNbElements={maxNbElements}
            selectSeat={selectSeat}
            isSeatSelected={isSeatSelected}
          />
        );
      })}
    </View>
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

function RowSection({
  section,
  sectionIndex,
  currentPassengerId,
  width,
  maxNbElements,
  selectSeat,
  isSeatSelected,
}: {
  section: SeatMapCabinRowSection;
  sectionIndex: number;
  currentPassengerId: string;
  width: number;
  maxNbElements: number;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  isSeatSelected: (
    element: SeatMapCabinRowSectionElement
  ) => WithServiceInformation<SelectedService>;
}) {
  const hasOneElement = useMemo(
    () => section.elements?.length === 1,
    [section.elements?.length]
  );
  const elementWidth = useMemo(
    () => width / maxNbElements,
    [maxNbElements, width]
  );
  return (
    <View style={styles.rowSectionView}>
      {section.elements.map(
        (element: SeatMapCabinRowSectionElement, index: number) => {
          return (
            <Element
              key={`Element_${sectionIndex}_${index}`}
              currentPassengerId={currentPassengerId}
              sectionIndex={sectionIndex}
              elementIndex={index}
              element={element}
              width={elementWidth}
              isUnique={hasOneElement}
              selectSeat={selectSeat}
              isSeatSelected={isSeatSelected}
            />
          );
        }
      )}
      {/* <View style={{width:30, height:30, backgroundColor:'red'}}/> */}
    </View>
  );
}

function SeatMapUnavailable() {
  return (
    <View>
      <Text>SeatMap unavailable</Text>
    </View>
  );
}

export default SeatMapView;

const styles = StyleSheet.create({
  rowSectionView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
});
