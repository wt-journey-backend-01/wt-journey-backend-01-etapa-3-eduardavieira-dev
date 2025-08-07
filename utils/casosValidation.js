const { z } = require('zod');
const { formatZodError } = require('./zodErrorFormatter');

const casoSchema = z.object({
  titulo: z.string({
    required_error: 'Título é obrigatório',
  })
    .trim()
    .min(1, { message: 'Título não pode estar vazio' })
    .max(200, { message: 'Título deve ter no máximo 200 caracteres' }),

  descricao: z.string({
    required_error: 'Descrição é obrigatória',
  })
    .trim()
    .min(1, { message: 'Descrição não pode estar vazia' })
    .max(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' }),

  status: z.string()
    .optional()
    .transform(status => (status ?? 'aberto').toLowerCase())
    .refine(status => ['aberto', 'solucionado'].includes(status), {
      message: 'Status deve ser "aberto" ou "solucionado"',
    }),

  agente_id: z.coerce.number({
    required_error: 'ID do agente é obrigatório',
    invalid_type_error: 'Id inválido'
  })
    .int({ message: 'Id inválido' })
    .positive({ message: 'Id inválido' })
});

module.exports = { casoSchema, formatZodError };