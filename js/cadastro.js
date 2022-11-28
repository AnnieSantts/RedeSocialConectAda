// CADASTRO USUÁRIO
const btnCadastro = document.getElementById('btn-cadastro');
btnCadastro.onclick = () => {
    document.getElementById('main-login').style.display = 'none';
    document.getElementById('main-cadastro').style.display = 'block';
}

const btnCadastrarNewUSer = document.getElementById('botaoCadastro');
btnCadastrarNewUSer.onclick = () => {
    const nome = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('usuarioLogin').value;
    const senha = document.getElementById('senhaLogin').value;
    const repetesenha = document.getElementById('confirmarSenha').value;

    new Cadastro(nome, email, senha, repetesenha).adicionarUsuario();
}

// LOGIN USUÁRIO
document.getElementById("botaoLogin").onclick = (e) => {
    e.preventDefault();

    const loginDigitado = document.getElementById("usuarioLogar").value;
    const senhaDigitada = document.getElementById("senhaLogar").value;

    const isAutenticado = new Autenticador(loginDigitado, senhaDigitada).autenticarUsuario();

    if (!isAutenticado) return alert("Login incorreto");
    window.location.href = "./pagina-inicial.html";
};

// VALIDAÇÃO
if(localStorage.getItem('usuarios') == null) {
    localStorage.setItem('usuarios', JSON.stringify(
        [
            { "nome": "Admin", "user": "admin@gmail.com", "senha": "admin", "logo" : "profile-9", "tipo": "admin" },
            { "nome": "Helade", "user": "helade@gmail.com", "senha": "helade", "logo" : "profile-20", "tipo": "user" },
            { "nome": "Andre", "user": "andre@gmail.com", "senha": "andre", "logo" : "profile-11", "tipo": "user" },
            { "nome": "Annie", "user": "annie@gmail.com", "senha": "annie", "logo" : "profile-6", "tipo": "user" },
            { "nome": "Nathalia", "user": "nathalia@gmail.com", "senha": "nathalia", "logo" : "profile-5", "tipo": "user" },
            { "nome": "Joao", "user": "joao@gmail.com", "senha": "joao", "logo" : "profile-8", "tipo": "user" }
        ]
    ));
}

if(localStorage.getItem('logado') != null) {
    window.location.href = "./pagina-inicial.html";
}