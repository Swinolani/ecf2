import {View, Switch, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function SwitchButton({onSendDataButton}) {
  const [isEnabled, setIsEnabled] = useState(false);
  // Envoyer le nouvel état au parent
  function toggleSwitch() {
    const newState = !isEnabled; // Synchroniser le style de tous les composants lors du changement d'état
    setIsEnabled(newState);
    onSendDataButton(newState);
  }

  return (
    <View>
      <Switch
        trackColor={{false: '#767577', true: 'blue'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}
