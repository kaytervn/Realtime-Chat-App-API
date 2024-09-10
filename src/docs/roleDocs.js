/**
 * @swagger
 * /v1/role/create:
 *   post:
 *     tags: [Role]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * /v1/role/update:
 *   put:
 *     tags: [Role]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * /v1/role/get/{id}:
 *   get:
 *     tags: [Role]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/role/list:
 *   get:
 *     tags: [Role]
 */
