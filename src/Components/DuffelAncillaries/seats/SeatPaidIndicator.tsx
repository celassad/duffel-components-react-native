import React from 'react';
import { View } from 'react-native';

export default function PaidSeatIndicator(){
  return(
      <View style={{position:'absolute', bottom:0, right:0}}>
        <View style={{width:6, height:6, backgroundColor: 'black', borderRadius:10, margin:1}}/>
      </View>
  )
}