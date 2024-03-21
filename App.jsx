import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import PokemonDetails from './screens/PokemonDetails';
import ListPokemon from './screens/ListPokemon';
import CollectionPokemon from './screens/CollectionPokemon';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      activeColor="red" // Couleur rouge pour les icônes en focus
      inactiveColor="#333" // Couleur grise pour les icônes non focus
      barStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Accueil"
        component={ListPokemon}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={24} color={color} />
          ),

          tabBarLabelStyle: {
            display: 'none',
          },
          unmountOnBlur: true, // Ajoutez cette ligne
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionPokemon}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="collections" size={24} color={color} />
          ),
          tabBarLabelStyle: {
            display: 'none',
          },
          unmountOnBlur: true, // Ajoutez cette ligne
        }}
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
