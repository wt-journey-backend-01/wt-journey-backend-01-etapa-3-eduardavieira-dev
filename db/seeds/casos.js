/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Limpa as tabelas antes de inserir dados novos
  await knex('casos').del();

  // Insere casos usando IDs conhecidos dos agentes
  await knex('casos').insert([
    {
      titulo: 'Roubo no banco',
      descricao: 'Roubo a mão armada no banco central',
      status: 'aberto',
      agente_id: 1 // João Gonçalves (investigador)
    },
    {
      titulo: 'Furto de veículos',
      descricao: 'Vários veículos furtados na cidade',
      status: 'solucionado',
      agente_id: 2 // Ana Pereira (delegada)
    },
    {
      titulo: 'Assalto à residência',
      descricao: 'Invasão de domicílio com furto de objetos',
      status: 'aberto',
      agente_id: 1 // João Gonçalves (investigador)
    }
  ]);
  
  console.log('✅ Casos inseridos com sucesso!');
};
