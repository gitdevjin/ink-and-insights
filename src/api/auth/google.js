const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const users = {}; // Simulated database (Replace with real DB)

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Function to create tokens
const generateTokens = (email, name) => {
  const accessToken = jwt.sign({ email, name }, ACCESS_SECRET, { expiresIn: '60m' }); // Short-lived
  const refreshToken = jwt.sign({ email, name }, REFRESH_SECRET, { expiresIn: '7d' }); // Long-lived
  return { accessToken, refreshToken };
};

module.exports.googleLogin = async (req, res) => {
  logger.info('googleLogin');

  const token = req.body.googleAccessToken;

  if (!token) {
    return res.status(400).json({ error: 'Access token required' });
  }

  try {
    // Verify the Google access token`
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const googleUser = await googleRes.json();
    console.log(googleUser);

    if (googleUser.error) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    logger.info(googleUser.email);
    logger.info(googleUser.name);

    // Create our own JWT
    const { accessToken, refreshToken } = generateTokens(googleUser.email, googleUser.given_name);

    users[googleUser.email] = { refreshToken };

    logger.info(users[googleUser.email]);
    // Send refresh token as http-only cookie (not accessible by JS)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Use true in production with HTTPS
      sameSite: 'strict',
    });

    res.json({ accessToken });
  } catch (err) {
    logger.info(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.googleRefresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const { email, name } = jwt.verify(token, REFRESH_SECRET);

    if (users[email]?.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken } = generateTokens(email, name);
    users[email].refreshToken = refreshToken;

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict' });
    res.json({ accessToken });
  } catch {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

module.exports.googleLogout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};
