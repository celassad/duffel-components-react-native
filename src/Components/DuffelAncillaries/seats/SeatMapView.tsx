import React, { useCallback, useMemo } from 'react';
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
  selectedServices,
  setSelectedServices,
}: {
  offer: Offer;
  segment: OfferSliceSegment;
  passenger: Passenger;
  t: any;
  seatMap: SeatMap;
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
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
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            currentPassenger={passenger}
            currentSegmentId={segment.id}
          />
        );
      })}
    </View>
  );
};

function Cabin({
  cabin,
  selectedServices,
  setSelectedServices,
  currentSegmentId,
  currentPassenger,
}: {
  cabin: SeatMapCabin;
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
  currentSegmentId: string;
  currentPassenger: Passenger;
}) {
  const cabinWidth = windowWidth - MODAL_PADDING * 2;
  const maxNbElements = useMemo(() => getMaxElements(cabin.rows), [cabin.rows]);

  const selectSeat = useCallback(
    (element: SeatMapCabinRowSectionElement) => {
      const elementService = element.available_services?.filter(
        (e) => e.passenger_id === currentPassenger.id
      )?.[0];
      setSelectedServices((prevServices) => {
        let services = [...prevServices];
        if (elementService && element.type === 'seat') {
          const currentSelectedSeatIndex = services.findIndex(
            (s) =>
              s.serviceInformation.type === 'seat' &&
              s.serviceInformation.passengerId === currentPassenger.id &&
              s.serviceInformation.segmentId === currentSegmentId
          );
          if (currentSelectedSeatIndex > -1) {
            services.splice(currentSelectedSeatIndex, 1);
          }
          services.push({
            id: elementService.id,
            quantity: 1,
            serviceInformation: {
              type: element.type,
              segmentId: currentSegmentId ?? '',
              passengerId: currentPassenger.id ?? '',
              passengerName:
                `${currentPassenger.given_name} ${currentPassenger.family_name}` ??
                '',
              designator: element.designator,
              disclosures: element.disclosures,
              total_amount: elementService.total_amount,
              total_currency: elementService.total_currency,
            },
          });
        }
        return services;
      });
    },
    [currentPassenger, currentSegmentId]
  );

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
          currentPassenger={currentPassenger}
          currentSegmentId={currentSegmentId}
          width={cabinWidth}
          maxNbElements={maxNbElements}
          selectedServices={selectedServices}
          selectSeat={selectSeat}
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
  currentPassenger,
  selectSeat,
  selectedServices,
  currentSegmentId,
}: {
  row: SeatMapCabinRow;
  width: number;
  maxNbElements: number;
  currentPassenger: Passenger;
  selectSeat: (element: SeatMapCabinRowSectionElement) => void;
  selectedServices: WithServiceInformation<SelectedService>[];
  currentSegmentId: string;
}) {
  const rowNumber = useMemo(() => getRowNumber(row), [row]);
  const rowLength = useMemo(() => Object.keys(row.sections).length, [row]);
  const totalAisleSpace = AISLE_SPACE * rowLength;

  const rowDesignator = row?.sections?.[0]?.elements?.[0]?.designator?.slice(
    0,
    -1
  );
  const rowSelectedServices = useMemo(() => {
    return selectedServices.filter(
      (s) => s.serviceInformation.designator?.slice(0, -1) === rowDesignator
    );
  }, [rowDesignator, selectedServices]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {row.sections.map((section: SeatMapCabinRowSection, index: number) => {
        return (
          <RowSection
            key={`Section_${rowNumber}_${index}`}
            section={section}
            currentPassenger={currentPassenger}
            currentSegmentId={currentSegmentId}
            sectionIndex={index}
            width={(width - totalAisleSpace) / rowLength}
            maxNbElements={maxNbElements}
            selectSeat={selectSeat}
            selectedServices={rowSelectedServices}
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

const RowSection = React.memo(
  ({
    section,
    sectionIndex,
    currentPassenger,
    width,
    maxNbElements,
    selectSeat,
    selectedServices,
    currentSegmentId,
  }: {
    section: SeatMapCabinRowSection;
    sectionIndex: number;
    currentPassenger: Passenger;
    width: number;
    maxNbElements: number;
    selectSeat: (element: SeatMapCabinRowSectionElement) => void;
    selectedServices: WithServiceInformation<SelectedService>[];
    currentSegmentId: string;
  }) => {
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
            const isSelected = selectedServices.filter(
              (s) =>
                s.serviceInformation.designator === element.designator &&
                s.serviceInformation.segmentId === currentSegmentId
            )?.[0];
            return (
              <Element
                key={`Element_${sectionIndex}_${index}`}
                currentPassenger={currentPassenger}
                sectionIndex={sectionIndex}
                elementIndex={index}
                element={element}
                width={elementWidth}
                isUnique={hasOneElement}
                selectSeat={selectSeat}
                isSelected={isSelected}
              />
            );
          }
        )}
      </View>
    );
  }
);

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
