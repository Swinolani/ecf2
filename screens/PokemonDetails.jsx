import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {typeColors} from '../data/colorType';
import RNRestart from 'react-native-restart';
export default function PokemonDetails({route}) {
  // LES USESTATES
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const idPokemon = route.params.id;
  const [buttonClicked, setButtonClicked] = useState(false);
  const [evolutionName, setEvolutionName] = useState([]);
  // FONCTION QUI VERIFIE SI UNE CHAINE DE CARACTERE SE TROUVE DANS UN TABLEAU
  function isChaineInArray(chaine, tableau) {
    for (let i = 0; i < tableau.length; i++) {
      if (tableau[i] === chaine) {
        return true;
      }
    }
    return false;
  }
  function removeChaineFromArray(chaine, tableau) {
    return tableau.filter(item => item !== chaine);
  }
  // LE CRUD POUR LA GESTION DU STORAGE
  const addPokemonListAsync = async () => {
    try {
      let listPokemon = await AsyncStorage.getItem('listPokemon');
      listPokemon = listPokemon ? JSON.parse(listPokemon) : [];
      if (!isChaineInArray(idPokemon, listPokemon)) {
        listPokemon.push(idPokemon);
        await AsyncStorage.setItem('listPokemon', JSON.stringify(listPokemon));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePokemonListAsync = async () => {
    try {
      let listPokemon = await AsyncStorage.getItem('listPokemon');
      listPokemon = listPokemon ? JSON.parse(listPokemon) : [];
      if (isChaineInArray(idPokemon, listPokemon)) {
        listPokemon = removeChaineFromArray(idPokemon, listPokemon);
        await AsyncStorage.setItem('listPokemon', JSON.stringify(listPokemon));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // BOUTON PERMETTANT DAJOUTER OU DE SUPPRIMER UN POKEMON DE SA COLLECTION (async storage)
  // JE NAI PAS REUSSI A FAIRE AUTREMENT POUR LACTUALISATION DE LA COLLECTION LORS DE LAJOUT OU DE LA SUPPRESSION
  function addCollection() {
    if (!buttonClicked) {
      setButtonClicked(true);
      RNRestart.Restart();
      //Ajoute dans le storage
      addPokemonListAsync();
    } else {
      setButtonClicked(false);
      //Retirer du storage
      deletePokemonListAsync();
      RNRestart.Restart();
    }
  }
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${idPokemon}`,
        );
        setPokemonDetails(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };
    if (isChaineInArray(idPokemon, AsyncStorage.getItem('listPokemon'))) {
      setButtonClicked(false);
    }
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('listPokemon');
        if (isChaineInArray(idPokemon, JSON.parse(value))) {
          setButtonClicked(true);
        } else {
          setButtonClicked(false);
        }
      } catch (error) {
        console.log(error);
      }

      const fetchEvolutionName = async () => {
        try {
          // Requête pour récupérer les détails du Pokémon initial
          const initialPokemonResponse = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${idPokemon}`,
          );
          const initialPokemonDetails = initialPokemonResponse.data;

          // Récupération de la chaîne d'évolution
          const speciesUrl = initialPokemonDetails.species.url;
          const speciesResponse = await axios.get(speciesUrl);
          const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
          const evolutionChainResponse = await axios.get(evolutionChainUrl);
          const evolutionChain = evolutionChainResponse.data.chain;

          // Fonction récursive pour récupérer les images de toutes les évolutions
          const fetchAllEvolutionName = async chain => {
            const evolutionName = [];

            const fetchEvolution = async evolution => {
              const pokemonName = evolution.species.name;

              evolutionName.push({name: pokemonName});

              // Récupérer les images des évolutions suivantes
              for (const nextEvolution of evolution.evolves_to) {
                await fetchEvolution(nextEvolution);
              }
            };

            await fetchEvolution(chain);
            return evolutionName;
          };

          const allEvolutionName = await fetchAllEvolutionName(evolutionChain);
          setEvolutionName(allEvolutionName);
        } catch (error) {
          console.error('Error fetching evolution Name:', error);
        }
      };

      fetchEvolutionName();
    };

    fetchData();
    fetchPokemonDetails();
  }, [idPokemon]);

  return (
    <View style={styles.container}>
      {pokemonDetails ? (
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{
              uri: pokemonDetails.sprites.other['official-artwork']
                .front_default,
            }}
          />
          <Text style={styles.name}>Name: {pokemonDetails.name}</Text>
          <Text style={styles.text}>Pokédex Number: #{pokemonDetails.id}</Text>
          <Text style={styles.text}>
            Types:{' '}
            {pokemonDetails.types.map((type, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: typeColors[type.type.name],
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: 5,
                  }}>
                  {type.type.name}
                </Text>
              </View>
            ))}
          </Text>
          <Text style={styles.text}>
            Description: {pokemonDetails.species.name}
          </Text>
          <View
            style={{
              borderBottomColor: '#ccc',
              borderBottomWidth: 5,
              marginVertical: 10,
            }}></View>
          <Text style={{...styles.text, fontWeight: 'bold'}}>Stats:</Text>
          {pokemonDetails.stats.map(stat => (
            <Text key={stat.stat.name} style={styles.text}>
              {stat.stat.name}: {stat.base_stat}
            </Text>
          ))}
          <View
            style={{
              borderBottomColor: '#ccc',
              borderBottomWidth: 5,
              marginVertical: 10,
            }}></View>
          <FlatList
            data={evolutionName}
            renderItem={({item, index}) => (
              <Text>
                <Text style={{fontWeight: 'bold'}}>Evolution {index} : </Text>
                {item.name}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: buttonClicked ? 'red' : 'green',
              padding: 10,
            }}
            onPress={addCollection}>
            <Text style={styles.buttonText}>
              {buttonClicked
                ? 'Retirer de mon pokedex'
                : 'Ajouter à mon pokedex'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  card: {
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    padding: 40,
    borderRadius: 20,
    height: '95%',
    elevation: 2,
    shadowColor: 'grey',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
