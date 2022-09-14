import React from 'react'
import { View, Text } from 'react-native'
import { SECONDARY_COLOR } from '../config'

const DetailCard = (props) => {
    return (
        <View style={{
            width: 80, backgroundColor: '#F7F7F7', borderRadius: 10, marginHorizontal: 10, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
        }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: SECONDARY_COLOR }}>{props.value}</Text>
                <Text style={{ fontSize: 11, color: 'black' }}>{props.title}</Text>
            </View>
        </View>
    )
}

export default DetailCard