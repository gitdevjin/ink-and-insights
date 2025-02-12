const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  //const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  logger.info('Auth');

  const token = req.body.code;

  if (!token) {
    return res.status(400).json({ error: 'Access token required' });
  }

  try {
    // Verify the Google access token
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const googleUser = await googleRes.json();

    if (googleUser.error) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    console.log(googleUser + 'console.log');
    logger.info(googleUser);
    logger.info(googleUser.name);

    // Create our own JWT
    const userPayload = {
      sub: googleUser.sub, // Unique Google ID
      email: googleUser.email,
      name: googleUser.name,
    };
    const jwtToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ jwt: jwtToken, user: { email: googleUser.email, name: googleUser.given_name } });
  } catch (err) {
    logger.info(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
