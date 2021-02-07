import axios from 'axios';

export function getPokemonList(offset = 0) {
	return new Promise((resolve, reject) => {
		resolve(axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`).then((response) => response.data))
	})
}

export function getPokemonData(url) {
	const promise = new Promise((resolve, reject) => {
		axios.get(url).then((response) => {
			resolve(response.data);
		})
	})
	return promise;
}

