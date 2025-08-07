const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    // Zod
    if (err instanceof require('zod').ZodError) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Dados inválidos.',
            errors: err.errors
        });
    }

    // ApiError personalizado
    if (err.name === 'ApiError') {
        return res.status(err.statusCode || 500).json({
            status: 'error',
            statusCode: err.statusCode || 500,
            message: err.message || 'Erro inesperado.'
        });
    }

    // Genérico
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Erro interno do servidor.'
    });
};

module.exports = errorHandler;