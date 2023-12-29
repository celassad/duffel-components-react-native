import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { Offer, Passenger } from '../../../duffelTypes';
import i18n from '../../../translation';
import { SelectedService, WithServiceInformation } from '../types';
import { getSeatsAddedText, hasSeatSelected } from './helpers';
import SeatSelectionModal from './SeatSelectionModal';

type SeatSelectionCardProps = {
  offer: Offer;
  passengers: Passenger[];
  lng: 'en' | 'fr';
  seatMaps: any[] | undefined;
  selectedServices: WithServiceInformation<SelectedService>[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<WithServiceInformation<SelectedService>[]>
  >;
  loading?: boolean;
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

  const subtitle = getSeatsAddedText(props.selectedServices, t);
  const seatSelected = hasSeatSelected(props.selectedServices);
  if (props.loading) {
    return (
      <>
        <View style={styles.container}>
          <Icon
            name={'seat-passenger'}
            type="material-community"
            style={styles.iconStyle}
          />
          <View>
            <Text style={styles.titleStyle}>{t('seatCardTitle')}</Text>
            <Text style={styles.subtitleStyle}>{t('seatCardSubtitle')}</Text>
          </View>
          <View style={styles.loadingView}>
            <ActivityIndicator color="grey" />
          </View>
        </View>
      </>
    );
  }
  if (!props.seatMaps) {
    return (
      <>
        <View style={styles.container}>
          <Icon
            name={'seat-passenger'}
            type="material-community"
            style={styles.iconStyle}
          />
          <View>
            <Text style={styles.titleStyle}>{t('seatCardTitle')}</Text>
            <Text style={styles.subtitleStyle}>{t('seatCardSubtitle')}</Text>
          </View>
          <View style={styles.unavailableView}>
            <Text style={styles.unavailableText}>{t('unavailable')}</Text>
          </View>
        </View>
      </>
    );
  }
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={showModal}>
        <Icon
          name={seatSelected ? 'check-circle' : 'seat-passenger'}
          type="material-community"
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
        seatMaps={props.seatMaps}
        t={t}
        selectedServices={props.selectedServices}
        setSelectedServices={props.setSelectedServices}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    position: 'absolute',
    right: 15,
    alignSelf: 'center',
  },
  unavailableText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  unavailableView: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'lightgrey',
    borderRadius: 6,
    padding: 5,
  },
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
