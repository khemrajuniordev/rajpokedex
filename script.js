"use strict";
// 1. Captura e tipagem dos elementos do DOM usando Type Assertion (as ...)
const inputElement = document.getElementById("pokemonInput");
const searchButton = document.getElementById("searchBtn");
const cardContainer = document.getElementById("pokemonCard");
/**
 * Adiciona o ouvinte de evento de clique no botão de pesquisa.
 * Marcado como 'async' para permitir o uso de 'await' na requisição.
 */
searchButton.addEventListener("click", async () => {
    // Pega o valor digitado, remove espaços e converte para minúsculas (exigência da PokéAPI)
    const termoBusca = inputElement.value.trim().toLowerCase();
    // Validação inicial: se o campo estiver vazio, avisa na tela e interrompe
    if (!termoBusca) {
        cardContainer.innerHTML = `<p class="message error">Digite o nome e clique em Buscar!</p>`;
        return;
    }
    try {
        // Exibe feedback de carregamento na tela usando innerHTML
        cardContainer.innerHTML = `<p class="message loading">⚡ Buscando Pokémon...</p>`;
        // 2. Dispara a requisição fetch para a PokéAPI pública
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoBusca}`);
        // Se o status HTTP não for de sucesso (ex: 404 - Não encontrado), dispara um erro
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }
        // 3. Converte a resposta para JSON aplicando a tipagem da nossa interface
        const pokemonData = await resposta.json();
        // Extrai o primeiro tipo do Pokémon do array com fallback de segurança
        const tipoPrincipal = pokemonData.types[0]?.type.name ?? "desconhecido";
        const pokemonId = `#${String(pokemonData.id).padStart(3, "0")}`;
        const spriteSrc = pokemonData.sprites.front_default || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
        // 4. Renderiza os dados na tela utilizando template strings com innerHTML
        cardContainer.innerHTML = `
            <div class="pokemon-card">
                <span class="pokemon-id">${pokemonId}</span>
                <div class="sprite-container">
                    <img src="${spriteSrc}" alt="Imagem do ${pokemonData.name}" class="pokemon-sprite" />
                </div>
                <h2 class="pokemon-name">${pokemonData.name}</h2>
                <div class="pokemon-types">
                    <span class="type-badge ${tipoPrincipal}">${tipoPrincipal}</span>
                </div>
            </div>
        `;
    }
    catch (erro) {
        // Captura falhas de rede ou erros gerados pelo throw e exibe mensagem amigável
        console.error("Erro na busca:", erro);
        cardContainer.innerHTML = `<p class="message error">❌ Pokémon não encontrado! Tente outro.</p>`;
    }
});
// Permite buscar também apertando a tecla Enter
inputElement.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
