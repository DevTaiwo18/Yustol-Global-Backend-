const { validationResult } = require('express-validator');
const Package = require('../models/Package');

const createPackage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation Errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { title, price, type } = req.body;
    const imagePath = req.file.path;

    const newPackage = new Package({
      title,
      price,
      type,
      image: imagePath,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error('Error saving package:', error);
    res.status(500).json({ message: 'Failed to create package', error });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch packages', error });
  }
};

// Delete a package
const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete package', error });
  }
};

module.exports = { createPackage, getAllPackages, deletePackage };
