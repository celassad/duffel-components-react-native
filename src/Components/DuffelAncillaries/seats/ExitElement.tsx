import { colors } from 'duffel-components-react-native/src/colors';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SeatAmenityIcon } from '../../CommonComponents/Icons';
import { ELEMENT_BORDER_WIDTH, MARGIN } from './helpers';

export default function ExitElement({
  elementIndex,
  sectionIndex,
  style
}: {
    elementIndex: number;
    sectionIndex: number;
    style: StyleProp<ViewStyle>
}) {

    const isFirstSection = sectionIndex === 0;

    const exitStyle : ViewStyle = isFirstSection ? {alignItems:'flex-start'} : {alignItems:'flex-end'}
    const iconName = isFirstSection ? 'arrow-back' : 'arrow-forward'
    return (
        <View
            style={[style, exitStyle]}
        >
            <SeatAmenityIcon amenity={'exit'} size={12} name={iconName} />
        </View>
    );
}

const styles = StyleSheet.create({
  ViewStyle: {
    justifyContent: 'center',
    margin: MARGIN,
  },
  viewWithBorderStyle:{
    borderColor: colors.AMENITY_OUTLINE,
    borderRadius: 4,
    borderWidth: ELEMENT_BORDER_WIDTH,
    backgroundColor: colors.AMENITY_BACKGROUND,
  }
});
