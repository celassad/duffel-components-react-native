import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../../colors';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';

export default function SeatElementUnavailable({ width }: { width: number }) {
  return (
    <View
      style={[
        {
          width: width,
          height: width,
        },
        styles.UnavailableSeatStyle,
      ]}
    >
      <Icon name="close" size={12} color={colors.UNAVAILABLE_SEAT_CONTENT} />
    </View>
  );
}

const styles = StyleSheet.create({
  UnavailableSeatStyle: {
    backgroundColor: colors.SEAT_BACKGROUND,
    margin: MARGIN,
    borderColor: colors.UNAVAILABLE_SEAT_OUTLINE,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
    justifyContent: 'center',
  },
});
