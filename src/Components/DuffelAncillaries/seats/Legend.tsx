import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../colors';
import { parseAmenity, SeatAmenityIcon } from '../../CommonComponents/Icons';
import AvailableSeat from './AvailableSeat';
import SeatElementUnavailable from './SeatElementUnavailable';

export default function Legend({ symbols }: { symbols: Set<string> }) {
  return (
    <View style={styles.legendView}>
      <SeatLegend />
      {[...symbols].map((s) => {
        return <Amenity key={s} symbol={s} />;
      })}
    </View>
  );
}

function SeatLegend() {
  return (
    <View style={styles.SeatLegend}>
      <View style={styles.SeatView}>
        <AvailableSeat
          width={20}
          seatLabel={''}
          isFeePayable={true}
          selected={false}
        />
        <Text style={styles.seatText}>Additional cost</Text>
      </View>

      <View style={styles.SeatView}>
        <AvailableSeat
          width={20}
          seatLabel={''}
          isFeePayable={false}
          selected={false}
        />
        <Text style={styles.seatText}>Included</Text>
      </View>

      <View style={styles.SeatView}>
        <AvailableSeat
          width={20}
          seatLabel={''}
          isFeePayable={false}
          selected={true}
        />
        <Text style={styles.seatText}>Selected</Text>
      </View>

      <View style={styles.SeatView}>
        <SeatElementUnavailable width={20} />
        <Text style={styles.seatText}>Unavailable</Text>
      </View>
    </View>
  );
}

function Amenity({ symbol }: { symbol: string }) {
  const name = parseAmenity(symbol.split('_')[0] as string);
  if (!name) {
    console.log('Amenity Icon not found for : ', symbol);
    return <View />;
  }
  return (
    <>
      <View style={styles.AmenityView}>
        <SeatAmenityIcon amenity={name} style={{ padding: 6 }} />
        <Text style={{ color: colors.AMENITY_COLOR }}>{name}</Text>
      </View>
      <View style={styles.space} />
    </>
  );
}

const styles = StyleSheet.create({
  SeatLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatText: {
    color: colors.AMENITY_COLOR,
    paddingLeft: 2,
  },
  space: {
    width: 8,
  },
  AmenityView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  SeatView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
});
