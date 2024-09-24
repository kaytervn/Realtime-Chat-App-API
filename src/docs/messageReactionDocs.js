/**
 * @swagger
 * tags:
 *   name: MessageReaction
 *   description: Message reaction management
 */

/**
 * @swagger
 * /v1/message-reaction/create:
 *   post:
 *     summary: Create a new message reaction
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               reaction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message reaction created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message-reaction/delete/{id}:
 *   delete:
 *     summary: Delete a message reaction
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message reaction deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message-reaction/list:
 *   get:
 *     summary: Get list of message reactions
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of message reactions retrieved successfully
 *       400:
 *         description: Bad request
 */
