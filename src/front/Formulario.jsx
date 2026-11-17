
import { useState } from "react";

function Formulario() {
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState("");

  async function enviar(evento) {
    evento.preventDefault();

    const chamado = {
      empresa,
      email,
      nivel
    };

    try {
      const resposta = await fetch(
        "http://localhost:3000/chamados",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(chamado)
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao enviar");
      }

      console.log("Chamado recebido:", resultado);
      alert(resultado.mensagem);

    } catch (erro) {
      console.log("Erro ao enviar:", erro);
      alert("Não foi possível enviar o chamado.");
    }
  }

  return (
    <div className="container">
      <h2>Abertura de Chamado</h2>

      <form onSubmit={enviar}>
        <label>Nome da empresa:</label>

        <input
          type="text"
          placeholder="Digite o nome da empresa"
          value={empresa}
          onChange={(evento) =>
            setEmpresa(evento.target.value)
          }
          required
        />

        <label>E-mail empresarial:</label>

        <input
          type="email"
          placeholder="empresa@email.com"
          value={email}
          onChange={(evento) =>
            setEmail(evento.target.value)
          }
          required
        />

        <h3>Nível do problema:</h3>

        {["Normal", "Médio", "Urgente"].map((opcao) => (
          <label key={opcao}>
            <input
              type="radio"
              name="nivel"
              value={opcao}
              checked={nivel === opcao}
              onChange={(evento) =>
                setNivel(evento.target.value)
              }
              required
            />
            {opcao}
          </label>
        ))}

        <button type="submit">
          Enviar chamado
        </button>
      </form>
    </div>
  );
}

export default Formulario;
