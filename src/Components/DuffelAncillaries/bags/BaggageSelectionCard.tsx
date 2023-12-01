import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { Offer, Passenger, SelectedService } from '../../../duffelTypes';
import i18n from '../../../translation/index';
import BaggageSelectionModal from './BaggageSelectionModal';
import { getBagsAddedText, hasBagSelected } from './helpers';

export default function BaggageSelectionCard({
  offer,
  passengers,
  lng,
  selectedBaggageServices,
  setSelectedBaggageServices,
}: {
  offer: Offer;
  passengers: Passenger[];
  lng: 'en' | 'fr';
  selectedBaggageServices: SelectedService[];
  setSelectedBaggageServices: React.Dispatch<
    React.SetStateAction<SelectedService[]>
  >;
}) {
  const t = i18n.getFixedT(lng);

  const [visible, setVisible] = useState(false);

  function handleModal() {
    setVisible(!visible);
  }
  function showModal() {
    setVisible(true);
  }

  const subtitle = getBagsAddedText(selectedBaggageServices, t);
  const bagSelected = useMemo(
    () => hasBagSelected(selectedBaggageServices),
    [selectedBaggageServices]
  );
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={showModal}>
        <Icon
          name={bagSelected ? 'check-circle' : 'luggage'}
          style={styles.iconStyle}
        />
        <View>
          <Text style={styles.titleStyle}>{t('baggageCardTitle')}</Text>
          <Text style={styles.subtitleStyle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
      <BaggageSelectionModal
        offer={offer}
        passengers={passengers}
        handleModal={handleModal}
        visible={visible}
        selectedBaggageServices={selectedBaggageServices}
        setSelectedBaggageServices={setSelectedBaggageServices}
        t={t}
      />
    </>
  );
}

const styles = StyleSheet.create({
  subtitleStyle: {
    color: 'grey',
  },
  titleStyle: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  iconStyle: {
    paddingRight: 10,
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    flexDirection: 'row',
    borderColor: '#E2E2E8',
  },
});
