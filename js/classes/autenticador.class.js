class Autenticador {
    #emailUsuarioDigitado;
    #senhaDigitada;
    logado = false;

    constructor(emailUsuarioDigitado, senhaDigitada) {
        this.#emailUsuarioDigitado = emailUsuarioDigitado;
        this.#senhaDigitada = senhaDigitada;
    }

    autenticarUsuario() {
        const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) ?? [];
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
