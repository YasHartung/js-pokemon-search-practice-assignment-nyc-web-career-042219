

document.addEventListener('DOMContentLoaded', () => {
  // console.log(POKEMON)
  //YOUR CODE HERE

  var pokemonArray = []

  let pokemonContainer = document.querySelector('#pokemon-container')
  let searchBar = document.querySelector('#pokemon-search-input')
  let newPokemonForm = document.querySelector('#new-pokemon-form')
  

  function displayPokemon(data) {
    pokemonContainer.innerHTML = data.map(function(pokemon) {
      return `
        <div class="pokemon-card">
        <div class="pokemon-frame">
          <button class="delete-button" data-id="${pokemon.id}">X</button>
          <h1 class="center-text">${pokemon.name}</h1>
          <div class="pokemon-image">
            <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
          </div>
        </div>
      </div>
      `
    }).join("")
  }

  pokemonContainer.addEventListener('click', event => {
    if (event.target.className === "toggle-sprite") {
    
      let target = pokemonArray.find(pokemon => pokemon.id == event.target.dataset.id)
    
      if (event.target.src === target.sprites.front)
      {
        event.target.src = target.sprites.back
      }
      else {
        event.target.src = target.sprites.front
      }
    }
    if (event.target.className === "delete-button"){

      deletePokemon(event.target.dataset.id);
    }
    
  })

 searchBar.addEventListener('input', event => {
   
    filterPokemon(pokemonArray, searchBar.value)
  })
  newPokemonForm.addEventListener('submit', e => {
    e.preventDefault();

    pokeName = e.target[0].value
    pokeFront = e.target[1].value
    pokeBack = e.target[2].value

    createPokemon(pokeName, pokeFront, pokeBack)

  })



  
  function filterPokemon(pokemonArray, query) {
    let actuallyFilter = pokemonArray.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(query)
    })
    displayPokemon(actuallyFilter)
  }
  
  let pokemonList = fetch('http://localhost:3000/pokemon')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    
    pokemonArray = myJson
    displayPokemon(pokemonArray)
  });

  function createPokemon(name, front, back){
    fetch('http://localhost:3000/pokemon', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
     
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
  
      body: JSON.stringify({name: name, sprites:{front: front, back: back}}),
         // body data type must match "Content-Type" header
  })
  .then(response => response.json())
  .then(data => {
    
   
    pokemonArray.push(data)
    // debugger
    
    displayPokemon(pokemonArray);
  }); // parses JSON response into native Javascript objects 

}

function deletePokemon(id){

  
    return fetch('http://localhost:3000/pokemon' + '/' + id, {
      method: 'DELETE'
    })
    .then(response => {
      response.json()
      
      let newPokeArr = pokemonArray.filter(function(pokemon){
        return pokemon.id != id
      })

      pokemonArray = newPokeArr;
      
      displayPokemon(pokemonArray);
      
    })
    
    
  
}

  


})