require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Ensure node-fetch is installed for non-v18+ versions
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig'); // Import Swagger config

const app = express();
const PORT = 3002;

// Middleware
app.use(bodyParser.json());

// Turso connection details from environment variables
const TURSO_API_URL = process.env.TURSO_API_URL;
const TURSO_API_KEY = process.env.TURSO_API_KEY;

// Function to execute SQL queries
async function executeSQL(query, params = []) {
  try {
    const response = await fetch(`${TURSO_API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TURSO_API_KEY}`,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('SQL Execution Error:', error);
    throw error;
  }
}

// Swagger Docs Route (default gateway)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes

// Create a new user
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint allows the creation of a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: User created successfully
 */
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  try {
    const result = await executeSQL(query, [name, email]);
    res.status(201).json({ message: 'User created successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: This endpoint fetches all the users from the database.
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/users', async (req, res) => {
  const query = 'SELECT * FROM users';
  try {
    const result = await executeSQL(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: This endpoint allows updating a user's details.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: User updated successfully
 */
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  try {
    const result = await executeSQL(query, [name, email, id]);
    res.status(200).json({ message: 'User updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: This endpoint allows deleting a user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  try {
    const result = await executeSQL(query, [id]);
    res.status(200).json({ message: 'User deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//added this