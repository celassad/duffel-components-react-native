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
import {
  Offer,
  OfferSlice,
  OfferSliceSegmentPassengerBaggage,
  Passenger,
  Service,
  ServiceMetadata,
} from '../../duffelTypes';
import i18n from '../../translation/index';

export default function BaggageSelectionCard({
  offer,
  passengers,
  lng,
}: {
  offer: Offer;
  passengers: Passenger[];
  lng: 'en' | 'fr';
}) {
  const t = i18n.getFixedT(lng);

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
          <Text style={styles.titleStyle}>{t('baggageCardTitle')}</Text>
          <Text style={styles.subtitleStyle}>{t('baggageCardSubtitle')}</Text>
        </View>
      </TouchableOpacity>
      <BaggageSelectionModal
        offer={offer}
        passengers={passengers}
        handleModal={handleModal}
        visible={visible}
        t={t}
      />
    </>
  );
}

function BaggageSelectionModal({
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
                <BaggageSelectionView
                  t={t}
                  offer={offer}
                  passengers={passengers}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function BaggageSelectionView({
  offer,
  passengers,
  t,
}: {
  offer: Offer;
  passengers: Passenger[];
  t: any;
}) {
  return (
    <>
      {offer.slices?.[0] ? (
        <SliceBaggageSelection
          offer={offer}
          slice={offer.slices?.[0]}
          passengers={passengers}
          t={t}
        />
      ) : (
        <></>
      )}
    </>
  );
}
function SliceBaggageSelection({
  offer,
  slice,
  passengers,
  t,
}: {
  offer: Offer;
  slice: OfferSlice;
  passengers: Passenger[];
  t: any;
}) {
  const title = `${t('flightFrom')} ${slice.origin.iata_city_code} ${t('to')} ${
    slice.destination.iata_city_code
  }`;

  return (
    <View>
      <Text style={styles.sliceTitle}>{title}</Text>
      {passengers?.map((p, i) => {
        return (
          <PassengerBagage
            t={t}
            passenger={p}
            index={i}
            slice={slice}
            offer={offer}
          />
        );
      })}
    </View>
  );
}

function PassengerBagage({
  passenger,
  index,
  slice,
  offer,
  t,
}: {
  passenger: Passenger;
  index: number;
  slice: OfferSlice;
  offer: Offer;
  t: any;
}) {
  const includedBaggage = slice.segments?.[0]?.passengers?.[index]?.baggages;
  const segmentId = slice.segments?.[0]?.id ?? '';
  const hasIncludedBaggage = includedBaggage?.reduce(
    (sum, bag) => sum + bag.quantity,
    0
  );
  const passengerServicesForSegment = offer?.available_services?.filter(
    ({ type, passenger_ids, segment_ids }) =>
      type === 'baggage' &&
      passenger_ids.includes(passenger.id) &&
      segment_ids.includes(segmentId)
  ) as Service[];

  return (
    <View>
      <Text
        style={styles.passengerName}
      >{`${passenger.given_name} ${passenger.family_name}`}</Text>
      {hasIncludedBaggage && includedBaggage ? (
        <IncludedBaggageBanner includedBaggage={includedBaggage} t={t} />
      ) : null}

      {passengerServicesForSegment.map((availableService) => (
        <BaggageSelectionController
          key={availableService.id}
          passengerId={passenger.id}
          segmentId={segmentId}
          availableService={availableService}
          // selectedServices={selectedServices}
          // quantity={
          //     selectedServices.find(
          //         ({ id }) => id == availableService.id
          //     )?.quantity || 0
          // }
          // onQuantityChanged={(newQuantity) =>
          //     onBaggageQuantityChanged(
          //         newQuantity,
          //         segmentId,
          //         passengerId,
          //         passengerName,
          //         availableService,
          //         selectedServices,
          //         setSelectedServices
          //     )
          // }
        />
      ))}
      {passengerServicesForSegment.length === 0 && (
        <Text style={styles.addBagageNotAvailableText}>{t('noBaggage')}</Text>
      )}
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

function BaggageSelectionController({
  availableService,
  passengerId,
  segmentId,
}: {
  availableService: Service;
  passengerId: string;
  segmentId: string;
}) {
  const serviceName =
    availableService.metadata.type === 'carry_on' ? 'Cabin bag' : 'Checked bag';

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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
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

function Counter() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Icon name="remove" containerStyle={{ borderWidth: 1 }} />

      <Text style={{ padding: 5 }}>0</Text>
      <Icon name="add" containerStyle={{ borderWidth: 1 }} />
    </View>
  );
}

function IncludedBaggageBanner({
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

export function withPlural(quantity: number, singular: string, plural: string) {
  return quantity > 1 ? `${quantity} ${plural}` : `${quantity} ${singular}`;
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
    paddingRight: 10,
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    flexDirection: 'row',
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
  addBagageNotAvailableText: {
    color: '#74747C',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 14,
  },
  passengerName: {
    fontWeight: 'bold',
    color: 'hsl(203, 14%, 23%)',
    padding: 10,
    fontSize: 16,
  },
  includedBagText: {
    color: '#064E3B',
  },
  includedBagBannerView: {
    margin: 5,
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
  },
  sliceTitle: {
    fontWeight: 'bold',
    color: 'hsl(203, 14%, 23%)',
    fontSize: 18,
    marginBottom: 20,
  },
  containerStyle: {
    margin: 20,
  },
});
