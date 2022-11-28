// AMIGOS
const friendsSearch = document.querySelector('#friends-search');

//Busca chat
friendsSearch.addEventListener('input', () => {
    const { value } = friendsSearch;
    new Usuario().filtrarAmigos(value);
});
