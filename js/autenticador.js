class Autenticador {
    #emailUsuarioDigitado;
    #senhaDigitada;
    logado = false;

    constructor(emailUsuarioDigitado, senhaDigitada) {
        this.#emailUsuarioDigitado = emailUsuarioDigitado;
        this.#senhaDigitada = senhaDigitada;
    }

    autenticarUsuario() {
        // Coleta usuários salvos no localStorage e converte em um objeto
        let usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) ?? [];

        const usuarioExiste = usuariosCadastrados.find((item) => {
            return item.user == this.#emailUsuarioDigitado && item.senha == this.#senhaDigitada;
        });

        if(usuarioExiste) {
            this.logado = true;

            localStorage.setItem('logado', JSON.stringify(
                { 'user': this.#emailUsuarioDigitado }
            ));
        }

        return this.logado;
    }
}

const autenticarLoginDigitado = (e) => {
    e.preventDefault() //impede a página de recarregar quando o usuário dá submit

    // Recupera o valor digitado no campo de login do formulário de login
    let loginDigitado = document.getElementById("usuarioLogar").value

    // Recupera o valor digitado no campo de senha do formulário de login
    let senhaDigitada = document.getElementById("senhaLogar").value

    // Cria uma instância da classe autenticador que é responsável por autenticar o usuário
    let autenticador = new Autenticador(loginDigitado, senhaDigitada);

    // Chama o método autenticarUsuario para validar se existe um usuário com o login e senha informados
    let isAutenticado = autenticador.autenticarUsuario();

    // Usa o retorno da função autenticarUsuario salvo na variável isAutenticado para verificar se o login foi bem sucedido
    if (isAutenticado) {
        // Redireciona a página para o index
        window.location.href = "./pagina-inicial.html";
        //alert('OK');
    } else {
        alert("Login incorreto")
    }
}

document.querySelector("#botaoLogin").onclick = autenticarLoginDigitado;