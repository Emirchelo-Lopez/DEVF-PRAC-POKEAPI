const URL = "https://pokeapi.co/api/v2/pokemon";
const cardsContainer = document.querySelector(".cards_container");
const previousBtn = document.querySelector("#prev-btn");
const pageNum = document.querySelector("#page-number");
const nextBtn = document.querySelector("#next-btn");

const getPokemon = async (url) => {
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
    console.log(error.message);
  }
};

function createCard(pokemon) {
  let pokeTypes = pokemon.types.map((type) => `<p>${type.type.name}</p>`);
  pokeTypes = pokeTypes.join("");

  let pokeAbs = pokemon.abilities.map(
    (ability) => `<p>${ability.ability.name}</p>`
  );
  pokeAbs = pokeAbs.join("");

  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
        <img
          src="${pokemon.sprites.front_default}"
          alt="Bulbasur"
          class="card_image"
        />
        <h3 class="poke_num">#${pokemon.id}</h3>
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
}

function clearCards() {
  cardsContainer.innerHTML = "";
}

function getPokeCleared(url) {
  clearCards();
  getPokemon(url);
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
pagination();
