fetch("http://localhost:3000/chamados", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        title: "Computador não liga",
        category: "Hardware",
        priority: "Urgente",
        description: "O computador não está iniciando."

    })

})
.then(res => res.json())
.then(dados => console.log(dados))
.catch(erro => console.log(erro));