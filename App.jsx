import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PokemonDetails from './screens/PokemonDetails';
import ListPokemon from './screens/ListPokemon';
import CollectionPokemon from './screens/CollectionPokemon';

// package necessaire navigation :
// npm install @react-navigation/native
// npm install react-native-screens react-native-safe-area-context
// npm i @react-navigation/native-stack

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Accueil" component={ListPokemon} />
      <Tab.Screen
        name="Collection"
        component={CollectionPokemon}
        options={{title: 'Mon pokedex'}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="listPokemon"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="pokemonDetails"
          component={PokemonDetails}
          options={{title: 'Infos sur le pokemon'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
