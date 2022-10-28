const slcLimites = document.getElementById("limits");
const listaPokemons = document.querySelector("#lista-pokemons");
const btnAnterior = document.querySelector("#btn-anterior");
const btnProximo = document.querySelector("#btn-proximo");
const paginas = document.querySelector("#paginas");
const espacamento = document.querySelector("#espaco-lista");
const nomePokemon = document.querySelector("#nome-pokemon-selecionado");
const imgPokemon = document.querySelector("#imagem-pokemon-selecionado");
const atributosPokemon = document.querySelector(
  "#atributos-pokemon-selecionado"
);
const caracteristicasPokemon = document.querySelector(
  "#caracteristicas-pokemon-selecionado"
);
const AlturaPesoPokemon = document.querySelector(
  "#altura-peso-pokemon-selecionado"
);

let pokemons = [];
let previous,
  next = null;
let offset = 0;
let totalPokemons = 0;
let limit = 20;
let paginaAtual = 1;
let habilidades = " ";
let estatisticas = " ";
let tipos = " ";
let imagens = " ";
let alturaPeso = " ";
let pokemonCLicado = " ";
let dadosPokemon = 0;

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
//alimenta as variáveis que formarão a pokedex
let recolheDados = function (dados) {
  dados.abilities.forEach((habilidade) => {
    habilidades += habilidade.ability["name"] + "//"; //habilidades
  });
  dados.stats.forEach((estatistica) => {
    estatisticas +=
      estatistica.stat["name"] + "= " + estatistica["base_stat"] + ", ";
  });
  dados.types.forEach((tipo) => {
    tipos += tipo.type["name"] + ", "; //Tipos
  });
  imagens = dados.sprites.front_default; //Imagens
  alturaPeso = "Altura: " + dados.height + "," + " " + "Peso: " + dados.weight; //Altura e peso

  //console.log(id);
  //console.log(dadosPokemon);
};

let acessarPokemon = async function (event) {
  //início do método utilizando o pokemon selecionado pelo evento 'click'
  let urlDadosPokemon = "0";
  pokemonCLicado = event.target.textContent;
  pokemons.forEach((pokemon, indice) => {
    if (pokemons[indice]["name"] === pokemonCLicado) {
      console.log(pokemons[indice]["name"]);
      console.log(pokemons[indice]["url"]);
      urlDadosPokemon = pokemons[indice]["url"];
    }
  });
  let response = await fetch(urlDadosPokemon);
  let dados = await response.json();
  recolheDados(dados);

  nomePokemon.textContent = "Nome: " + pokemonCLicado; //Exibição na tela
  imgPokemon.setAttribute("src", imagens);
  imgPokemon.setAttribute("alt", pokemonCLicado);
  atributosPokemon.textContent = "Atributos: " + estatisticas;
  caracteristicasPokemon.textContent = "Caracteristicas:  " + tipos;
  AlturaPesoPokemon.textContent = alturaPeso;

  pokemonCLicado = " ";
  imagens = " ";
  estatisticas = " ";
  tipos = " ";
  alturaPeso = " ";
};

let exibirPokemons = function () {
  pokemons.forEach((pokemon, indice) => {
    const li = document.createElement("li");
    li.addEventListener("click", acessarPokemon);
    li.textContent = pokemon["name"];
    li.classList.add("my-2");
    listaPokemons.appendChild(li);
  });
};
//Limpa as variáveis para novos dados do evento click para exibição de destlhes
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
