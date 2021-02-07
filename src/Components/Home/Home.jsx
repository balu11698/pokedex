import react, { useEffect, useState } from 'react'
import { getPokemonList, getPokemonData } from '../../api/api'
import './Home.scss'
import ReactPaginate from 'react-paginate';
import Loader from "react-loader-spinner";
import pokeball from '../../assets/pokeball.gif'

function Home() {
	const colors = {
		fire: '#FDDFDF',
		grass: '#DEFDE0',
		electric: '#FCF7DE',
		water: '#DEF3FD',
		ground: '#f4e7da',
		rock: '#d5d5d4',
		fairy: '#fceaff',
		poison: '#98d7a5',
		bug: '#f8d5a3',
		dragon: '#97b3e6',
		psychic: '#eaeda1',
		flying: '#F5F5F5',
		fighting: '#E6E0D4',
		normal: '#F5F5F5'
	};
	const [pokemonList, setPokemonList] = useState([])
	const [filteredPokemonList, setFilteredPokemonList] = useState([])
	const [pokemonTypes, setPokemonTypes] = useState([])
	const [uniquePokeType, setUniquePokeType] = useState([])
	const [searchText, setSearchText] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPokemonsCount, setTotalPokemonsCount] = useState(0)
	const PER_PAGE = 20;
	const offset = currentPage * PER_PAGE;
	const pageCount = Math.ceil(totalPokemonsCount / PER_PAGE);
	const [loading, setLoading] = useState(false);


	useEffect(() => {
		const x = async () => {
			setLoading(true);
			const pokemonURLList = await getPokemonList(currentPage * 20);
			setTotalPokemonsCount(pokemonURLList.count)
			const pokemonData = await fetchPokemonData(pokemonURLList);
			setPokemonList(pokemonData);
			setFilteredPokemonList(pokemonData);
			setTimeout(()=>setLoading(false),1000)
			//setLoading(false);
			console.log(pokemonData, 'pokemonData');
		}
		x();
	}, [currentPage])

	useEffect(() => {
		const x = async () => {
			filteredPokemonList.filter(item => (item.types.filter(type => setPokemonTypes(pokemonTypes => [...pokemonTypes, type.type.name]))))
		}
		x();
	}, [filteredPokemonList])
	useEffect(() => {
		let unique = [...new Set(pokemonTypes)];
		setUniquePokeType(unique)
	}, [pokemonTypes])

	useEffect(() => {
		let x = filteredPokemonList.filter(item => (item.name.toLowerCase().includes(searchText.toLowerCase())));
		setPokemonList(x);
	}, [searchText])

	const searchByName = (e) => {
		setSearchText(e.target.value);
	}

	const searchByType = (e) => {
		const { value: type } = e.target;
		setPokemonList(filteredPokemonList.filter(pokemon => pokemon.types.some(item => item.type.name.includes(type))));
	}

	function handlePageClick({ selected: selectedPage }) {
		setCurrentPage(selectedPage);

	}

	const fetchPokemonData = async pokemonList => await Promise.all(pokemonList.results.map(async item => await getPokemonData(item.url)));

	return (
		<>
			<div className="contentWrapper">
				{loading === false ? (<><div className="pokeFilters">
					<div className="pokeNameSearch">Pokemon Search :<input className="pokeNameSearchBar" type="text" onChange={searchByName} value={searchText} autoFocus /></div>
					<div className="pokeTypeSearch">Type :<select onChange={searchByType}>{uniquePokeType.map(i => <option >{i}</option>)}</select></div>
				</div>
					<div className="cardWrapper">{pokemonList.map(list =>
						<div className="card" style={{ backgroundColor: colors[list.types[0].type.name] }} key={list.name}>
							<div className="pokeName">{list.name}</div>
							<div className="pokeImage"><img className="imagePoke" src={list.sprites.other.dream_world.front_default}></img></div>
							<div className="pokeAbilities">Abilities{list.abilities.map(abilities => <span>{abilities.ability.name}</span>)}</div>
							<div className="pokeTypes">Type{list.types.map(types => <span>{types.type.name}</span>)}</div>
						</div>
					)
					}</div></>) : (<div className="gif"><img className="pokeballGif" src={pokeball} /></div>)}

				<ReactPaginate
					previousLabel={"<"}
					nextLabel={">"}
					breakLabel={'...'}
					pageCount={pageCount}
					onPageChange={handlePageClick}
					containerClassName={"pagination"}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					previousLinkClassName={"pagination__link"}
					nextLinkClassName={"pagination__link"}
					disabledClassName={"pagination__link--disabled"}
					activeClassName={"pagination__link--active"}
				/>
			</div>

		</>
	);


}
export default Home
