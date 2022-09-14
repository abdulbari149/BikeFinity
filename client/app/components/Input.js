import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Input = (props) => {

    const [secureInput, setSecureInput] = useState(props.secureTextEntry);

    handleToggle = () => {
        secureInput ? setSecureInput(false) : setSecureInput(true)
    }

    return (
        <View style={{ flexDirection: 'row', width: '100%', height: props.multiline ? props.numberOfLines * 25 : 40, borderBottomWidth: 1, }}>
            {
                props.icon ?
                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={props.icon} size={20} />
                    </View>
                    : null
            }
            <View style={{ flex: !props.icon && !props.secureTextEntry ? 1 : props.icon && props.secureTextEntry ? 0.8 : props.icon || props.secureTextEntry ? 0.9 : null }}>
                <TextInput
                    placeholder={props.name}
                    keyboardType={props.type}
                    autoCapitalize={props.autoCapitalize}
                    defaultValue={props.defaultValue}
                    onChangeText={value => props.onChange(value)}
                    onBlur={props.onBlur}
                    secureTextEntry={secureInput}
                    value={props.value}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                    textAlignVertical='top'
                />
            </View>
            {
                props.secureTextEntry ?
                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={handleToggle}>
                            <Icon name={secureInput ? 'visibility-off' : 'visibility'} size={20} />
                        </TouchableOpacity>
                    </View>
                    : null
            }
        </View>
    );
}

export default Input;