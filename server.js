const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static images

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Admin Auto-Creation
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdminIfNotExists = async () => {
    try {
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

            const admin = new User({
                name: process.env.ADMIN_NAME || 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: process.env.ADMIN_ROLE || 'admin',
            });

            await admin.save();
            console.log('Admin user created:', process.env.ADMIN_EMAIL);
        } else {
            console.log('Admin user already exists:', process.env.ADMIN_EMAIL);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminIfNotExists();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
