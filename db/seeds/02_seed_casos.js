/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Limpa as tabelas antes de inserir dados novos
  await knex('casos').del();

  const agentes = await knex('agentes').select('*');

  const agente1 = agentes.find(a => a.nome === 'João Gonçalves');
  const agente2 = agentes.find(a => a.nome === 'Ana Pereira');

  if (!agente1 || !agente2) {
  console.error('Agentes encontrados:', agentes.map(a => a.nome));
  throw new Error('Agentes necessários não encontrados. Verifique os seeds.');
  }


  // Insere casos, referenciando agentes pelos ids (1 e 2)
  await knex('casos').insert([
    { titulo: 'Roubo no banco', descricao: 'Roubo a mão armada no banco central', status: 'aberto', agente_id: agente1.id },
    { titulo: 'Furto de veículos', descricao: 'Vários veículos furtados na cidade', status: 'solucionado', agente_id: agente2.id },
  ]);
};
