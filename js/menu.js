//MENU
const menuItens = document.querySelectorAll('.menu-item');

const changeActiveItem = () => {
    menuItens.forEach(item => item.classList.remove('active'));
}

menuItens.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
    })
})

//MEUS POSTS 
const linkMeusPost = document.getElementById('meus-posts');
linkMeusPost.addEventListener('click', () => {
    postagem.meusPosts();
});

//CONEXÕES
const btnConexoes = document.getElementById('btn-conexoes');
btnConexoes.addEventListener('click', () => {
    usuario.conexoes();
});

//HOME
const btnHome = document.getElementById('btn-home');
btnHome.addEventListener('click', () => {
    postagem.allPosts();
});