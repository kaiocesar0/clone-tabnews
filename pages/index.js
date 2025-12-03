import { useState } from "react";

function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nome:", nome);
    console.log("Email:", email);
    // Aqui você pode adicionar a lógica para enviar os dados
  };

  return (
    <div>
      <h1>Olá Mundo</h1>
      <p>Este é um parágrafo</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Home;
