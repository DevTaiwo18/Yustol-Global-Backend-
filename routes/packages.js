const express = require('express');
const { body } = require('express-validator');
const { createPackage, getAllPackages, deletePackage } = require('../controllers/packageController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Validation middleware for the package fields
const validatePackage = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('type').notEmpty().withMessage('Type is required'),
];

// Get all packages
router.get('/', getAllPackages);

// Create a new package
router.post('/', upload.single('image'), validatePackage, createPackage);

// Delete a package by ID
router.delete('/:id', deletePackage);

module.exports = router;
