

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
        <div class="pokemon-frame" id="card-${pokemon.id}">
          <button class="delete-button" data-id="${pokemon.id}">X</button>
          <h1 class="center-text">${pokemon.name}</h1>
          <div class="pokemon-image">
            <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
          </div>
          <button class="edit-button" data-type="edit" data-id="${pokemon.id}">edit</button>
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
    if(event.target.dataset.type === "edit"){
      renderEditPokemonForm(event.target.dataset.id);
    }
    if(event.target.dataset.type === "edit-sbmt"){
      event.preventDefault();
  
      updatedPokeId = event.target.dataset.id
      updatedPoke ={
        name: event.srcElement.form[0].value,
        
        sprites: {
          front: event.srcElement.form[1].value,
          back: event.srcElement.form[2].value
        }
      }
   
      updatePokemon(updatedPokeId, updatedPoke);
      

    }

    
  })

 searchBar.addEventListener('input', event => {
   
    filterPokemon(pokemonArray, searchBar.value)
  })
  newPokemonForm.addEventListener('submit', e => {
    e.preventDefault();
    let newPoke={
      name: e.target[0].value,
      sprites:{
        front: e.target[1].value,
        back: e.target[2].value
      }
    }
   

    createPokemon(newPoke)

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

  function createPokemon(newPoke){
    fetch('http://localhost:3000/pokemon', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
     
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
  
      body: JSON.stringify(newPoke),
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

  function renderEditPokemonForm(id){

    let pokeCard = document.querySelector(`#card-${id}`)
    pokeCard.innerHTML += `
    <form class="form" id="edit-pokemon-form" class="" action="index.html" method="patch">
   <label for="name">NAME: </label>
   <input id="edit-poke-name" type="text" name="name" value=""> <br>
   <label for="front-sprite">Front Image: </label>
   <input id="edit-poke-front-sprite" type="text" name="front-sprite" value=""><br>
   <label for="back-sprite">Back Sprite: </label>
   <input id="edit-poke-back-sprite" type="text" name="back-sprite" value="">
   <button type="submit" data-id ="${id} "data-type="edit-sbmt">Edit That Pokemon!</button>
</form>
    `

  }

  function updatePokemon(id, updatedPoke){
    fetch(`http://localhost:3000/pokemon/${id}`, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
     
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
  
      body: JSON.stringify(updatedPoke),
         // body data type must match "Content-Type" header
  })
    updateIndex = pokemonArray.findIndex( pokemon => pokemon.id == id)
    pokemonArray[updateIndex] = updatedPoke;

    displayPokemon(pokemonArray)
  
    
  };

  

  


})