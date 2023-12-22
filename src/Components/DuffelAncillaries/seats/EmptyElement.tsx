import React from 'react';
import { View } from 'react-native';
import { MARGIN } from './helpers';

const EmptyElement = React.memo(({ width }: { width: number }) => {
  return <View style={{ width: width, height: width, margin: MARGIN }} />;
});

export default EmptyElement;
