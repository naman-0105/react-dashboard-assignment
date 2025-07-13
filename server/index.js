const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'owner'],
    default: 'employee'
  },
  type: {
    type: String,
    enum: ['Subscription', 'Non-subscription', 'Unassigned'],
    default: 'Unassigned'
  },
  country: {
    type: String,
    default: ''
  },
  signedUp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: () => Math.floor(10000 + Math.random() * 90000).toString()
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// JWT Secret Check
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables!');
  process.env.JWT_SECRET = 'fallback-jwt-secret-for-development-only';
}

// Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      userId: Math.floor(10000 + Math.random() * 90000).toString()
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
app.get('/api/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Mock data for the dashboard
    const statsData = {
      totalUsers: totalUsers || 72540, // Use actual count or fallback to demo value
      sessions: 29.4,
      clickRate: 56.8,
      pageviews: 92913
    };
    
    res.json(statsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed data for testing
app.post('/api/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Seed route not available in production' });
  }
  
  try {
    // Clear all users
    await User.deleteMany({});
    
    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        name: 'Amanda Harvey',
        email: 'amanda@site.com',
        password: hashedPassword,
        role: 'Employee',
        type: 'Unassigned',
        country: 'United Kingdom',
        signedUp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        userId: '67989',
      },
      {
        name: 'Anne Richard',
        email: 'anne@site.com',
        password: hashedPassword,
        role: 'Employee',
        type: 'Subscription',
        country: 'United States',
        signedUp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
        userId: '67326',
      },
      // Add more sample users as needed...
    ];
    
    await User.insertMany(users);
    
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));