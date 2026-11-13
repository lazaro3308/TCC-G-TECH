const express = require("express");

const router = express.Router();

const {
    criarChamado,
    listarChamados
} = require("../controllers/chamadosController");

// Rota para receber solicitações
router.post("/", criarChamado);

// Rota para listar solicitações
router.get("/", listarChamados);

module.exports = router;