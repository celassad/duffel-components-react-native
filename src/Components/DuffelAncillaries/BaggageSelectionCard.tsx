import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-elements';

const TITLE = 'Extra baggage';
const SUBTITLE = 'Add any extra baggage you need for your trip';

export default function BaggageSelectionCard() {
  const [visible, setVisible] = useState(false);

  function handleModal() {
    setVisible(!visible);
  }
  function showModal() {
    setVisible(true);
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={showModal}>
        <Icon name="luggage" style={styles.iconStyle} />
        <View>
          <Text style={styles.titleStyle}>{TITLE}</Text>
          <Text style={styles.subtitleStyle}>{SUBTITLE}</Text>
        </View>
      </TouchableOpacity>
      <BaggageSelectionModal handleModal={handleModal} visible={visible} />
    </>
  );
}

function BaggageSelectionModal({
  handleModal,
  visible,
}: {
  handleModal: () => void;
  visible: boolean;
}) {
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
                style={{ height: 350, paddingBottom: 10 }}
                keyboardShouldPersistTaps="always"
              >
                <BaggageSelectionView />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function BaggageSelectionView() {
  return <Text>test</Text>;
}

const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  subtitleStyle: {
    color: 'grey',
  },
  titleStyle: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  iconStyle: {
    paddingHorizontal: 10,
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    flexDirection: 'row',
    margin: 10,
    borderColor: '#E2E2E8',
  },
  overlayStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    padding: 30,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
});
