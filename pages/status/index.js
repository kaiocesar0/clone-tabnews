import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt({ isLoading, data }) {
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatusInformation({ isLoading, data }) {
  let databaseText = "Carregando...";

  if (!isLoading && data) {
    const database = data.dependencies.database;
    databaseText = (
      <>
        <div>Versão: {database.version}</div>
        <div>Máximo de conexões: {database.max_connections}</div>
        <div>Conexões abertas: {database.opened_connections}</div>
      </>
    );
  }

  return <>{databaseText}</>;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} />
      <h2>Banco de dados</h2>
      <DatabaseStatusInformation isLoading={isLoading} data={data} />
    </>
  );
}
