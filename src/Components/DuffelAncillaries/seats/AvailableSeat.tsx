import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { colors } from '../../../colors';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';
import PaidSeatIndicator from './SeatPaidIndicator';

const AvailableSeat = React.memo(
  ({
    width,
    seatLabel,
    isFeePayable,
    selected,
    onPress,
  }: {
    width: number;
    seatLabel: string;
    isFeePayable: boolean;
    selected: boolean;
    onPress: () => void;
  }) => {
    return (
      <TouchableHighlight onPress={onPress}>
        <View
          style={[
            {
              width: width,
              height: width,
            },
            selected ? styles.SelectedSeatStyle : styles.AvailableSeatStyle,
          ]}
        >
          <Text
            style={
              selected ? styles.SelectedSeatText : styles.AvailableSeatText
            }
          >
            {seatLabel}
          </Text>
          {isFeePayable && <PaidSeatIndicator />}
        </View>
      </TouchableHighlight>
    );
  }
);

export default AvailableSeat;

const styles = StyleSheet.create({
  AvailableSeatText: {
    fontSize: 12,
    color: colors.AVAILABLE_SEAT_CONTENT,
  },
  SelectedSeatText: {
    fontSize: 12,
    color: colors.SELECTED_SEAT_CONTENT,
  },
  AvailableSeatStyle: {
    backgroundColor: colors.SEAT_BACKGROUND,
    margin: MARGIN,
    borderColor: colors.AVAILABLE_SEAT_CONTENT,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectedSeatStyle: {
    backgroundColor: colors.SELECTED_SEAT,
    margin: MARGIN,
    borderColor: colors.SELECTED_SEAT,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
