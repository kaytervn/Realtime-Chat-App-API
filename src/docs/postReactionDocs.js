/**
 * @swagger
 * tags:
 *   name: PostReaction
 *   description: Post reaction management
 */

/**
 * @swagger
 * /v1/post-reaction/create:
 *   post:
 *     summary: Create a new post reaction
 *     tags: [PostReaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *               reaction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post reaction created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/post-reaction/delete/{id}:
 *   delete:
 *     summary: Delete a post reaction
 *     tags: [PostReaction]
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
 *         description: Post reaction deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/post-reaction/list:
 *   get:
 *     summary: Get list of post reactions
 *     tags: [PostReaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of post reactions retrieved successfully
 *       400:
 *         description: Bad request
 */
