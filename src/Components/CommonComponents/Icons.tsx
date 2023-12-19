import { colors } from 'duffel-components-react-native/src/colors';
import React from 'react';
import { Icon } from "react-native-elements";
import { IconButtonProps } from 'react-native-vector-icons/Icon';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
const AmenityIcon = {
    bassinet: {name: "baby-carriage", type:'font-awesome-5'},
    lavatory: {name: "restroom", type:'font-awesome-5'},
    exit: {name: "arrow-back"},
    galley: {name: "local-cafe"},
}

type SeatAmenityIconProps = {amenity : string} & Optional<IconButtonProps, "name">

export function SeatAmenityIcon({amenity, ...props}:SeatAmenityIconProps){
    return(
        <Icon {...props} size={16} color={colors.AMENITY_COLOR} name={AmenityIcon[amenity].name} type={AmenityIcon[amenity].type} />
    )
}