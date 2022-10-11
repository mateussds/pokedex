const slcLimites = document.getElementById("limits");
const listaPokemons = document.querySelector("#lista-pokemons");
const btnAnterior = document.querySelector("#btn-anterior");
const btnProximo = document.querySelector("#btn-proximo");
const paginas = document.querySelector("#paginas");
let pokemons = [];
let previous,
  next = null;
let offset = 0;
let totalPokemons = 0;
let limit = 20;
let paginaAtual = 1;

let buscarPokemon = async function () {
  offset = (paginaAtual - 1) * limit;
  let response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + limit
  );
  let dados = await response.json();
  next = dados.next;
  previous = dados.previous;
  totalPokemons = dados.count;
  pokemons = dados.results;
};

function exibirPokemons() {
  pokemons.forEach((pokemon, indice) => {
    const li = document.createElement("li");
    li.textContent = pokemon["name"]; //+" => "+listaPokemon[indice]
    listaPokemons.appendChild(li);
  });
}

let temAnterior = function () {
  if (previous == null) {
    btnAnterior.setAttribute("disabled", "disabled");
  } else {
    btnAnterior.removeAttribute("disabled");
  }
};

let temProximo = function () {
  if (next == null) {
    btnProximo.setAttribute("disabled", "disabled");
  } else {
    btnProximo.removeAttribute("disabled");
  }
};

let passarPagina = function () {
  if (paginaAtual <= totalPokemons - 1) {
    paginaAtual++;
    principal();
  }
};

let voltarPagina = function () {
  if (paginaAtual >= 2) {
    paginaAtual--;
    principal();
  }
};

let limparLista = function () {
  listaPokemons.innerHTML = "";
};

let listarPaginas = function () {
  let totalPaginas = Math.round(totalPokemons / limit);
  paginas.textContent = paginaAtual + "/" + totalPaginas;
};

let definirLimite = function (event) {
  // limit = slcLimites.options[slcLimites.selectedIndex].value;
  limit = event.target.value;
  paginaAtual = 1;
  principal();
};

async function principal() {
  limparLista();
  await buscarPokemon();
  exibirPokemons();
  temAnterior();
  temProximo();
  listarPaginas();
}

principal();

slcLimites.addEventListener("change", definirLimite);
btnAnterior.addEventListener("click", voltarPagina);
btnProximo.addEventListener("click", passarPagina);
