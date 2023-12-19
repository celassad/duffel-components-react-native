import { colors } from 'duffel-components-react-native/src/colors';
import { SeatAmenityIcon } from 'duffel-components-react-native/src/Components/CommonComponents/Icons';
import React from 'react';
import { View } from "react-native";
import { Text } from 'react-native-elements';

export default function Legend({symbols}:{symbols: Set<string>}){

    return(
        <View style={{flexDirection:'row', flexWrap:'wrap', paddingVertical:12}}>

            {[...symbols].map((s)=>{
                return <Amenity symbol={s}/>
                }
            )}

        </View>
    )
}

function Amenity({symbol}:{symbol: string}){
    const amenity = symbol.split('_')[0]
    return(
        <>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <SeatAmenityIcon amenity={amenity} style={{padding:6}}/>
            <Text style={{color: colors.AMENITY_COLOR}}>{amenity}</Text>
        </View>
        <View style={{width:8}}/>
        </>
    )
}