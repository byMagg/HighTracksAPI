const express = require('express');
const router = express.Router();
const ctrlTracks = require('../controllers/tracks');
const ctrlAuth = require('../controllers/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         author:
 *           type: string
 *         text:
 *           type: string
 *         score:
 *           type: number
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             accuracy:
 *               type: number
 *     Track:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         album:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             artists:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *             images:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   height:
 *                     type: number
 *                   url:
 *                     type: string
 *                   width:
 *                     type: number
 *                   imageBase64String:
 *                     type: string
 *             release_date:
 *               type: string
 *             release_date_precision:
 *               type: string
 *             total_tracks:
 *               type: number
 *         name:
 *           type: string
 *         duration_ms:
 *           type: number
 *         preview_url:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             accuracy:
 *               type: number
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *   responses:
 *     DeleteSuccessTrack:
 *       description: Eliminación exitosa de la pista
 *     DeleteSuccessComment:
 *       description: Eliminación exitosa del comentario
 *     Unauthorized:
 *       description: Acceso no autorizado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Descripción del error
 *                 example: Acceso no autorizado
 *               code:
 *                 type: integer
 *                 description: Código de error
 *                 example: 401
 *     BadRequest:
 *       description: Solicitud incorrecta
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Descripción del error
 *                 example: Solicitud incorrecta. Verifique que la información proporcionada sea válida y esté completa.
 *               code:
 *                 type: integer
 *                 description: Código de error
 *                 example: 400
 *     InternalServer:
 *       description: Error interno del servidor
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Descripción del error
 *                 example: Error interno del servidor
 *               code:
 *                 type: integer
 *                 description: Código de error
 *                 example: 500
 *     NotFound:
 *       description: Recurso no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Descripción del error
 *                 example: Recurso no encontrado
 *               code:
 *                 type: integer
 *                 description: Código de error
 *                 example: 404
 */

// Token
/**
 * @swagger
 * /generate_token:
 *   get:
 *     summary: Generar token de autorización de Spotify
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: grant_type
 *         in: query
 *         description: Tipo de concesión de la autorización
 *         required: true
 *         schema:
 *           type: string
 *           enum: [client_credentials]
 *       - name: client_id
 *         in: query
 *         description: ID del cliente de la aplicación de Spotify
 *         required: true
 *         schema:
 *           type: string
 *           example: your_client_id
 *       - name: client_secret
 *         in: query
 *         description: Clave secreta del cliente de la aplicación de Spotify
 *         required: true
 *         schema:
 *           type: string
 *           example: your_client_secret
 *     responses:
 *       '200':
 *         description: Token de autorización generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: Token de acceso generado
 *                   example: BQBJSNsy7khF8ySlw1MwtuUVNz...
 *                 token_type:
 *                   type: string
 *                   description: Tipo de token generado
 *                   example: Bearer
 *                 expires_in:
 *                   type: integer
 *                   description: Tiempo de expiración del token generado
 *                   example: 3600
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServer'
 */
router.get('/generate_token', ctrlAuth.generateTokenSpotify);

// Auth
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticación de usuario y generación de token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: p@ssw0rd
 *     responses:
 *       200:
 *         description: Autenticación exitosa, devuelve un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *                   example: eyJhbGciOiJIUzI1NiIsInR5...
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServer'
 */
router.post('/login', ctrlAuth.login);

// Search
/**
 * @swagger
 * /search/{search}:
 *   get:
 *     tags: [Tracks]
 *     summary: Buscar tracks en Spotify
 *     description: Busca tracks en Spotify que contengan el término de búsqueda especificado en el parámetro `search`
 *     parameters:
 *       - in: path
 *         name: search
 *         required: true
 *         description: Término de búsqueda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tracks encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Track'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServer'
 */
router.get('/search/:search', ctrlTracks.tracksSearchSpotify);

/**
 * @swagger
 * /tracks/search:
 *   get:
 *     summary: Buscar pistas por campo.
 *     tags: [Tracks]
 *     parameters:
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Nombre del artista para realizar la búsqueda.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre de la pista para realizar la búsqueda.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Fecha de lanzamiento de la pista para realizar la búsqueda.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Búsqueda exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Track'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServer'
 */
router.get('/tracks/search', ctrlAuth.verifyToken, ctrlTracks.trackSearchByField);


/**
 * @swagger
 * /tracks:
 *   get:
 *     summary: Obtiene todas las canciones.
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/tracks', ctrlAuth.verifyToken, ctrlTracks.trackGetAll);

// Tracks
/**
 * @swagger
 *  basepath: /api
 * /tracks/{id}:
 *   get:
 *     summary: Obtiene una canción por su id
 *     tags: [Tracks]
 *     description: Obtiene una canción por su id desde la base de datos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la canción a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 */
router.get('/tracks/:id', ctrlAuth.verifyToken, ctrlTracks.trackGetOneById);

/**
 * @swagger
 * /tracks:
 *   post:
 *     summary: Insert a new track
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: The inserted track
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServer'
 */
router.post('/tracks', ctrlAuth.verifyToken, ctrlTracks.trackInsertMany);

/**
 * @swagger
 * /tracks/{id}:
 *   put:
 *     summary: Actualiza un track por su ID.
 *     description: Actualiza la información de un track por su ID.
 *     tags:
 *       - Tracks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la canción a buscar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto que contiene los campos a actualizar del track
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       '200':
 *         description: Respuesta exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServer'
 */
router.put('/tracks/:id', ctrlAuth.verifyToken, ctrlTracks.trackUpdate);

/**
 * @swagger
 * /tracks/{id}:
 *   delete:
 *     summary: Elimina una pista
 *     description: Elimina una pista a partir de su ID
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la pista a eliminar
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteSuccessTrack'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServer'
 */
router.delete('/tracks/:id', ctrlAuth.verifyToken, ctrlTracks.trackDelete);

//Comments
/**
 * @swagger
 * /tracks/{id}/comments:
 *   post:
 *     summary: Agrega un comentario a un track
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del track al que se desea agregar un comentario
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto que contiene la información del comentario a agregar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       '201':
 *         description: Comentario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServer'
 */
router.post('/tracks/:id/comments', ctrlAuth.verifyToken, ctrlTracks.trackInsertComment);

/**
 * @swagger
 * /tracks/{id}/comments:
 *   get:
 *     summary: Obtener todos los comentarios de una pista.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la pista.
 *     responses:
 *       200:
 *         description: Lista de comentarios de la pista.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/tracks/:id/comments', ctrlAuth.verifyToken, ctrlTracks.commentGetAll);

/**
 * @swagger
 * /tracks/{id}/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario de una pista.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la pista.
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteSuccessComment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServer'
 */
router.delete('/tracks/:id/comments/:commentId', ctrlAuth.verifyToken, ctrlTracks.commentDeleteOne);

module.exports = router;