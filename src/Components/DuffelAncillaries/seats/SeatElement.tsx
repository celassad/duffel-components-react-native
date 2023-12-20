import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../colors';
import { SeatMapCabinRowSectionElement } from '../../../duffelTypes';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';

export default function SeatElement({
  element,
  width,
}: {
  element: SeatMapCabinRowSectionElement;
  width: number;
}) {
  console.log('seat element', element.type);
  return (
    <View
      style={[
        {
          width: width,
          height: width,
        },
        styles.ViewStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ViewStyle: {
    backgroundColor: colors.SEAT_BACKGROUND,
    margin: MARGIN,
    borderColor: colors.SEAT_OUTLINE,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
  },
});
