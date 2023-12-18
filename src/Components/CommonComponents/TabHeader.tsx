import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

export default function TabHeader({
  nbTabs,
  index,
  setIndex,
}: {
  nbTabs: number;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  var indicators: JSX.Element[] = [];

  for (let i = 0; i < nbTabs; i++) {
    indicators.push(
      <Indicator index={i} selectedIndex={index} setIndex={setIndex} key={i} />
    );
  }
  return (
    <View style={styles.tabHeaderStyle}>
      <>{indicators}</>
    </View>
  );
}

function Indicator({
  index,
  selectedIndex,
  setIndex,
}: {
  index: number;
  selectedIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const isSelected = index === selectedIndex;
  return (
    <Icon
      name="circle"
      size={10}
      iconStyle={styles.indicatorIconStyle}
      color={isSelected ? 'black' : 'lightgrey'}
      onPress={() => {
        setIndex(index);
      }}
    />
  );
}

const styles = StyleSheet.create({
  indicatorIconStyle: {
    padding: 6,
  },
  tabHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
});
