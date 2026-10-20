const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../model/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'khatabook_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const authService = {
  signup: async ({ name, email, password }) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const err = new Error('Full Name is required');
      err.statusCode = 400;
      throw err;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const err = new Error('A valid email address is required');
      err.statusCode = 400;
      throw err;
    }

    if (!password || password.length < 6) {
      const err = new Error('Password must be at least 6 characters long');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = userModel.findByEmail(cleanEmail);
    if (existing) {
      const err = new Error('An account with this email already exists. Please log in.');
      err.statusCode = 400;
      throw err;
    }

    // Architecture Pillar 67: Secure Password Hashing with Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
      authProvider: 'local'
    };

    const savedUser = userModel.create(newUser);
    const token = generateToken(savedUser);

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        avatar: savedUser.avatar,
        authProvider: savedUser.authProvider
      },
      token
    };
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = userModel.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    if (!user.passwordHash) {
      const err = new Error('This account was created via Google Sign-In. Please click "Continue with Google".');
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      token
    };
  },

  googleAuth: async ({ email, name, avatar, googleUid }) => {
    if (!email) {
      const err = new Error('Email is required from Google Auth');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = userModel.findByEmail(cleanEmail);

    if (user) {
      // Update avatar if provided and user has no custom avatar
      if (avatar && (!user.avatar || user.avatar.includes('dicebear'))) {
        user = userModel.update(user.id, { avatar });
      }
    } else {
      // Create new user directly via Google authentication
      const newUser = {
        id: uuidv4(),
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        passwordHash: null,
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
        authProvider: 'google'
      };
      user = userModel.create(newUser);
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      token
    };
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const error = new Error('Invalid or expired authentication token');
      error.statusCode = 401;
      throw error;
    }
  }
};

module.exports = authService;
