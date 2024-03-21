import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SwitchButton from '../components/SwitchButton';

export default function ListPokemon({navigation}) {
  const [pokemon, setPokemon] = useState('');
  const [pokemonListFilter, setPokemonListFilter] = useState([]);
  const [error, setError] = useState(null);
  const [isEnabled, setEnabled] = useState(false);
  const buttonFilterType = useRef();
  function handleChangeText(value) {
    setPokemon(value);
  }
  // Fonction qui verifie si la chaine 2 est inclus dans la chaine 1
  function estContenu(chaine1, chaine2) {
    const chaine1Minuscule = chaine1.toLowerCase();
    const chaine2Minuscule = chaine2.toLowerCase();

    if (chaine1Minuscule.includes(chaine2Minuscule)) {
      return true;
    } else {
      return false;
    }
  }
  // Envoyer la donnée au composant du bouton switch
  function handleSendDataButton(dataFromChild) {
    setEnabled(dataFromChild);
  }
  // use Effect
  useEffect(() => {
    // Recuperer la liste des pokemons
    async function fetchPokemon() {
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=2000',
        );
        const dataFilter = response.data.results.filter(
          item =>
            estContenu(item.name, pokemon) && item.name.split('-').length == 1,
        );
        setPokemonListFilter(dataFilter);
        setError(null);
      } catch (error) {
        setError(
          "Une erreur s'est produite lors de la récupération de la liste des Pokémon.",
        );
      }
    }
    // Si l'imput est vide , on ne fetchera pas l'api
    if (pokemon !== '') {
      fetchPokemon();
    } else {
      setPokemonListFilter([]);
    }
  }, [pokemon]);

  // LA FONCTION N EST PAS VALIDE !
  function filterByType() {}

  return (
    <View
      style={{backgroundColor: isEnabled ? 'black' : 'white', height: '100%'}}>
      <SwitchButton onSendDataButton={handleSendDataButton}></SwitchButton>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png',
        }}
        width={450}
        height={170}
      />
      <TextInput
        style={{...styles.input, color: isEnabled ? 'white' : 'black'}}
        placeholder="Entrez le nom du pokemon"
        value={pokemon}
        onChangeText={handleChangeText}
        placeholderTextColor={isEnabled ? 'white' : 'black'}
      />
      <Button
        title="Filtrer par types"
        onPress={filterByType}
        ref={buttonFilterType}></Button>
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView contentContainerStyle={styles.pokemonList}>
        {pokemonListFilter.map((item, index) => (
          <View key={index} style={styles.pokemonRow}>
            <View style={styles.pokemonColumn}>
              {pokemonListFilter[index * 2] && (
                <Pressable
                  onPress={() => {
                    navigation.navigate('pokemonDetails', {
                      id: pokemonListFilter[index * 2].url.split('/')[6],
                    });
                  }}>
                  <View style={styles.pokemonItem}>
                    <Image
                      style={styles.pokemonImage}
                      source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          pokemonListFilter[index * 2].url.split('/')[6]
                        }.png`,
                      }}
                    />
                    <View style={styles.pokemonInfo}>
                      <Text
                        style={{
                          ...styles.pokemonName,
                          color: isEnabled ? 'white' : 'black',
                        }}>
                        {pokemonListFilter[index * 2].name}
                      </Text>
                      <Text
                        style={{
                          ...styles.pokemonId,
                          color: isEnabled ? 'white' : 'black',
                        }}>
                        #{pokemonListFilter[index * 2].url.split('/')[6]}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
            <View style={styles.pokemonColumn}>
              {pokemonListFilter[index * 2 + 1] && (
                <Pressable
                  onPress={() => {
                    navigation.navigate('pokemonDetails', {
                      id: pokemonListFilter[index * 2 + 1].url.split('/')[6],
                    });
                  }}>
                  <View style={styles.pokemonItem}>
                    <Image
                      style={styles.pokemonImage}
                      source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          pokemonListFilter[index * 2 + 1].url.split('/')[6]
                        }.png`,
                      }}
                    />
                    <View style={styles.pokemonInfo}>
                      <Text
                        style={{
                          ...styles.pokemonName,
                          color: isEnabled ? 'white' : 'black',
                        }}>
                        {pokemonListFilter[index * 2 + 1].name}
                      </Text>
                      <Text
                        style={{
                          ...styles.pokemonId,
                          color: isEnabled ? 'white' : 'black',
                        }}>
                        #{pokemonListFilter[index * 2 + 1].url.split('/')[6]}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  pokemonList: {
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  pokemonRow: {
    flexDirection: 'row',
  },
  pokemonColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  pokemonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pokemonId: {
    fontSize: 14,
    color: '#666',
  },

  logo: {},
});
