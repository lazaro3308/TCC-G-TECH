const conexao = require("../config/database");

// CADASTRAR CHAMADO
async function criarChamado(req, res) {
    try {
        const { empresa, email, problema, prioridade } = req.body;

        // Validação dos campos
        if (!empresa || !email || !problema || !prioridade) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        const sql = `
            INSERT INTO chamados
            (empresa, email, problema, prioridade)
            VALUES (?, ?, ?, ?)
        `;

        const [resultado] = await conexao.execute(sql, [
            empresa,
            email,
            problema,
            prioridade
        ]);

        return res.status(201).json({
            mensagem: "Chamado criado com sucesso!",
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar chamado."
        });
    }
}

// LISTAR CHAMADOS
async function listarChamados(req, res) {
    try {
        const [chamados] = await conexao.execute(
            "SELECT * FROM chamados ORDER BY criado_em DESC"
        );

        return res.status(200).json(chamados);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar chamados."
        });
    }
}

module.exports = {
    criarChamado,
    listarChamados
};