import {ScrollView, StyleSheet, Text, View, Image, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CollectionPokemon() {
  const [listPokemonCollection, setListPokemonCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //Quand j'essaye de supprimer, cela supprime tous les pokemons de mon pokedex d'un coup !
  async function supprimer(index) {
    try {
      const updatedCollection = listPokemonCollection.filter(
        pokemon => pokemon.id !== index,
      );
      setListPokemonCollection(updatedCollection);
      await AsyncStorage.setItem(
        'listPokemon',
        JSON.stringify(updatedCollection),
      );
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPokemonIds = await AsyncStorage.getItem('listPokemon');
        if (storedPokemonIds) {
          const pokemonIds = JSON.parse(storedPokemonIds);
          const validPokemonIds = pokemonIds.filter(
            id => id >= 1 && id <= 1000,
          );
          const promises = validPokemonIds.map(id =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
          );
          const pokemonDetails = await Promise.all(promises);
          setListPokemonCollection(
            pokemonDetails.map(response => response.data),
          );
        }
      } catch (error) {
        setError('Pokedex vide');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {listPokemonCollection.map(pokemon => (
            <View key={pokemon.id} style={styles.pokemonContainer}>
              <View>
                <Image
                  width={80}
                  height={80}
                  style={styles.image}
                  source={{
                    uri: pokemon.sprites.other['official-artwork']
                      .front_default,
                  }}
                />
                <Text style={styles.pokemonName}>{pokemon.name}</Text>
                <Text style={styles.pokemonId}>ID: {pokemon.id}</Text>
                <Text style={styles.pokemonType}>
                  Types: {pokemon.types.map(type => type.type.name).join(', ')}
                </Text>
                <Text style={styles.pokemonStats}>
                  HP:{' '}
                  {
                    pokemon.stats.find(stat => stat.stat.name === 'hp')
                      .base_stat
                  }
                </Text>
              </View>
              {/* bouton supprimer marche pas */}
              <Button
                color={'#B22222'}
                title="Supprimer de la collection"
                onPress={() => {
                  supprimer(pokemon.id);
                }}></Button>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pokemonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pokemonId: {
    fontSize: 16,
  },
  pokemonType: {
    fontSize: 16,
  },
  pokemonStats: {
    fontSize: 16,
  },
});
