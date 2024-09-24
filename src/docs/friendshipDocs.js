/**
 * @swagger
 * tags:
 *   name: Friendship
 *   description: Friendship management
 */

/**
 * @swagger
 * /v1/friendship/send:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/accept/{friendshipId}:
 *   put:
 *     summary: Accept a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/reject/{friendshipId}:
 *   put:
 *     summary: Reject a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/friends:
 *   get:
 *     summary: Get list of friends
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/list:
 *   get:
 *     summary: Get list of friendships
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friendships retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/delete/{friendshipId}:
 *   delete:
 *     summary: Delete a friendship
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friendship deleted successfully
 *       400:
 *         description: Bad request
 */
