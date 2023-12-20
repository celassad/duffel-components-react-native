import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../colors';
import { parseAmenity, SeatAmenityIcon } from '../../CommonComponents/Icons';

export default function Legend({ symbols }: { symbols: Set<string> }) {
  return (
    <View style={styles.legendView}>
      {[...symbols].map((s) => {
        return <Amenity symbol={s} />;
      })}
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
    paddingVertical: 12,
  },
});
