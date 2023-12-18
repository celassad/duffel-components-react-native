import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { Service, ServiceMetadata } from '../../../duffelTypes';
import { capitalizeFirstLetter } from '../../tools';
import { SelectedService } from '../types';

function getServiceQuantity(
  service: Service,
  selectedServices: SelectedService[]
) {
  var serviceQuantity = 0;
  selectedServices?.map((s) => {
    if (s.service.id === service.id) {
      serviceQuantity = s.quantity;
    }
  });
  return serviceQuantity;
}

export default function BaggageSelectionController({
  availableService,
  t,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  availableService: Service;
  t: any;
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
}) {
  const serviceName = capitalizeFirstLetter(
    availableService.metadata.type === 'carry_on'
      ? `${t('cabinBag')}`
      : `${t('checkedBag')}`
  );

  const servicePrice = `${availableService.total_amount} ${availableService.total_currency}`;
  const serviceQuantity = getServiceQuantity(
    availableService,
    selectedBaggageServices
  );
  const [quantity, setQuantity] = useState(serviceQuantity);

  function selectService(quantity: number) {
    var selectedServices: SelectedService[] = [];

    selectedBaggageServices.map((selectedService) => {
      if (selectedService.service.id !== availableService.id) {
        selectedServices.push(selectedService);
      }
    });
    if (quantity > 0) {
      const newSelectedService = {
        service: availableService,
        quantity: quantity,
      };
      selectedServices.push(newSelectedService);
    }
    setSelectedBaggageServices(selectedServices);
  }

  const serviceDescription = getBaggageServiceDescription(
    availableService.metadata,
    t
  );

  return (
    <View style={styles.containerStyle}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>{serviceName}</Text>
          <Icon
            name="circle"
            size={5}
            iconStyle={{ padding: 5 }}
            color="lightgrey"
          />
          <Text style={{ fontWeight: 'bold' }}>{servicePrice}</Text>
        </View>
        <Text style={{ color: 'grey', textTransform: 'capitalize' }}>
          {serviceDescription}
        </Text>
      </View>
      <Counter
        selectService={selectService}
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={availableService.maximum_quantity}
      />
    </View>
  );
}

export const getBaggageServiceDescription = (
  metadata: ServiceMetadata,
  t: any
) => {
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
    weightLabel = `${t('upTo')} ${metadata.maximum_weight_kg} kg`;
  }

  return `${weightLabel}${dimensionsLabel}`;
};

function Counter({
  quantity,
  setQuantity,
  maxQuantity,
  selectService,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  maxQuantity: number;
  selectService: (quantity: number) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon
        name="remove"
        size={14}
        iconStyle={{ padding: 5 }}
        containerStyle={{
          borderWidth: 1,
          borderColor: 'lightgrey',
          borderRadius: 5,
        }}
        onPress={() => {
          if (quantity >= 0) {
            selectService(quantity - 1);
            setQuantity(quantity - 1);
          }
        }}
      />

      <Text style={{ paddingHorizontal: 10 }}>{quantity}</Text>

      <Icon
        name="add"
        size={14}
        iconStyle={{ padding: 5 }}
        containerStyle={{
          borderWidth: 1,
          borderColor: 'lightgrey',
          borderRadius: 5,
        }}
        onPress={() => {
          if (quantity < maxQuantity) {
            selectService(quantity + 1);
            setQuantity(quantity + 1);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 10,
  },
});
