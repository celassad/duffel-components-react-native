import React from 'react';
import { View } from 'react-native';
import { MARGIN } from './helpers';

export default function EmptyElement({ width }: { width: number }) {
  return <View style={{ width: width, height: width, margin: MARGIN }} />;
}
