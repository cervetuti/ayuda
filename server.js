const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret_key';

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/electrodomesticos', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas and Models
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User registered');
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Get Products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add to Cart (just for example, no real payment processing here)
app.post('/checkout', authenticateToken, async (req, res) => {
  const { items } = req.body;
  // Implement actual payment processing logic here
  res.send('Order processed');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);


  mongoose.connect('mongodb://localhost:27017/electrodomesticos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Configuración adicional para manejar la creación automática de la base de datos
    // (opcional, dependiendo de tus necesidades)
    useCreateIndex: true,  // Crea índices automáticamente
    autoCreate: true,      // Crea la base de datos si no existe
    autoIndex: true,       // Crea índices automáticamente si no existen
}).then(() => {
    console.log('Conexión a MongoDB establecida correctamente');
    // Aquí puedes realizar más acciones después de la conexión exitosa
}).catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
});

});
