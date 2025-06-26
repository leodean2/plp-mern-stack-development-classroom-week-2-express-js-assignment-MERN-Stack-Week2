const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

// In-memory database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 699.99,
    category: 'Electronics',
    inStock: true
  }
];

// Middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    throw new AuthError('Invalid or missing API key');
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  
  if (!name || !price || !category) {
    throw new ValidationError('Name, price, and category are required');
  }
  
  if (typeof price !== 'number' || price <= 0) {
    throw new ValidationError('Price must be a positive number');
  }
  
  next();
};

// Apply middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// GET all products with filtering and pagination
app.get('/api/products', (req, res) => {
  try {
    let filteredProducts = [...products];
    
    // Filter by category if query parameter exists
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    
    // Filter by inStock if query parameter exists
    if (req.query.inStock) {
      const inStock = req.query.inStock.toLowerCase() === 'true';
      filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedProducts,
      meta: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// Search products by name
app.get('/api/products/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new ValidationError('Search query parameter "q" is required');
    }
    
    const searchResults = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json(searchResults);
  } catch (err) {
    next(err);
  }
});

// GET single product
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST create new product
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description || '',
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock || true
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update product
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    
    const updatedProduct = {
      ...products[index],
      name: req.body.name,
      description: req.body.description || products[index].description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock !== undefined ? req.body.inStock : products[index].inStock
    };
    
    products[index] = updatedProduct;
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE product
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Product statistics
app.get('/api/products/stats', (req, res) => {
  try {
    const stats = {
      totalProducts: products.length,
      categories: {},
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length
    };
    
    products.forEach(product => {
      if (!stats.categories[product.category]) {
        stats.categories[product.category] = 0;
      }
      stats.categories[product.category]++;
    });
    
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      name: err.name,
      message,
      statusCode
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});