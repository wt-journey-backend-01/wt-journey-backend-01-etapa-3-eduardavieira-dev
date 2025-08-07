/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Limpa as tabelas antes de inserir dados novos
  await knex('casos').del();
  await knex('agentes').del();

  // Insere agentes
  await knex('agentes').insert([
    { nome: 'João Gonçalves', dataDeIncorporacao: '2020-01-15', cargo: 'Investigador' },
    { nome: 'Ana Pereira', dataDeIncorporacao: '2018-06-20', cargo: 'Delegada' },
  ]);

  // Insere casos, referenciando agentes pelos ids (1 e 2)
  await knex('casos').insert([
    { titulo: 'Roubo no banco', descricao: 'Roubo a mão armada no banco central', status: 'aberto', agente_id: 1 },
    { titulo: 'Furto de veículos', descricao: 'Vários veículos furtados na cidade', status: 'solucionado', agente_id: 2 },
  ]);
};
