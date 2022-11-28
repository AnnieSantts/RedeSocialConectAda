
    
let users = JSON.parse(localStorage.getItem('usuarios')) ?? [];
console.log(users);
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
    }

    set removerAmigo(nomeamigo) {      
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        
        const index = amigos.findIndex(amigo => amigo.useramigo == nomeamigo);
        amigos = amigos.slice(1, index);

        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        this.conexoes();
    }

    set curtirPost(idPost){
        const curtidoPor = this.#usuario;
        let curtidas = JSON.parse(localStorage.getItem('curtidas')) ?? [];
        curtidas.push({ 'curtida': idPost, 'por': curtidoPor });
        localStorage.setItem('curtidas', JSON.stringify(curtidas));
    }

    isPostCurtido(idPost){
        const curtidoPor = this.#usuario;
        let curtidas = JSON.parse(localStorage.getItem('curtidas'))?? [];
        return curtidas.some(i => i.curtida == idPost);
    }

    postar(conteudoPost) { 
        let idPost = new Date().getTime();
        let posts = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        posts.push({ 'txtpost': conteudoPost, 'imagem': linkImg, 'idpost': idPost });
        localStorage.setItem('posts-' + this.#usuario, JSON.stringify(posts));
        this.meusPosts();
    }

    // comentar(conteudoComentario) { 
    //     let idComentario = new Date().getTime();
    //     let comentarios = JSON.parse(localStorage.getItem('comentarios-' + this.#usuario)) ?? [];
    //     comentario.push({ 'txtcomentario': conteudoComentario, 'idcomentario': idComentario });
    //     localStorage.setItem('comentarios-' + this.#usuario, JSON.stringify(comentarios));
    //     this.meusComentarios();
    // }


    meusPosts() {
        let content = '';

        let postsPessoais = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        postsPessoais = postsPessoais.sort((a, b) => b.idpost - a.idpost);
        postsPessoais.forEach(i => {
            let date = new Date().setTime(i.idpost)
            content += `
            <div class="feed">
                <div class="head">
                    <div class="user">
                        <div class="profile-photo">
                            <img src="./images/profile-19.jpg" alt="">
                        </div>
                        <div class="ingo">
                            <h3>
                            ${this.nome}
                            </h3>
                            <small>São Paulo, ${this._timeAgo(date)}</small>
                        </div>
                        <span class="edit">
                            <i class="uil uil-edit"></i>
                            <i class="uil uil-trash"></i>
                        </span>
                    </div>
                </div>
        
                <div class="photo">
                    <img src="${i.imagem}" alt="">
                </div>

                <span onclick="curtir(${i.idpost})"><i class="uil uil-heart" id="curtir"></i></span>
              
                
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
                <form action="" class="create-comentario">
                <div class="profile-photo">
                    <img src="images/profile-19.jpg">
                </div>
                <input type="text" placeholder="Digite aqui seu comentário" id="create-comentario">
                <input type="button" value="Comentar" class="btn btn-primary" id="comentarPost">
            </form>
                </div>
            </div>`;
        });

        document.getElementById("mostra-feeds").innerHTML = content;
    }

    allPosts() {
        this.meusPosts();
        let content = document.getElementById("mostra-feeds").innerHTML;

        let minhasConexoes = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        minhasConexoes.forEach(amigo => {
            let identificadorAmigo = amigo.useramigo;
            let postDeAmigos = JSON.parse(localStorage.getItem('posts-' + identificadorAmigo)) ?? [];
            
            postDeAmigos.forEach(post => {
                let date = new Date().setTime(post.idpost)
                content += `
                <div class="feed">
                    <div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="./images/profile-15.jpg" alt="">
                            </div>
                            <div class="ingo">
                                <h3>
                                ${identificadorAmigo}
                                </h3>
                                <small>São Paulo, ${this._timeAgo(date)} </small>
                            </div>
                            <span class="edit">
                                <i class="uil uil-ellipsis-h"></i>
                            </span>
                        </div>
                    </div>
            
                    <div class="photo">
                        <img src="${post.imagem}" alt="">
                    </div>

                    <span onclick="curtir(${post.idpost})"><i class="uil uil-heart"></i></span>
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
                            <b></b>${post.txtpost}                                            
                        </p>
                    </div>


                    <div class="comment text-muted"> 
                    <form action="" class="create-post">
                    <div class="profile-photo">
                        <img src="images/profile-19.jpg">
                    </div>
                    <input type="text" placeholder="Digite aqui seu comentário" id="create-comentario">
                    <input type="button" value="Comentar" class="btn btn-primary" id="comentarPost">
                </form>
                    </div>
                </div>`;
            });
        });
        document.getElementById("mostra-feeds").innerHTML = content;
    }

    conexoes() {
        let amigosAtuais = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        let arrayAmigos = []
        amigosAtuais.forEach(amigo => {
            arrayAmigos.push(amigo.useramigo);
        });

        let content = '';
        let nomes = Usuario.lerNomeUsuarios().filter(p => p.user != userLogado.user);
        nomes.forEach(i => {
            if (arrayAmigos.includes(i.user)) {
                content += `
                <div class="feed flexMiddleCenter">
                    <span class="user w100">${i.nome}</span>
                    <button class="btn btn-primary btn-seguir" onclick="deixarSeguir('${i.user}')">Deixar de seguir</buton>
                    <button class="btn btn-primary btn-seguir" onclick="apagarUsuario('${i.user}')">Apagar Usuário</buton>
                </div>`;
            } else {
                content += `
                <div class="feed flexMiddleCenter">
                    <span class="user w100">${i.nome}</span>
                    <button class="btn btn-primary btn-seguir" onclick="seguir('${i.user}')">Seguir</buton>
                    <button class="btn btn-primary btn-seguir" onclick="apagarUsuario('${i.user}')">Apagar Usuário</buton>
                </div>`;
            }
        });

        document.getElementById("mostra-feeds").innerHTML = content;
    }

    get isAdmin() {
        let userLogado = JSON.parse(localStorage.getItem('logado'));
        return userLogado.user === 'admin@gmail.com';
    } 

    apagarUsuario(usuarioId){
        if(this.isAdmin){
            this.#apagarUsuario(usuarioId);
        }
    }
    #apagarUsuario(usuarioId){
        let users = JSON.parse(localStorage.getItem('usuarios')) ?? [];
        users.forEach(user =>{
            if(user.user === usuarioId){
                const index = users.indexOf(user);
                users.splice(index, 1);
                
            }
      })
      localStorage.setItem('usuarios', JSON.stringify(users));
      return;
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
          minutes = `0${ minutes }`;
        }
      
        if (prefomattedDate) {
          // Today at 10:20
          // Yesterday at 10:20
          return `${ prefomattedDate } at ${ hours }:${ minutes }`;
        }
      
        if (hideYear) {
          // 10. January at 10:20
          return `${ day }. ${ month } at ${ hours }:${ minutes }`;
        }
      
        // 10. January 2017. at 10:20
        return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
      }
      _timeAgo(dateParam) {
        if (!dateParam) {
          return null;
        }
      
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
          return `${ seconds } segundos atrás`;
        } else if (minutes < 60) {
          return `${ minutes } minuto(s) atrás`;
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

//POSTAR 
const btnCadastrarPost = document.getElementById('cadastrarPost');
btnCadastrarPost.addEventListener('click', () => {
    const conteudoPost = document.getElementById('create-post').value;
    if(conteudoPost.length == 0) return alert('Conteúdo do post não pode estar em branco!');

    let numeroImg = Math.floor(Math.random() * 10 + 1);
    const linkImg = `images/feed-${numeroImg}.jpg`;
    dadosUser.postar(conteudoPost, linkImg);
    document.getElementById('create-post').value = "";
});

//COMENTARIOS 
// const btnComentar = document.getElementById('comentarPost');
// btnComentar.addEventListener('click', () => {
//     const conteudoComentario = document.getElementById('create-comentario').value;
//     if(conteudoComentario.length == 0) return alert('Conteúdo do comentario não pode estar em branco!');

//     dadosUser.comentar(conteudoComentario);
//     document.getElementById('create-comentario').value = "";
// });


//MEUS POSTS 
const linkMeusPost = document.getElementById('meus-posts');

linkMeusPost.addEventListener('click', () => {
    dadosUser.meusPosts();
});

//EDITAR POSTS
// const btnEditar = document.getElementById('btn-editar');
// btnEditar.addEventListener('click', () => {
// });

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

//CURTIR_POST

const btnCurtir = document.getElementById('curtir');
btnCurtir.addEventListener('click', () => {
    console.log('curtir');
});

// function curtir(idpost){
//     dadosUser.curtirPost = idpost;
//     if (btnCurtir.addEventListener('click', () => {{
//         content =+`<i class="uil uil-heart style="color:red"></i>`
//     }})) 
//     //alert(idpost);
// };

//SAIR
const btnLogoff = document.getElementById('logoff');
btnLogoff.addEventListener('click', () => {
    if(dadosUser.logoff){
        window.location.href = "index.html";
    };
});