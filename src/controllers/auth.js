const axios = require('axios');
var config = require('../common/config');
const jwt = require('jsonwebtoken');
const { sendJSONresponse } = require('../common/request');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return sendJSONresponse(
      res,
      401,
      'No se proporcionó un token de autenticación.'
    );
  try {
    const secret = config.JWT_SECRET;
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    sendJSONresponse(res, 401, 'Token de autenticación no válido.');
  }
};

// Función para generar un token JWT para un usuario
const generateToken = (user) => {
  const payload = {
    email: user.email,
  };
  const secret = config.JWT_SECRET;
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, secret, options);
};

/* POST api/login */
const login = async (req, res) => {
  try {
    // const { email, password } = req.body;
    // const user = await User.findOne({ email });
    // if (!user || user.password !== password) {
    //     return res.status(401).send('Nombre de usuario o contraseña incorrectos.');
    // }
    const token = generateToken(req.body);
    sendJSONresponse(res, 200, { token });
  } catch (err) {
    sendJSONresponse(res, 500, err);
  }
};

/* POST api/generate_token */
const generateTokenSpotify = async (req, res) => {
  try {
    const response = await axios.post(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}`
    );

    if (response.status === 200) {
      const data = response.data;
      spotifyToken = data.access_token;
      config.TOKEN_SECRET_SPOTIFY = spotifyToken;
      console.log(`Token de Spotify actualizado: ${spotifyToken}`);
      setTimeout(generateTokenSpotify, (data.expires_in - 60) * 1000);
      sendJSONresponse(res, 200, response.data);
    } else {
      console.error('Error al obtener el token de Spotify');
      setTimeout(generateTokenSpotify, 60000);
      sendJSONresponse(res, 400, {
        error: {
          code: '400',
          message:
            'La solicitud es incorrecta. Verifique que la información proporcionada sea válida y esté completa.',
        },
      });
    }
  } catch (error) {
    console.error(`Error al obtener el token de Spotify: ${error.message}`);
    setTimeout(generateTokenSpotify, 60000);
    sendJSONresponse(res, 400, {
      error: {
        code: '400',
        message:
          'La solicitud es incorrecta. Verifique que la información proporcionada sea válida y esté completa.',
      },
    });
  }
};

module.exports = {
  generateTokenSpotify,
  verifyToken,
  login,
};
