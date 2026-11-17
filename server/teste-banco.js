
const conexao = require("./database/conexao");

conexao.query("SELECT 1 + 1 AS resultado", (erro, resultados) => {
    if (erro) {
        console.log("Erro na consulta:", erro.message);
        return;
    }

    console.log("Resultado:", resultados[0].resultado);

    conexao.end();
});
