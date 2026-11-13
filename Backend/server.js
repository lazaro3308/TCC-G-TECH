
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.post("/chamados", (req, res) => {

    console.log("Novo chamado recebido:");

    const { title, category, priority, description } = req.body;

    console.log("Título:", title);
    console.log("Categoria:", category);
    console.log("Prioridade:", priority);
    console.log("Descrição:", description);

    res.status(201).json({
        mensagem: "Chamado recebido com sucesso!"
    });

});
app.listen(3000, () => {
    console.log("Servidor funcionando na porta 3000");
});
