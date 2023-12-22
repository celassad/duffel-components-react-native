import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../../colors';
import { parseAmenity, SeatAmenityIcon } from '../../CommonComponents/Icons';
import ExitElement from './ExitElement';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';

const ADDITIONAL_AMENITY_HEIGHT = 10;

const AmenityElement = React.memo(
  ({
    amenity,
    width,
    isUnique,
    sectionIndex,
  }: {
    amenity: string;
    width: number;
    isUnique: boolean;
    sectionIndex: number;
  }) => {
    const name = parseAmenity(amenity.split('_')[0] as string);
    if (!name) {
      console.log('Amenity Icon not found for : ', amenity);
      return <View />;
    }
    const totalWidth = width + MARGIN * 2;
    const uniqueWidth = totalWidth * 3 - MARGIN * 2;
    const withBorder = name === 'galley' || name === 'lavatory';
    const borderStyle = withBorder ? styles.viewWithBorderStyle : {};
    const uniqueStyle = isUnique
      ? { width: uniqueWidth, height: width + ADDITIONAL_AMENITY_HEIGHT }
      : {};
    const viewStyle: StyleProp<ViewStyle> = [
      {
        width: width,
        height: width,
      },
      styles.ViewStyle,
      borderStyle,
      uniqueStyle,
    ];
    if (name === 'exit') {
      return <ExitElement style={viewStyle} sectionIndex={sectionIndex} />;
    }

    return (
      <View style={viewStyle}>
        <SeatAmenityIcon amenity={name} size={12} />
      </View>
    );
  }
);

export default AmenityElement;

const styles = StyleSheet.create({
  ViewStyle: {
    justifyContent: 'center',
    margin: MARGIN,
  },
  viewWithBorderStyle: {
    borderColor: colors.AMENITY_OUTLINE,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
    backgroundColor: colors.AMENITY_BACKGROUND,
  },
});
