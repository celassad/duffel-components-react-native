import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function PaidSeatIndicator() {
  return (
    <View style={styles.ViewStyle}>
      <View style={styles.Indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  Indicator: {
    width: 6,
    height: 6,
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 1,
  },
  ViewStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
