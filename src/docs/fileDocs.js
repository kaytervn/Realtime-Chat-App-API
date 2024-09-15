/**
 * @swagger
 * tags:
 *   name: File
 *   description: File upload operations
 */

/**
 * @swagger
 * /v1/file/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     filePath:
 *                       type: string
 *                     id:
 *                       type: string
 *       400:
 *         description: Bad request
 */
