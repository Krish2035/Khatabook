const authService = require('../services/authService');
const userModel = require('../model/userModel');

const authController = {
  signup: async (req, res, next) => {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  googleAuth: async (req, res, next) => {
    try {
      const result = await authService.googleAuth(req.body);
      res.status(200).json({
        success: true,
        message: 'Authenticated with Google successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authorization header with Bearer token is required', status: 401 }
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyToken(token);
      const user = userModel.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found', status: 404 }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          authProvider: user.authProvider
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
