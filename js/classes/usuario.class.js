
class Usuario {
    #usuario;
    nome;

    constructor() {
        const { user } = JSON.parse(localStorage.getItem('logado'));
        this.#usuario = user;
    }

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

    adicionarAmigo(useramigo) {
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos.push({ 'useramigo': useramigo });

        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        this.conexoes();
        this.filtrarAmigos();
    }

    removerAmigo(nomeamigo) {      
        let amigos = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigos = amigos.filter(amigo => amigo.useramigo != nomeamigo);

        localStorage.setItem('amigos-' + this.#usuario, JSON.stringify(amigos));
        this.conexoes();
        this.filtrarAmigos();
    }

    filtrarAmigos(nomeAmigo = '') {
        let content = '';
        let amigosAtuais = JSON.parse(localStorage.getItem('amigos-' + this.#usuario)) ?? [];
        amigosAtuais = amigosAtuais.map(amigo => amigo.useramigo);

        const displayAmigos = () => {
            if(amigosAtuais.length == 0) {
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
        
        if(amigosAtuais.length == 0) {
            return document.getElementById("friendsDiv").innerHTML = `
                <div class="no-friend italic text-muted">
                    Sem amigos no momento, clique em conexões e inicie seu circulo de amizades
                </div>
            `;
        }

        if(nomeAmigo.length == 0) return displayAmigos();

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
                    <button class="btn btn-primary btn-seguir" onclick="deixarSeguir('${i.user}')">Deixar de seguir</buton>
                </div>`;
            } else {
                content += `
                <div class="feed flexMiddleCenter">
                    <span class="user w100">${i.nome}</span>
                    <button class="btn btn-primary btn-seguir" onclick="seguir('${i.user}')">Seguir</buton>
                </div>`;
            }
        });

        document.getElementById("mostra-feeds").innerHTML = content;
    }

    removerUser(user) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) ?? [];
        let userRestante = [];
        usuarios.forEach(i => {
            if (i.user != user) {
                userRestante.push({ 'nome': i.nome, 'user': i.user, 'senha': i.senha, 'tipo': i.tipo });
            }

        })
        localStorage.setItem('usuarios', JSON.stringify(userRestante));
    }
}
