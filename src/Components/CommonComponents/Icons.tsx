import React from 'react';
import { Icon } from 'react-native-elements';
import { IconButtonProps } from 'react-native-vector-icons/Icon';
import { colors } from '../../colors';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const AmenityArray = ['bassinet', 'lavatory', 'exit', 'galley'] as const;
type AmenityType = (typeof AmenityArray)[number];

export function parseAmenity(amenity: string): AmenityType | undefined {
  const found = AmenityArray.includes(amenity as AmenityType);
  if (found) {
    return amenity as AmenityType;
  }
  return;
}

const AmenityIcon = {
  bassinet: { name: 'baby-carriage', type: 'font-awesome-5' },
  lavatory: { name: 'restroom', type: 'font-awesome-5' },
  exit: { name: 'arrow-back', type: 'material' },
  galley: { name: 'local-cafe', type: 'material' },
};

type SeatAmenityIconProps = { amenity: AmenityType } & Optional<
  IconButtonProps,
  'name'
>;

export function SeatAmenityIcon({ amenity, ...props }: SeatAmenityIconProps) {
  return (
    <Icon
      {...props}
      size={16}
      color={colors.AMENITY_COLOR}
      name={AmenityIcon[amenity].name}
      type={AmenityIcon[amenity].type}
    />
  );
}
