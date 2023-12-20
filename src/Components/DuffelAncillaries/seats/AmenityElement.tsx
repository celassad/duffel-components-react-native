import React from 'react';
import { StyleSheet, View } from 'react-native';
import { parseAmenity, SeatAmenityIcon } from '../../CommonComponents/Icons';
import { MARGIN } from './helpers';

export default function AmenityElement({
  amenity,
  width,
}: {
  amenity: string;
  width: number;
}) {
  const name = parseAmenity(amenity.split('_')[0] as string);
  if (!name) {
    console.log('Amenity Icon not found for : ', amenity);
    return <View />;
  }
  return (
    <View
      style={[
        {
          width: width,
          height: width,
        },
        styles.ViewStyle,
      ]}
    >
      <SeatAmenityIcon amenity={name} size={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  ViewStyle: {
    margin: MARGIN,
    justifyContent: 'center',
  },
});
