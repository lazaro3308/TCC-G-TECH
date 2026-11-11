
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Receber chamados do formulário
app.post("/chamados", (req, res) => {

    const { empresa, email, problema } = req.body;

    console.log("Empresa:", empresa);
    console.log("Email:", email);
    console.log("Problema:", problema);

    res.status(201).json({
        mensagem: "Chamado recebido com sucesso!",
        chamado: {
            empresa,
            email,
            problema
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
