import React from 'react';
import { Dimensions, StyleSheet, View, ViewProps } from 'react-native';
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
import Element from './Element';
import {
  getCabinsForSegmentAndDeck,
  getRowNumber,
  getSymbols,
} from './helpers';
import Legend from './Legend';

const windowWidth = Dimensions.get('window').width;
const MODAL_PADDING = 30;

export default function SeatMapView({
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
  //   const hasMultipleDecks = cabins.length !== seatMap.cabins.length;
  //   const anyHasWings = seatMap.cabins.some((cabin) => cabin.wings);

  if (!cabins || !cabins.length) {
    return <SeatMapUnavailable />;
  }
  const symbols = getSymbols(cabins);
  console.log(offer.id, passenger.id, t('Welcome'), segment.id);
  return (
    <View style={{ width: '100%' }}>
      <Legend symbols={symbols} />
      {cabins.map((cabin: SeatMapCabin) => {
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
      {cabin.rows.map((row: SeatMapCabinRow) => {
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
      {row.sections.map((section: SeatMapCabinRowSection) => {
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
  //   const isOneSectionRow = rowLength === 1;
  console.log(rowNumber, rowLength);
  return (
    <View style={styles.rowSectionView}>
      {section.elements.map((element: SeatMapCabinRowSectionElement) => {
        return <Element element={element} width={width / maxNbElements} />;
      })}
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

const styles = StyleSheet.create({
  rowSectionView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
});
