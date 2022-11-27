class Usuario {
    #usuario;
    nome;
    #amigo;

    constructor(usuario) {
        this.#usuario = usuario;

    }

    //Ler o nome do próprio usuario

    lerNomeUsuario(usuario) {
        let nomes = Usuario.lerNomeUsuarios();
        nomes.forEach(i => {
            if (i.user === usuario) {
                document.getElementById('recebe-nome-usuario').innerHTML = i.nome;
                this.nome = i.nome;
                return null;
            }
        });
    }

    static lerNomeUsuarios() {
        let users = JSON.parse(localStorage.getItem('usuarios')) ?? [];
        return users;
    }

    logoff() {
        localStorage.setItem('logado', []);
        return true;
    }

    set adicionarAmigo(useramigo) {
        this.#amigo = useramigo;
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos.push({ 'useramigo': this.#amigo });
        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
    }

    set removerAmigo(nomeamigo) {      
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos.forEach(e => {
            console.log(e.useramigo, nomeamigo);
            if (e.useramigo == nomeamigo) {

            } else {
                amigos.push({ 'useramigo': e.useramigo });
            }
        });
        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        console.log(amigos)
    }

    set curtirPost(idPost){
        const curtidoPor = this.#usuario;
        let curtidas = JSON.parse(localStorage.getItem('curtidas')) ?? [];
        curtidas.push({ 'curtida': idPost, 'por': curtidoPor });
        localStorage.setItem('curtidas', JSON.stringify(curtidas));
    }

    postar(conteudoPost, linkImg) { 
        let idPost = (Math.random() * 100000000000000000);
        let posts = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        posts.push({ 'txtpost': conteudoPost, 'imagem': linkImg, 'idpost': idPost })
        localStorage.setItem('posts-' + this.#usuario, JSON.stringify(posts));
    }


    meusPosts() {
        let postsPessoais = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        let content = '';
        postsPessoais.forEach(i => {
            content += `<div class="feed">
            <div class="head">
                <div class="user">
                    <div class="profile-photo">
                        <img src="./images/profile-19.jpg" alt="">
                    </div>
                    <div class="ingo">
                        <h3>
                        ${this.nome}
                        </h3>
                        <small>São Paulo, 15 MINUTOS ATRÁS</small>
                    </div>
                    <span class="edit">
                        <i class="uil uil-ellipsis-h"></i>
                    </span>
                </div>
            </div>
    
            <div class="photo">
                <img src="${i.imagem}" alt="">
            </div>
            <div class="caption">
                                        <p>
                                            <b></b>${i.txtpost}                                            
                                        </p>
                                    </div>
    
                                    <div class="comment text-muted">
                                        Visualizar todos os 50 comentários
                                    </div>
            </div>`;
        });

        document.getElementById("mostra-feeds").innerHTML = content;
    }


    allPosts() {
        let minhasConexoes = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        let content = '';
        minhasConexoes.forEach(i => {
            let identificadorAmigo = i.useramigo;
            let postsPessoais = JSON.parse(localStorage.getItem('posts-' + identificadorAmigo)) ?? [];

            postsPessoais.forEach(i => {
                content += `<div class="feed">
            <div class="head">
                <div class="user">
                    <div class="profile-photo">
                        <img src="./images/profile-15.jpg" alt="">
                    </div>
                    <div class="ingo">
                        <h3>
                        ${identificadorAmigo}
                        </h3>
                        <small>São Paulo, 15 MINUTOS ATRÁS</small>
                    </div>
                    <span class="edit">
                        <i class="uil uil-ellipsis-h"></i>
                    </span>
                </div>
            </div>
    
            <div class="photo">
                <img src="${i.imagem}" alt="">
            </div>

            <span onclick="curtir(${i.idpost})"><i class="uil uil-heart"></i></span>
            <span><i class="uil uil-comment-dots"></i></span>
            
            <div class="liked-by">
                <span>
                    <img src="https://miro.medium.com/max/1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg"
                        alt="">
                </span>
                <span>
                    <img src="https://razoesparaacreditar.com/wp-content/uploads/2021/05/pesquisa-animais-risada-capa-1068x558.png"
                        alt="">
                </span>
                <p>
                    Curtido por <b>10</b>, <b>Pessoa(s)</b>
                </p>
            </div>

            <div class="caption">
                                        <p>
                                            <b></b>${i.txtpost}                                            
                                        </p>
                                    </div>
    
                                    <div class="comment text-muted">
                                        Visualizar todos os comentários
                                    </div>
            </div>`;

            });
        });
        document.getElementById("mostra-feeds").innerHTML = content;
    }

    conexoes() {
        let amigosAtuais = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        let arrayAmigos = []
        amigosAtuais.forEach(j => {
            arrayAmigos.push(j.useramigo);
        });
        console.log(arrayAmigos);
        let content = '';
        let nomes = Usuario.lerNomeUsuarios();
        nomes.forEach(i => {
            console.log(i.user);
            if (arrayAmigos.includes(i.user)) {
                content += `<div class="feed">${i.nome}<button class="btn btn-primary btn-seguir" onclick="deixarSeguir('${i.user}')">Deixar de Seguir</buton></div>`;
            } else {
                content += `<div class="feed">${i.nome}<button class="btn btn-primary btn-seguir" onclick="seguir('${i.user}')">Seguir</buton></div>`;
            }
        });


        document.getElementById("mostra-feeds").innerHTML = content;
    }
}


let userLogado = JSON.parse(localStorage.getItem('logado'));

if (userLogado != null) {
    //Capturo o e-mail do usuário logado
    logado = userLogado.user;
    var dadosUser = new Usuario(logado);
    dadosUser.lerNomeUsuario(logado);
} else {
    window.location.href = "cadastro.html";
}

//POSTAR 
const btnCadastrarPost = document.getElementById('cadastrarPost');
btnCadastrarPost.addEventListener('click', () => {
    const conteudoPost = document.getElementById('create-post').value;
    let numeroImg = Math.floor(Math.random() * 10 + 1);
    const linkImg = `images/feed-${numeroImg}.jpg`;
    dadosUser.postar(conteudoPost, linkImg);
    document.getElementById('create-post').value = "";
});


//MEUS POSTS 
const linkMeusPost = document.getElementById('meus-posts');

linkMeusPost.addEventListener('click', () => {
    dadosUser.meusPosts();
});


//CONEXÕES
const btnConexoes = document.getElementById('btn-conexoes');
btnConexoes.addEventListener('click', () => {
    dadosUser.conexoes();
});


function seguir(userAmigo) {
    dadosUser.adicionarAmigo = userAmigo;
}

function deixarSeguir(userAmigo) {
    dadosUser.removerAmigo = userAmigo;
}


//HOME
const btnHome = document.getElementById('btn-home');
btnHome.addEventListener('click', () => {
    dadosUser.allPosts();
});


//Carregar no Início
dadosUser.allPosts();

//curtir
function curtir(idpost){
    dadosUser.curtirPost = idpost;
    //alert(idpost);
}

//SAIR
const btnLogoff = document.getElementById('logoff');
btnLogoff.addEventListener('click', () => {
    if(dadosUser.logoff){
        window.location.href = "cadastro.html";
    };
});