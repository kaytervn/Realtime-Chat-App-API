/**
 * @swagger
 * v1/user/login:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/profile:
 *   get:
 *     tags: [User]
 */

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/verify:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/reset-password:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/forgot-password:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/change-password:
 *   put:
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/update-profile:
 *   put:
 *     tags: [User]
 *     description: Update the user's profile information.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 */
