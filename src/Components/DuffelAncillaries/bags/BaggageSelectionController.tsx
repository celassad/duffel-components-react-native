import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { Service, ServiceMetadata } from '../../../duffelTypes';

export default function BaggageSelectionController({
  availableService,
  passengerId,
  segmentId,
  t,
}: {
  availableService: Service;
  passengerId: string;
  segmentId: string;
  t: any;
}) {
  const serviceName =
    availableService.metadata.type === 'carry_on'
      ? `${t('cabinBag')}`
      : `${t('checkedBag')}`;

  const servicePrice = `${availableService.total_amount} ${availableService.total_currency}`;

  const serviceDescription = getBaggageServiceDescription(
    availableService.metadata
  );
  //   const shouldDisableController =
  //     hasServiceOfSameMetadataTypeAlreadyBeenSelected(
  //       selectedServices,
  //       segmentId,
  //       passengerId,
  //       availableService
  //     );
  return (
    <View style={styles.containerStyle}>
      <View>
        <Text>{serviceName}</Text>
        <Text>{servicePrice}</Text>
        <Text>{serviceDescription}</Text>
        <Text>{passengerId}</Text>
        <Text>{segmentId}</Text>
      </View>
      <Counter />
    </View>
  );
}

export const getBaggageServiceDescription = (metadata: ServiceMetadata) => {
  if (!metadata) {
    return null;
  }

  if (
    !metadata.maximum_weight_kg &&
    !metadata.maximum_length_cm &&
    !metadata.maximum_height_cm &&
    !metadata.maximum_depth_cm
  ) {
    return null;
  }

  const hasAllDimensions =
    metadata.maximum_length_cm &&
    metadata.maximum_height_cm &&
    metadata.maximum_depth_cm;

  let dimensionsLabel = '';
  if (hasAllDimensions) {
    dimensionsLabel = ` / ${metadata.maximum_height_cm} x ${metadata.maximum_length_cm} x ${metadata.maximum_depth_cm} cm`;
  }

  let weightLabel = '';
  if (metadata.maximum_weight_kg) {
    weightLabel = `Up to ${metadata.maximum_weight_kg}kg`;
  }

  return `${weightLabel}${dimensionsLabel}`;
};

function Counter() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Icon name="remove" containerStyle={{ borderWidth: 1 }} />

      <Text style={{ padding: 5 }}>0</Text>
      <Icon name="add" containerStyle={{ borderWidth: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
