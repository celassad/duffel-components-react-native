import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { Offer, Passenger } from '../../../duffelTypes';

export default function SeatSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
  t,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
  t: any;
}) {
  console.log(passengers?.length, offer.id, t('Welcome'));
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        handleModal();
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleModal}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback style={{ flex: 1 }}>
            <View style={styles.overlayStyle}>
              <ScrollView
                style={{ paddingBottom: 10 }}
                keyboardShouldPersistTaps="always"
              >
                <Text>test</Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 14,
  },
  totalPriceViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonTitleStyle: {
    textTransform: 'capitalize',
    color: 'black',
  },
  secondaryButtonStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  primaryButtonTitleStyle: {
    textTransform: 'capitalize',
    color: 'white',
  },
  primaryButtonStyle: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  buttonContainerStyle: {
    flex: 1,
    margin: 5,
  },
  buttonTitle: {
    textTransform: 'capitalize',
  },
  overlayStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    padding: 30,
    maxHeight: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sliceTitle: {
    fontWeight: 'bold',
    color: 'hsl(203, 14%, 23%)',
    fontSize: 18,
    marginBottom: 20,
  },
});
