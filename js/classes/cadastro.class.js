class Cadastro {
    #nome;
    #email;
    #senha;
    #repetesenha;

    constructor(nome, email, senha, repetesenha) {
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#repetesenha = repetesenha;
    }

    adicionarUsuario() {
        if (this.#senha.length <= 3) return alert('Sua senha precisa de pelo menos 4 caracteres');
        if (this.#senha != this.#repetesenha) return alert('Senha digitadas não conferem');

        const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) ?? [];
        const usuarioExiste = usuariosCadastrados.find((item) => {
            return item.user == this.#email;
        });

        if (usuarioExiste) return alert('Email já cadastrado');
        
        //Passou nas validações
        usuariosCadastrados.push({
            nome: this.#nome,
            user: this.#email,
            senha: this.#senha,
            tipo: 'user',
            logo: `profile-${Math.floor(Math.random() * 20 + 1)}`
        });

        localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados))
        alert('Usuário cadastrado com sucesso')
        
        document.getElementById('main-login').style.display = 'block';
        document.getElementById('main-cadastro').style.display = 'none';
    }
}
