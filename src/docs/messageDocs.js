/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management
 */

/**
 * @swagger
 * /v1/message/create:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               content:
 *                 type: string
 *               kind:
 *                 type: number
 *               parentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message/update:
 *   put:
 *     summary: Update an existing message
 *     tags: [Message]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message/get/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Message]
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
 *         description: Message retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message/delete/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Message]
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
 *         description: Message deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/message/list:
 *   get:
 *     summary: Get list of messages
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages retrieved successfully
 *       400:
 *         description: Bad request
 */
