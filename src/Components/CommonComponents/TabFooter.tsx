import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

export default function TabFooter({
  index,
  setIndex,
  t,
  handleModal,
  nbTabs,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
  handleModal: () => void;
  nbTabs: number;
}) {
  const isLastIndex = useMemo(() => {
    return index === nbTabs - 1;
  }, [index, nbTabs]);

  if (index === 0) {
    return (
      <View style={styles.viewStyle}>
        <View style={styles.buttonContainerStyle} />
        <NextButton t={t} index={index} setIndex={setIndex} />
      </View>
    );
  } else if (isLastIndex) {
    return (
      <View style={styles.viewStyle}>
        <BackButton t={t} index={index} setIndex={setIndex} />
        <ConfirmButton t={t} onPress={handleModal} />
      </View>
    );
  } else {
    return (
      <View style={styles.viewStyle}>
        <BackButton t={t} index={index} setIndex={setIndex} />
        <NextButton t={t} index={index} setIndex={setIndex} />
      </View>
    );
  }
}

function BackButton({
  index,
  setIndex,
  t,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
}) {
  return (
    <Button
      title={t('back')}
      onPress={() => {
        setIndex(index - 1);
      }}
      titleStyle={styles.secondaryButtonTitleStyle}
      buttonStyle={styles.secondaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
  );
}

function NextButton({
  index,
  setIndex,
  t,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  t: any;
}) {
  return (
    <Button
      title={t('next')}
      onPress={() => {
        setIndex(index + 1);
      }}
      titleStyle={styles.primaryButtonTitleStyle}
      buttonStyle={styles.primaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
  );
}

function ConfirmButton({ onPress, t }: { onPress: () => void; t: any }) {
  return (
    <Button
      title={t('confirm')}
      onPress={onPress}
      titleStyle={styles.primaryButtonTitleStyle}
      buttonStyle={styles.primaryButtonStyle}
      containerStyle={styles.buttonContainerStyle}
    />
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
