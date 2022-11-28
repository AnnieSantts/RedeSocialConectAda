class Postagem {
    #usuario;

    constructor() {
        const { user } = JSON.parse(localStorage.getItem('logado'));
        this.#usuario = user;
    }

    curtirPost(idPost){
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

    comentarPost(post) {
        const comment = document.getElementById('txt-comentario-' + post).value;
        let comentarios = JSON.parse(localStorage.getItem('comentario-' + post)) ?? [];

        comentarios.push({ 'comentario': comment, autor: this.#usuario });
        localStorage.setItem('comentario-' + post, JSON.stringify(comentarios));
        this.allPosts();
    }

    removerPostagem(idPost) {
        let postagens = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        let postagensRestante = [];
        postagens.forEach(p => {
            if (p.idpost != idPost) {
                postagensRestante.push({ 'txtpost': p.txtpost, 'imagem': p.imagem, 'idpost': p.idpost, 'autor': p.autor });
            }
        })
        localStorage.setItem('posts-' + this.#usuario, JSON.stringify(postagensRestante));
    }

    meusPosts() {
        let content = '';

        let postsPessoais = JSON.parse(localStorage.getItem('posts-' + this.#usuario)) ?? [];
        postsPessoais = postsPessoais.sort((a, b) => b.idpost - a.idpost);

        let recuperaCurtidas = JSON.parse(localStorage.getItem('curtidas')) ?? [];

        const infoPessoal = Usuario.infoUsuario(this.#usuario);
        postsPessoais.forEach(post => {
            let totalCurtidas = 0;
            recuperaCurtidas.forEach(id => {
                if (id.curtida == post.idpost) {
                    totalCurtidas++;
                }
            })
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
                            ${infoPessoal.nome}
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

                    <span onclick="excluirPostagem(${post.idpost})"><i class="uil uil-trash size20"></i></span>
                <div class="liked-by"> `;

            for (let ct = 0; ct < totalCurtidas; ct++) {
                if (ct < 11) {
                    content += `<span>
                    <img src="./images/profile-${Math.floor(Math.random() * 20 + 1)}.jpg" alt="">
                </span>`
                }
            }

            content += `<p>
                        Curtido <b>${totalCurtidas} vezes(s)</b>
                    </p>
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

                <span onclick="curtir(${post.idpost})"><i class="uil uil-heart size20" id="coracao-${post.idpost}></i></span>
                <span><i class="uil uil-comment-dots size20"></i></span>
                
                <div class="liked-by"> `

            for (let ct = 0; ct < totalCurtidas; ct++) {
                if (ct < 11) {
                    content += `<span>
                    <img src="./images/profile-${Math.floor(Math.random() * 20 + 1)}.jpg" alt="">
                </span>`
                }
            }

            content += `<p>
                        Curtido <b>${totalCurtidas} vezes(s)</b>
                    </p>
                </div>
                
                <div class="comment text-muted ">                                 
                    <input type="text" placeholder="Digite aqui seu comentário" id="txt-comentario-${post.idpost}" style="width:300px;">
                    <input type="button" value="Comentar" class="btn btn-primary" onclick="comentarPost(${post.idpost})">                
            </div>           

            `;

            content += `<div class="comment text-muted w100">
            Comentários Recebidos
        </div>`;

            let comentarios = JSON.parse(localStorage.getItem('comentario-' + post.idpost)) ?? [];
            comentarios.forEach(coment => {
                let txtComentario = coment.comentario;
                content += `<div class="comment w100">${txtComentario}</div>`;
            });

            content += `</div>`;
        });

        document.getElementById("mostra-feeds").innerHTML = content;
        new Usuario().filtrarAmigos();
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