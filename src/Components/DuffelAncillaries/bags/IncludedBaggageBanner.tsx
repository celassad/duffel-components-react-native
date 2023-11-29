import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { OfferSliceSegmentPassengerBaggage } from '../../../duffelTypes';
import { withPlural } from './helpers';

export default function IncludedBaggageBanner({
  includedBaggage,
  t,
}: {
  includedBaggage: OfferSliceSegmentPassengerBaggage[];
  t: any;
}) {
  const { carryOnBagsQuantity, checkedBagsQuantity } = includedBaggage.reduce(
    (sum, { type, quantity }) => ({
      carryOnBagsQuantity:
        sum.carryOnBagsQuantity + (type === 'carry_on' ? quantity : 0),
      checkedBagsQuantity:
        sum.checkedBagsQuantity + (type === 'checked' ? quantity : 0),
    }),
    {
      carryOnBagsQuantity: 0,
      checkedBagsQuantity: 0,
    }
  );

  const baggageLabelStringArray = [];
  if (carryOnBagsQuantity > 0) {
    baggageLabelStringArray.push(
      withPlural(carryOnBagsQuantity, t('cabinBag'), t('cabinBags'))
    );
  }
  if (checkedBagsQuantity > 0) {
    baggageLabelStringArray.push(
      withPlural(checkedBagsQuantity, t('checkedBag'), t('checkedBags'))
    );
  }
  return (
    <View style={styles.includedBagBannerView}>
      <Text style={styles.includedBagText}>
        {`${baggageLabelStringArray.join(` ${t('and')} `)} ${t('included')}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  includedBagText: {
    color: '#064E3B',
  },
  includedBagBannerView: {
    margin: 5,
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
  },
});
