/**
 * @swagger
 * tags:
 *   name: ConversationMember
 *   description: Conversation member management
 */

/**
 * @swagger
 * /v1/conversation-member/add:
 *   post:
 *     summary: Add a member to a conversation
 *     tags: [ConversationMember]
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
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added to conversation successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation-member/remove:
 *   delete:
 *     summary: Remove a member from a conversation
 *     tags: [ConversationMember]
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
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed from conversation successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation-member/list/{conversationId}:
 *   get:
 *     summary: Get list of members in a conversation
 *     tags: [ConversationMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of conversation members retrieved successfully
 *       400:
 *         description: Bad request
 */
