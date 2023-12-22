import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SeatAmenityIcon } from '../../CommonComponents/Icons';

export default function ExitElement({
  sectionIndex,
  style,
}: {
  sectionIndex: number;
  style: StyleProp<ViewStyle>;
}) {
  const isFirstSection = sectionIndex === 0;

  const exitStyle: ViewStyle = isFirstSection
    ? { alignItems: 'flex-start' }
    : { alignItems: 'flex-end' };
  const iconName = isFirstSection ? 'arrow-back' : 'arrow-forward';
  return (
    <View style={[style, exitStyle]}>
      <SeatAmenityIcon amenity={'exit'} size={12} name={iconName} />
    </View>
  );
}
