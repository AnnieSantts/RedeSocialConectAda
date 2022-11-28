let userLogado = JSON.parse(localStorage.getItem('logado'));
if (userLogado == null) {
    window.location.href = "index.html";
}

let postagem = new Postagem();
let usuario = new Usuario();

usuario.lerNomeUsuario(userLogado.user);

const elProfilePicture = document.querySelectorAll('.user-photo');
const currentUser = Usuario.infoUsuario(userLogado.user);
elProfilePicture.forEach(el => el.src = `./images/${currentUser.logo}.jpg`);

//SAIR
const btnLogoff = document.getElementById('logoff');
btnLogoff.addEventListener('click', () => {
    if(usuario.logoff()){
        window.location.href = "index.html";
    };
});

//POSTAR 
const btnCadastrarPost = document.getElementById('cadastrarPost');
btnCadastrarPost.addEventListener('click', () => {
    const conteudoPost = document.getElementById('create-post').value;
    if(conteudoPost.length == 0) return alert('Conteúdo do post não pode estar em branco!');

    const numeroImg = Math.floor(Math.random() * 10 + 1);
    const linkImg = `images/feed-${numeroImg}.jpg`;
    
    postagem.postar(conteudoPost, linkImg);
    document.getElementById('create-post').value = "";
});

function curtir(idpost){
    postagem.curtirPost(idpost);
}

function seguir(userAmigo) {
    usuario.adicionarAmigo(userAmigo);
}

function deixarSeguir(userAmigo) {
    usuario.removerAmigo(userAmigo);
}

//Carregar no Início
postagem.allPosts();
