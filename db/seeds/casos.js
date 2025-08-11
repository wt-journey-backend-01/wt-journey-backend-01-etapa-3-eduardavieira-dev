/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Limpa as tabelas antes de inserir dados novos
  await knex('casos').del();

  // Insere casos, referenciando agentes pelos ids (1 e 2)
  await knex('casos').insert([
    {
      titulo: 'Roubo no banco',
      descricao: 'Roubo a mão armada no banco central',
      status: 'aberto',
      agente_id: 1
    },
    {
      titulo: 'Furto de veículos',
      descricao: 'Vários veículos furtados na cidade',
      status: 'solucionado',
      agente_id: 2
    },
  ]);
};
