const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Agente:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do agente (gerado automaticamente)
 *         nome:
 *           type: string
 *           minLength: 2
 *           description: Nome completo do agente
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *           description: Data de incorporação do agente
 *         cargo:
 *           type: string
 *           minLength: 2
 *           description: Cargo do agente
 *       example:
 *         id: 1
 *         nome: "João Silva"
 *         dataDeIncorporacao: "2022-01-15"
 *         cargo: "Investigador"
 */

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Gerenciamento de agentes do departamento de polícia
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Listar todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         description: Filtrar agentes por cargo
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao, -dataDeIncorporacao]
 *         description: Ordenar agentes por data de incorporação (dataDeIncorporacao = crescente, -dataDeIncorporacao = decrescente)
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', agentesController.getAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Buscar agente por ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', agentesController.getAgenteById);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Criar um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 minLength: 2
 *             example:
 *               nome: "João Silva"
 *               dataDeIncorporacao: "2022-01-15"
 *               cargo: "Investigador"
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualizar agente completo
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 minLength: 2
 *             example:
 *               nome: "João Silva Atualizado"
 *               dataDeIncorporacao: "2022-01-15"
 *               cargo: "Delegado"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', agentesController.updateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualizar agente parcialmente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 minLength: 2
 *             example:
 *               cargo: "Delegado"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id', agentesController.partialUpdateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Deletar um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     responses:
 *       204:
 *         description: Agente deletado com sucesso
 *       404:
 *         description: Agente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', agentesController.deleteAgente);

// Exporta o router para ser usado no servidor principal
module.exports = router;