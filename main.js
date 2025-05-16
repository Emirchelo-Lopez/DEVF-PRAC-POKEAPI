const URL = "https://pokeapi.co/api/v2/pokemon";
const cardsContainer = document.querySelector(".cards_container");
const previousBtn = document.querySelector("#prev-btn");
const pageNum = document.querySelector("#page-number");
const nextBtn = document.querySelector("#next-btn");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

const getPokemons = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw Error("Check your code bro");
    }

    const data = await res.json();

    data.results.forEach(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const poke = await res.json();
      createCard(poke);
    });
  } catch (error) {
    cardsContainer.innerHTML = `
      <div class="error">
        <h2>Pokemon not found</h2>
        <img src="https://media.giphy.com/media/3o7aD2sa4v6j0g5x8I/giphy.gif" alt="error" />
      </div>
      `;
  }
};

function createCard(pokemon) {
  let pokeTypes = pokemon.types.map((type) => `<p>${type.type.name}</p>`);
  pokeTypes = pokeTypes.join("");

  let pokeAbs = pokemon.abilities.map(
    (ability) => `<p>${ability.ability.name}</p>`
  );
  pokeAbs = pokeAbs.join("");

  let pokeId = pokemon.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
        <div class="container_card_image">
          <img
            src="${pokemon.sprites.other["dream_world"].front_default}"
            alt="${pokemon.name}"
            class="card_image"
          />
        </div>
        <h3 class="poke_num">#${pokeId}</h3>
        <h2 class="poke_name">${pokemon.name}</h2>
        <div class="card_characteristics">
          <div class="card_characteristic">
            <h4>Height</h4>
            <p>${pokemon.height} m</p>
          </div>
          <div class="card_characteristic">
            <h4>Weight</h4>
            <p>${pokemon.weight} kg</p>
          </div>
        </div>
        <div class="card_characteristics2">
          <div class="card_characteristic2">
            <h4>Type</h4>
            ${pokeTypes}
          </div>
          <div class="div_vert"></div>
          <div class="card_characteristic2">
            <h4>Abilities</h4>
            ${pokeAbs}
          </div>
        </div>`;
  cardsContainer.append(div);

  let mainType = "";

  // Check if 'pokemon.types' exists and has at least one type
  if (pokemon.types && pokemon.types.length > 0) {
    // Get the name of the first type
    mainType = pokemon.types[0].type.name;
  }
  if (mainType) {
    div.classList.add(mainType);
  }
}

function clearCards() {
  cardsContainer.innerHTML = "";
}

function getPokeCleared(url) {
  clearCards();
  getPokemons(url);
}

function pagination() {
  let offset = 0;
  let currentPage = 1;

  pageNum.textContent = currentPage;

  previousBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      offset -= 20;
      pageNum.textContent = currentPage;
      getPokeCleared(`${URL}?offset=${offset}&limit=20`);
    }
  });

  nextBtn.addEventListener("click", () => {
    currentPage++;
    offset += 20;
    pageNum.textContent = currentPage;
    getPokeCleared(`${URL}?offset=${offset}&limit=20`);
  });

  // Initial load
  getPokeCleared(`${URL}?offset=${offset}&limit=20`);
}

async function getOnePoke(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw Error("Check your code bro");
    }

    const data = await res.json();
    createCard(data);
  } catch (error) {
    cardsContainer.innerHTML = `
      <div class="error">
        <h2>Pokemon not found</h2>
        <img src="https://media.giphy.com/media/3o7aD2sa4v6j0g5x8I/giphy.gif" alt="error" />
      </div>
      `;
  }
}

function searchPokemon() {
  const searchValue = searchInput.value.toLowerCase();
  searchInput.value = "";
  clearCards();
  if (searchValue === "") {
    getPokeCleared(`${URL}?offset=0&limit=20`);
  } else {
    getOnePoke(`${URL}/${searchValue}`);
  }
}

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchPokemon();
  }
});

pagination();
