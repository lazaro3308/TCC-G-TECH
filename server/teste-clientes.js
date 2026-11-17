
fetch("http://localhost:3000/clientes", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        nome: "Maria Teste",
        email: "maria@teste.com",
        telefone: "38988888888",
        empresa: "Empresa Maria"
    })
})
.then(res => res.json())
.then(dados => {
    console.log(dados);
})
.catch(erro => {
    console.log("Erro:", erro);
});
