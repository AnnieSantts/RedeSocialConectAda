
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
                return;
            }
        });
    }

    static infoUsuario(usuario) {
        return Usuario.lerNomeUsuarios().filter(u => u.user == usuario)[0] ?? {};
    }

    static lerNomeUsuarios() {
        let users = JSON.parse(localStorage.getItem('usuarios')) ?? [];
        return users;
    }

    logoff() {
        localStorage.removeItem('logado');
        return true;
    }

    set adicionarAmigo(useramigo) {
        this.#amigo = useramigo;
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos.push({ 'useramigo': this.#amigo });

        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        this.conexoes();
        this.filtrarAmigos();
    }

    set removerAmigo(nomeamigo) {
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos = amigos.filter(amigo => amigo.useramigo != nomeamigo);

        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        this.conexoes();
        this.filtrarAmigos();
    }

    set curtirPost(idPost) {
        const curtidoPor = this.#usuario;
        let curtidas = JSON.parse(localStorage.getItem('curtidas')) ?? [];
        curtidas.push({ 'curtida': idPost, 'por': curtidoPor });
        localStorage.setItem('curtidas', JSON.stringify(curtidas));
    }

    postar(conteudoPost, linkImg) {
        let idPost = new Date().getTime();
        let posts = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        posts.push({ 'txtpost': conteudoPost, 'imagem': linkImg, 'idpost': idPost, autor: this.#usuario });

        localStorage.setItem('posts-' + this.#usuario, JSON.stringify(posts));
        this.allPosts();
    }

    apagarUsuario(user){

    }

    meusPosts() {
        let content = '';

        let postsPessoais = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        postsPessoais = postsPessoais.sort((a, b) => b.idpost - a.idpost);

        const infoPessoal = Usuario.infoUsuario(this.#usuario);
        postsPessoais.forEach(post => {
            let date = new Date().setTime(post.idpost)
            content += `
            <div class="feed">
                <div class="head">
                    <div class="user">
                        <div class="profile-photo">
                            <img src="./images/${infoPessoal.logo}.jpg" alt="">
                        </div>
                        <div class="ingo">
                            <h3>
                            ${this.nome}
                            </h3>
                            <small>São Paulo, ${this._timeAgo(date)}</small>
                        </div>
                        <span class="edit">
                            <i class="uil uil-ellipsis-h"></i>
                        </span>
                    </div>
                </div>

                <hr class="divider"/>
        
                <div class="caption">
                    <p>
                        <b></b>${post.txtpost.toLowerCase()}                                            
                    </p>
                </div>

                <div class="photo">
                    <img src="${post.imagem}" alt="">
                </div>

                <span onclick="curtir(${post.idpost})"><i class="uil uil-heart size20"></i></span>
                <span><i class="uil uil-comment-dots size20"></i></span>
                
                <div class="comment italic text-muted">
                    Sem atividade no momento
                </div>
            </div>`;
        });

        document.getElementById("mostra-feeds").innerHTML = content;
    }

    allPosts() {
        let content = '';
        let postsGerais = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];


        let recuperaCurtidas = JSON.parse(localStorage.getItem('curtidas')) ?? []


        const minhasConexoes = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        minhasConexoes.forEach(({ useramigo }) => {
            const postDeAmigos = JSON.parse(localStorage.getItem('posts-' + useramigo)) ?? [];
            postsGerais = postsGerais.concat(postDeAmigos);
        });

        postsGerais = postsGerais.sort((a, b) => b.idpost - a.idpost);
        postsGerais.forEach(post => {
            const date = new Date().setTime(post.idpost);
            const { logo, nome } = Usuario.infoUsuario(post.autor);

            let totalCurtidas = 0;
            recuperaCurtidas.forEach(id => {
                if (id.curtida == post.idpost) {
                    totalCurtidas++;
                }
            })

            content += `
            <div class="feed">
                <div class="head">
                    <div class="user">
                        <div class="profile-photo">
                            <img src="./images/${logo}.jpg" alt="">
                        </div>
                        <div class="ingo">
                            <h3>${nome}</h3>
                            <small>São Paulo, ${this._timeAgo(date)} </small>
                        </div>
                        <span class="edit">
                            <i class="uil uil-ellipsis-h"></i>
                        </span>
                    </div>
                </div>
                
                <hr class="divider"/>
    
                <div class="caption">
                    <p>
                        <b></b>${post.txtpost.toLowerCase()}                                            
                    </p>
                </div>

                <div class="photo">
                    <img src="${post.imagem}" alt="">
                </div>

                <span onclick="curtir(${post.idpost})"><i class="uil uil-heart size20"></i></span>
                <span><i class="uil uil-comment-dots size20"></i></span>
                
                <div class="liked-by">
                    <span>
                        <img src="./images/profile-${Math.floor(Math.random() * 20 + 1)}.jpg" alt="">
                    </span>`

            if (totalCurtidas > 1) {
                content += `<span>
                        <img src="./images/profile-${Math.floor(Math.random() * 20 + 1)}.jpg" alt="">
                    </span>`
            }


            content += `<p>
                        Curtido por <b>${totalCurtidas} pessoa(s)</b>
                    </p>
                </div>

                <div class="comment text-muted">
                    Visualizar todos os comentários
                </div>
            </div>`;
        });

        document.getElementById("mostra-feeds").innerHTML = content;
        this.filtrarAmigos();
    }

    filtrarAmigos(nomeAmigo = '') {
        let content = '';
        let amigosAtuais = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigosAtuais = amigosAtuais.map(amigo => amigo.useramigo);

        const displayAmigos = () => {
            if (amigosAtuais.length == 0) {
                return document.getElementById("friendsDiv").innerHTML = `
                    <div class="no-friend italic text-muted">
                        Amigo não encontrado
                    </div>
                `;
            }

            for (const amigo of amigosAtuais) {
                const { logo, nome } = Usuario.infoUsuario(amigo);
                content += `
                    <div class="friend">
                        <div class="profile-photo">
                            <img src="./images/${logo}.jpg" alt="${nome}-profile">
                        </div>
                        <div class="message-body">
                            <h5>${nome}</h5>
                        </div>
                    </div>
                `;
            }

            return document.getElementById("friendsDiv").innerHTML = content;
        };

        if (amigosAtuais.length == 0) {
            return document.getElementById("friendsDiv").innerHTML = `
                <div class="no-friend italic text-muted">
                    Sem amigos no momento, clique em conexões e inicie seu circulo de amizades
                </div>
            `;
        }

        if (nomeAmigo.length == 0) return displayAmigos();

        amigosAtuais = amigosAtuais.filter(amigo => {
            const { nome } = Usuario.infoUsuario(amigo);
            return nome.toLowerCase().includes(nomeAmigo.toLowerCase());
        });
        return displayAmigos();
    }

    conexoes() {
        let amigosAtuais = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigosAtuais = amigosAtuais.map(amigo => amigo.useramigo);

        let content = '';
        let nomes = Usuario.lerNomeUsuarios().filter(p => p.user != userLogado.user);
        nomes.forEach(i => {
            if (amigosAtuais.includes(i.user)) {
                content += `
                <div class="feed flexMiddleCenter">
                    <span class="user w100">${i.nome}</span>
                    <button class="btn btn-primary btn-seguir" onclick="deixarSeguir('${i.user}')">Deixar de seguir</buton>`;
            } else {
                content += `
                <div class="feed flexMiddleCenter">
                    <span class="user w100">${i.nome}</span>
                    <button class="btn btn-primary btn-seguir" onclick="seguir('${i.user}')">Seguir</buton>
                `;
            }
            if (this.#usuario == 'admin@gmail.com') {
                content += `<button class="btn btn-primary btn-seguir" onclick="apagarUsuario('${i.user}')">Apagar Usuário</buton>`;
            }

            content += `</div>`;
        });
        document.getElementById("mostra-feeds").innerHTML = content;
    }

    MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    _getFormattedDate(date, prefomattedDate = false, hideYear = false) {
        const day = date.getDate();
        const month = this.MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();

        if (minutes < 10) {
            // Adding leading zero to minutes
            minutes = `0${minutes}`;
        }

        if (prefomattedDate) {
            // Today at 10:20
            // Yesterday at 10:20
            return `${prefomattedDate} at ${hours}:${minutes}`;
        }

        if (hideYear) {
            // 10. January at 10:20
            return `${day}. ${month} at ${hours}:${minutes}`;
        }

        // 10. January 2017. at 10:20
        return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
    }

    _timeAgo(dateParam) {
        if (!dateParam) return;

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
        const today = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();

        if (seconds < 5) {
            return 'agora';
        } else if (seconds < 60) {
            return `${seconds} segundos atrás`;
        } else if (minutes < 60) {
            return `${minutes} minuto(s) atrás`;
        } else if (isToday) {
            return this._getFormattedDate(date, 'Hoje'); // Today at 10:20
        } else if (isYesterday) {
            return this._getFormattedDate(date, 'Ontem'); // Yesterday at 10:20
        } else if (isThisYear) {
            return this._getFormattedDate(date, false, true); // 10. January at 10:20
        }
        return this._getFormattedDate(date); // 10. January 2017. at 10:20
    }
}

let userLogado = JSON.parse(localStorage.getItem('logado'));
if (userLogado != null) {
    //Capturo o e-mail do usuário logado
    logado = userLogado.user;
    var dadosUser = new Usuario(logado);
    dadosUser.lerNomeUsuario(logado);
} else {
    window.location.href = "index.html";
}

const elProfilePicture = document.querySelectorAll('.user-photo');
const currentUser = Usuario.infoUsuario(userLogado.user);
elProfilePicture.forEach(el => el.src = `./images/${currentUser.logo}.jpg`);

//POSTAR 
const btnCadastrarPost = document.getElementById('cadastrarPost');
btnCadastrarPost.addEventListener('click', () => {
    const conteudoPost = document.getElementById('create-post').value;
    if (conteudoPost.length == 0) return alert('Conteúdo do post não pode estar em branco!');


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
function curtir(idpost) {
    dadosUser.curtirPost = idpost;
    dadosUser.allPosts();
    //alert(idpost);
}

//SAIR
const btnLogoff = document.getElementById('logoff');
btnLogoff.addEventListener('click', () => {
    if (dadosUser.logoff) {
        window.location.href = "index.html";
    };
});


//Apagar Usuário
function apagarUsuario(user) {
    dadosUser.removerUser = user;
}

