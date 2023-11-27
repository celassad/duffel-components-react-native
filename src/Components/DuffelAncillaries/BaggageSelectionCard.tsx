import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const TITLE = 'Extra baggage';
const SUBTITLE = 'Add any extra baggage you need for your trip';

export default function BaggageSelectionCard({
  offer,
  passengers,
}: {
  offer: Offer;
  passengers: Passenger[];
}) {
  const { t } = useTranslation();
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
          <Text>{t('welcome')}</Text>
          <Text style={styles.titleStyle}>{TITLE}</Text>
          <Text style={styles.subtitleStyle}>{SUBTITLE}</Text>
        </View>
      </TouchableOpacity>
      <BaggageSelectionModal
        offer={offer}
        passengers={passengers}
        handleModal={handleModal}
        visible={visible}
      />
    </>
  );
}

function BaggageSelectionModal({
  handleModal,
  visible,
  offer,
  passengers,
}: {
  handleModal: () => void;
  visible: boolean;
  offer: Offer;
  passengers: Passenger[];
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
                <BaggageSelectionView offer={offer} passengers={passengers} />
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
}: {
  offer: Offer;
  passengers: Passenger[];
}) {
  return (
    <SliceBaggageSelection
      offer={offer}
      slice={offer.slices?.[0]}
      passengers={passengers}
    />
  );
}
function SliceBaggageSelection({
  offer,
  slice,
  passengers,
}: {
  offer: Offer;
  slice: OfferSlice;
  passengers: Passenger[];
}) {
  const title = `Vol de ${slice.origin.iata_city_code} à ${slice.destination.iata_city_code}`;

  return (
    <View>
      <Text style={styles.sliceTitle}>{title}</Text>
      {passengers?.map((p, i) => {
        return (
          <PassengerBagage
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
}: {
  passenger: Passenger;
  index: number;
  slice: OfferSlice;
  offer: Offer;
}) {
  const includedBaggage = slice?.segments?.[0]?.passengers?.[index]?.baggages;
  const hasIncludedBaggage = includedBaggage?.reduce(
    (sum, bag) => sum + bag.quantity,
    0
  );
  const passengerServicesForSegment = offer?.available_services?.filter(
    ({ type, passenger_ids, segment_ids }) =>
      type === 'baggage' &&
      passenger_ids.includes(passenger.id) &&
      segment_ids.includes(slice?.segments?.[0]?.id)
  ) as Service[];

  return (
    <View>
      <Text
        style={styles.passengerName}
      >{`${passenger.given_name} ${passenger.family_name}`}</Text>
      {hasIncludedBaggage ? (
        <IncludedBaggageBanner includedBaggage={includedBaggage} />
      ) : null}

      {passengerServicesForSegment.map((availableService) => (
        <BaggageSelectionController
          key={availableService.id}
          passengerId={passenger.id}
          segmentId={slice.segments?.[0]?.id}
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
        <Text style={styles.addBagageNotAvailableText}>
          Aucun bagage supplémentaire disponible pour ce passager
        </Text>
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
}: {
  includedBaggage: OfferSliceSegmentPassengerBaggage[];
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
      withPlural(carryOnBagsQuantity, 'bagage cabine', 'bagages cabine')
    );
  }
  if (checkedBagsQuantity > 0) {
    baggageLabelStringArray.push(
      withPlural(checkedBagsQuantity, 'bagage en soute', 'bagages en soute')
    );
  }
  return (
    <View style={styles.includedBagBannerView}>
      <Text style={styles.includedBagText}>
        {baggageLabelStringArray.join(' et ')} inclus
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
