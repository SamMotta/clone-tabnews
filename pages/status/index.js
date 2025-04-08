import useSWR from 'swr';

async function fetchAPI(key) {
  const response = await fetch(key);
  const body = await response.json();
  return body;
}

function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAt = <p>Última atualização: Carregando...</p>;

  if (!isLoading && data) {
    const updatedAtText = new Date(data.updated_at).toLocaleString('pt-BR');

    updatedAt = <p>Última atualização: {updatedAtText}</p>;
  }

  return updatedAt;
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  let statusText = (
    <>
      <p>Versão do banco de dados: Carregando...</p>
      <p>Conexões abertas: Carregando...</p>
    </>
  );

  if (!isLoading && data) {
    const dbVersion = data.dependencies.database.version;

    const { max_connections, opened_connections } = data.dependencies.database;
    const connectionsText = `${opened_connections} de ${max_connections}`;

    statusText = (
      <>
        <p>Versão do banco de dados: {dbVersion}</p>
        <p>Conexões abertas: {connectionsText}</p>
      </>
    );
  }

  return (
    <div>
      <h2>Status do banco de dados</h2>
      {statusText}
    </div>
  );
}

export default StatusPage;
