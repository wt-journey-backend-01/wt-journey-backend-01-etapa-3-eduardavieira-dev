const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *         - agente_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do caso (gerado automaticamente)
 *         titulo:
 *           type: string
 *           minLength: 1
 *           description: Título do caso
 *         descricao:
 *           type: string
 *           minLength: 1
 *           description: Descrição detalhada do caso
 *         status:
 *           type: string
 *           enum: [aberto, solucionado]
 *           description: Status atual do caso
 *         agente_id:
 *           type: integer
 *           description: ID do agente responsável pelo caso
 *       example:
 *         id: 1
 *         titulo: "Furto de veículo"
 *         descricao: "Veículo furtado no estacionamento do shopping"
 *         status: "aberto"
 *         agente_id: 1
 */

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Gerenciamento de casos policiais
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Listar todos os casos
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         description: Filtrar casos por status
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Buscar casos por termo no título ou descrição
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', casosController.getCasos);

/**
 * @swagger
 * /casos/search:
 *  get:
 *    summary: Retorna uma lista de casos
 *    description: Retorna uma lista de casos com base no termo de pesquisa
 *    tags: [Casos]
 *    parameters:
 *      - name: q
 *        in: query
 *        required: false
 *        schema:
 *          type: string
 *          example: Roubo no banco
 *    responses:
 *      200:
 *        description: Lista de casos
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Caso'
 *      404:
 *        description: Nenhum caso encontrado para o termo pesquisado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: 404
 *                message:
 *                  type: string
 *                  example: Nenhum caso encontrado para a busca especificada
 *                errors:
 *                  type: string
 *                  example: []
 */
router.get('/search', casosController.filter);
/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Buscar agente responsável por um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id/agente', casosController.getAgenteDoCaso);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Buscar caso por ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', casosController.getCasoById);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Criar um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *                 default: aberto
 *               agente_id:
 *                 type: string
 *             example:
 *               titulo: "Roubo de celular"
 *               descricao: "Celular roubado na região central"
 *               status: "aberto"
 *               agente_id: 1
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualizar caso completo
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *             example:
 *               titulo: "Caso atualizado"
 *               descricao: "Nova descrição do caso"
 *               status: "solucionado"
 *               agente_id: 1
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', casosController.updateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualizar caso parcialmente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *             example:
 *               status: "solucionado"
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id', casosController.partialUpdateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Deletar um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', casosController.deleteCaso);

// Exporta o router para ser usado no servidor principal
module.exports = router;
