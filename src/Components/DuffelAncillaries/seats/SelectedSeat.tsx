import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../colors';
import { SelectedService, WithServiceInformation } from '../types';

export default function SelectedSeat({
  seat,
}: {
  seat: WithServiceInformation<SelectedService>;
}) {
  const seatDesignator = `${seat.serviceInformation.designator}`;
  const price = `${seat.serviceInformation.total_amount} ${seat.serviceInformation.total_currency}`;
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.seat}>{seatDesignator}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  price: {
    color: 'white',
  },
  seat: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  viewStyle: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: colors.CURRENT_PASSENGER_SEAT,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
