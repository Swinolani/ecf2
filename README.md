# Projet Ecf2

## Présentation du projet

Projet integration d'une liste de pokemon via l'api pokeapi avec ces fonctionnalités :

- Possibilité de rechercher un pokemon parmi les 2000 proposés par l'application
- Possibilité de voir les details du pokemon avec pour grands titres ses descriptions générales, ses stats et ses évolutions
- Possibilités de gestionner sa collection de pokemon directement stockée dans le storage.
- Choix du mode sombre

## Les difficultés

Durant le projet, plusieurs problèmes ou difficultés on été rencontrés :

- Je ne suis pas parvenu à faire fonctionner le bouton pour filtrer les pokemons selon leurs types, en conséquence, le bouton présenté en gros à l'accueil n'est qu'une template
- Le storage marche parfaitement mais j'ai du sacrifier de la performance pour que la liste des pokemons dans la collection se synchronise à l'ajout d'un pokemon, j'ai été contrains d'installer une dépendance pour le reloading de la page ce qui donne un rendu abominablement long.

## Comment l'utiliser

- Cloner le projet en effectuant un **git clone**

```bash
git clone https://github.com/Swinolani/ecf2.git
```

- Installer ensuite le package **node modules**

```shell
npm i
```

- Veillez à ce que cette dépendance ci-dessous se trouve bien dans le fichier **'android/app/src/build.gradle'**

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

- L'application peut être lancé avec un **npm start** (en appuyant sur 'a' quand c'est demandé pour travailler sur android)

```shell
npm start
```

## Outils utilisés

```JSON
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.23.1",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/material-bottom-tabs": "^6.2.28",
    "@react-navigation/native": "^6.1.16",
    "@react-navigation/native-stack": "^6.9.25",
    "axios": "^1.6.8",
    "react": "18.2.0",
    "react-native": "0.73.6",
    "react-native-paper": "^5.12.3",
    "react-native-restart": "^0.0.27",
    "react-native-safe-area-context": "^4.9.0",
    "react-native-screens": "^3.29.0",
    "react-native-vector-icons": "^10.0.3"
  },
}

```

J'ai donc utilisé l'async storage pour stocker les données en local, la navigation stack et tab pour la gestion des screens (celle utilisé pour le projet est material-bottom-tabs pour ce qui est du tab navigation), axios pour la recupération de l'api, react-native-restart pour forcer un rechargement de page, et enfin vector-icons pour la récupération des icones de material icons.

J'ai également travaillé mes wireframes sur figma, pour les visualiser, [cliquez ici](https://www.figma.com/file/lHFtmB4zTz1NofiSlAjLFq/ECF-2-Pokemon?type=design&mode=design&t=KcLlASlTRxSqShyq-0).
