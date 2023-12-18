import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Offer, Passenger } from '../../../duffelTypes';
import i18n from '../../../translation';
import SeatSelectionModal from './SeatSelectionModal';

type SeatSelectionCardProps = {
  offer: Offer;
  passengers: Passenger[];
  lng: 'en' | 'fr';
  seatMaps: any[] | undefined;
};

export default function SeatSelectionCard(props: SeatSelectionCardProps) {
  const t = i18n.getFixedT(props.lng);

  const [visible, setVisible] = useState(false);

  function handleModal() {
    setVisible(!visible);
  }
  function showModal() {
    setVisible(true);
  }

  const subtitle = t('seatCardSubtitle');
  const seatSelected = false;
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={showModal}>
        <Icon
          name={seatSelected ? 'check-circle' : 'luggage'}
          style={styles.iconStyle}
        />
        <View>
          <Text style={styles.titleStyle}>{t('seatCardTitle')}</Text>
          <Text style={styles.subtitleStyle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
      <SeatSelectionModal
        offer={props.offer}
        passengers={props.passengers}
        handleModal={handleModal}
        visible={visible}
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
