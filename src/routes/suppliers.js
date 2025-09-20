const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const [suppliers] = await db.query('SELECT * FROM suppliers WHERE active = 1');
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
});

// Create a new supplier
router.post('/', async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_person, email, phone, address, active) VALUES (?, ?, ?, ?, ?, 1)',
      [name, contact_person, email, phone, address]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      contact_person,
      email,
      phone,
      address,
      active: 1
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Error creating supplier' });
  }
});

// Delete a supplier (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query('UPDATE suppliers SET active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Error deleting supplier' });
  }
});

module.exports = router; 