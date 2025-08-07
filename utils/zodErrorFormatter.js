/**
 * Utilitário para formatação de erros do Zod
 * Centraliza a lógica de formatação para manter consistência em toda a aplicação
 */

/**
 * Formata erros do Zod de forma padronizada e amigável
 * @param {ZodError} error - Erro do Zod a ser formatado
 * @returns {Object} Objeto com erro formatado
 */
const formatZodError = (error) => {
    if (!error.errors || !Array.isArray(error.errors)) {
        return {
            status: 'error',
            statusCode: 400,
            message: 'Dados inválidos fornecidos',
            errors: [{
                campo: 'unknown',
                mensagem: error.message || 'Erro de validação',
                valorRecebido: 'N/A'
            }]
        };
    }

    const formattedErrors = error.errors.map(err => {
        const field = err.path ? err.path.join('.') : 'unknown';
        return {
            campo: field,
            mensagem: err.message || 'Erro de validação',
            valorRecebido: err.input || err.received || 'N/A'
        };
    });

    return {
        status: 'error',
        statusCode: 400,
        message: 'Dados inválidos fornecidos',
        errors: formattedErrors
    };
};

module.exports = { formatZodError };
