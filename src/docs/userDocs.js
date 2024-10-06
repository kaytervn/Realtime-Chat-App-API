/**
 * @swagger
 * tags:
 *   name: User
 *   description: Quản lý người dùng và xác thực
 */

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "string, bắt buộc, có thể là email/phone/studentId"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "string, bắt buộc"
 *                 required: true
 */

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "string, bắt buộc"
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa email"
 *               password:
 *                 type: string
 *                 example: "string, bắt buộc"
 *               phone:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (10 số, bắt đầu bằng đầu 03/05/07)"
 *               studentId:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (8 số)"
 */

/**
 * @swagger
 * /v1/user/verify:
 *   post:
 *     summary: Xác thực tài khoản
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc"
 *               otp:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (6 số)"
 */

/**
 * @swagger
 * /v1/user/forgot-password:
 *   post:
 *     summary: Gửi yêu cầu quên mật khẩu
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc"
 */

/**
 * @swagger
 * /v1/user/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc"
 *               newPassword:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (ít nhất 6 ký tự)"
 *               otp:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (6 số)"
 */

/**
 * @swagger
 * /v1/user/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ cá nhân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/user/update-profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "string, bắt buộc"
 *               birthDate:
 *                 type: string
 *                 example: "string, bắt buộc, chuẩn hóa (dd/mm/yyyy hh:mm:ss)"
 *               bio:
 *                 type: string
 *                 example: "string, không bắt buộc"
 *               avatarUrl:
 *                 type: string
 *                 example: "string, không bắt buộc, là đường dẫn ảnh lấy từ API POST /v1/file/upload"
 *               currentPassword:
 *                 type: string
 *                 example: "string, không bắt buộc, chỉ truyền khi muốn đổi mật khẩu"
 *               newPassword:
 *                 type: string
 *                 example: "string, không bắt buộc, chỉ truyền khi muốn đổi mật khẩu"
 */

/**
 * @swagger
 * /v1/user/request-key-change:
 *   put:
 *     summary: Yêu cầu cập nhật thông tin quan trọng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc, có thể truyền email hiện có hoặc email mới"
 *               password:
 *                 type: string
 *                 example: "string, bắt buộc, password hiện tại"
 */

/**
 * @swagger
 * /v1/user/verify-key-change:
 *   post:
 *     summary: Xác thực cập nhật thông tin quan trọng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string, bắt buộc, email hiện tại hoặc mới, chuẩn hóa email"
 *               studentId:
 *                 type: string
 *                 example: "string, bắt buộc, studentId hiện tại hoặc mới, chuẩn hóa (8 số)"
 *               phone:
 *                 type: string
 *                 example: "string, bắt buộc, phone hiện tại hoặc mới, chuẩn hóa (10 số, bắt đầu bằng đầu 03/05/07)"
 *               otp:
 *                 example: "string, bắt buộc, otp xác thực từ mail, chuẩn hóa (6 số)"
 */

/**
 * @swagger
 * /v1/user/list:
 *   get:
 *     summary: Xem danh sách người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: displayName
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: Number
 *       - in: query
 *         name: role
 *         schema:
 *           type: ObjectId
 *           example: ObjectId
 *       - in: query
 *         name: page
 *         schema:
 *           type: Number
 *       - in: query
 *         name: size
 *         schema:
 *           type: Number
 */

/**
 * @swagger
 * /v1/user/get/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/user/create:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               studentId:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               status:
 *                 type: number
 *               role:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/update:
 *   put:
 *     summary: Update a user (admin only)
 *     tags: [User]
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
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               studentId:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: ObjectId
 *               status:
 *                 type: number
 *               password:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/delete/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/user/login-admin:
 *   post:
 *     summary: Login as admin
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */
