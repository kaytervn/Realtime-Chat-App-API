/**
 * @swagger
 * tags:
 *   name: Reaction
 *   description: Reaction management
 */

/**
 * @swagger
 * /v1/reaction/create:
 *   post:
 *     summary: Create a new reaction
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/reaction/update:
 *   put:
 *     summary: Update an existing reaction
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/reaction/get/{id}:
 *   get:
 *     summary: Get a reaction by ID
 *     tags: [Reaction]
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
 *         description: Reaction retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/reaction/delete/{id}:
 *   delete:
 *     summary: Delete a reaction
 *     tags: [Reaction]
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
 *         description: Reaction deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/reaction/list:
 *   get:
 *     summary: Get list of reactions
 *     tags: [Reaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reactions retrieved successfully
 *       400:
 *         description: Bad request
 */
