import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    isForCurrentPassenger,
  }: {
    width: number;
    seatLabel: string;
    isFeePayable: boolean;
    selected: boolean;
    onPress?: () => void;
    isForCurrentPassenger: boolean;
  }) => {
    const disabled = onPress == null;
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={[
            {
              width: width,
              height: width,
            },
            selected ? styles.SelectedSeatStyle : styles.AvailableSeatStyle,
            selected && isForCurrentPassenger ? styles.currentPassenger : {},
          ]}
        >
          <Text
            style={
              selected ? styles.SelectedSeatText : styles.AvailableSeatText
            }
          >
            {seatLabel}
          </Text>
          {isFeePayable && !selected && <PaidSeatIndicator />}
        </View>
      </TouchableOpacity>
    );
  }
);

export default AvailableSeat;

const styles = StyleSheet.create({
  currentPassenger: {
    backgroundColor: colors.CURRENT_PASSENGER_SEAT,
    borderColor: colors.CURRENT_PASSENGER_SEAT,
  },
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
