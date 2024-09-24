/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation management
 */

/**
 * @swagger
 * /v1/conversation/create:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
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
 *               avatarUrl:
 *                 type: string
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Conversation created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/update:
 *   put:
 *     summary: Update an existing conversation
 *     tags: [Conversation]
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
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/get/{id}:
 *   get:
 *     summary: Get a conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/delete/{id}:
 *   delete:
 *     summary: Delete a conversation
 *     tags: [Conversation]
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
 *         description: Conversation deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/list:
 *   get:
 *     summary: Get list of conversations for the current user
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations retrieved successfully
 *       400:
 *         description: Bad request
 */
