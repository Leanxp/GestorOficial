const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestorCocina'
});

// Conectar a la base de datos
db.connect(async (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');

  // Verificar y actualizar la estructura de la tabla si es necesario
  try {
    // Verificar la estructura de la tabla
    const [columns] = await db.promise().query(
      "SHOW COLUMNS FROM admin_usuarios WHERE Field = 'pwd'"
    );
    
    if (columns.length > 0 && columns[0].Type.includes('varchar')) {
      const maxLength = parseInt(columns[0].Type.match(/varchar\((\d+)\)/)[1]);
      if (maxLength < 100) {
        // Actualizar la longitud del campo si es necesario
        await db.promise().query(
          "ALTER TABLE admin_usuarios MODIFY COLUMN pwd VARCHAR(100)"
        );
        console.log('Campo pwd actualizado para soportar hashes más largos');
      }
    }

    // Generar un nuevo hash para el usuario admin
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123', saltRounds);
    
    // Actualizar la contraseña del usuario admin
    await db.promise().query(
      'UPDATE admin_usuarios SET pwd = ? WHERE user = ?',
      [hashedPassword, 'admin']
    );
    
  } catch (error) {
    console.error('Error al verificar/actualizar la estructura de la tabla:', error);
  }
});

// Ruta para actualizar la contraseña del usuario admin
app.post('/update-password', async (req, res) => {
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Actualizar la contraseña en la base de datos
    await db.promise().query(
      'UPDATE admin_usuarios SET pwd = ? WHERE user = ?',
      [hashedPassword, username]
    );
    
    console.log('Contraseña actualizada:', {
      username,
      hashedPassword
    });
    
    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    success: false,
    message: 'Error en el servidor',
    error: err.message 
  });
});

// Ruta de registro
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log('Datos recibidos en registro:', { username, email });

    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario, email y contraseña son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM admin_usuarios WHERE user = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.log('Usuario duplicado encontrado:', existingUsers[0]);
      return res.status(400).json({ 
        success: false,
        message: 'El usuario ya existe' 
      });
    }

    // Verificar si el email ya existe
    const [existingEmails] = await db.promise().query(
      'SELECT * FROM admin_usuarios WHERE email = ?',
      [email]
    );

    console.log('Resultado de búsqueda de email:', existingEmails);

    if (existingEmails.length > 0) {
      console.log('Email duplicado encontrado:', existingEmails[0]);
      return res.status(400).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el nuevo usuario
    const [result] = await db.promise().query(
      'INSERT INTO admin_usuarios (user, email, pwd, grade) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, req.body.grade || 5]
    );

    console.log('Datos a insertar:', {
      username,
      email,
      hashedPassword,
      grade: req.body.grade || 5
    });

    // Verificar que el email se haya guardado correctamente
    const [insertedUser] = await db.promise().query(
      'SELECT * FROM admin_usuarios WHERE id = ?',
      [result.insertId]
    );

    console.log('Usuario insertado:', insertedUser[0]);

    res.json({ 
      success: true, 
      message: 'Usuario registrado exitosamente' 
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message 
    });
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const [rows] = await db.promise().query(
      'SELECT * FROM admin_usuarios WHERE user = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    const user = rows[0];
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.pwd);
    
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña incorrecta' 
      });
    }

    // Si todo es correcto, devolver los datos del usuario (sin la contraseña)
    const { pwd, ...userData } = user;
    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message 
    });
  }
});

// Ruta para hashear una contraseña (solo para desarrollo)
app.post('/hash-password', async (req, res) => {
  const { password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Contraseña hasheada:', {
      original: password,
      hashed: hashedPassword
    });
    res.json({ hashedPassword });
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    res.status(500).json({ message: 'Error al hashear la contraseña' });
  }
});

// Ruta para obtener las familias de inventario
app.get('/api/inventory/families', async (req, res) => {
  try {
    const [families] = await db.promise().query('SELECT * FROM inventory_families ORDER BY name');
    res.json(families);
  } catch (error) {
    console.error('Error al obtener las familias:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las familias',
      error: error.message 
    });
  }
});

// Ruta para obtener las subfamilias de una familia
app.get('/api/inventory/subfamilies/:familyId', async (req, res) => {
  try {
    const { familyId } = req.params;
    const [subfamilies] = await db.promise().query(
      'SELECT id, name FROM inventory_subfamilies WHERE family_id = ? ORDER BY name',
      [familyId]
    );
    
    if (!subfamilies || subfamilies.length === 0) {
      return res.json([]);
    }

    res.json(subfamilies);
  } catch (error) {
    console.error('Error al obtener las subfamilias:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las subfamilias',
      error: error.message 
    });
  }
});

// Ruta para obtener el inventario
app.get('/api/inventory', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    if (!db) {
      console.error('No hay conexión a la base de datos');
      return res.status(500).json({ 
        success: false,
        message: 'Error de conexión a la base de datos' 
      });
    }

    const [inventory] = await db.promise().query(`
      SELECT 
        i.id,
        ing.name as ingredient_name,
        ing.description,
        i.family_id,
        i.subfamily_id,
        i.quantity,
        i.purchase_price,
        i.expiry_date,
        i.batch_number,
        ing.unit_measure,
        i.supplier_id,
        f.name as family_name,
        sf.name as subfamily_name,
        s.name as supplier_name,
        ing.alergeno_gluten,
        ing.alergeno_crustaceos,
        ing.alergeno_huevos,
        ing.alergeno_pescado,
        ing.alergeno_cacahuetes,
        ing.alergeno_soja,
        ing.alergeno_leche,
        ing.alergeno_frutos_cascara,
        ing.alergeno_apio,
        ing.alergeno_mostaza,
        ing.alergeno_sesamo,
        ing.alergeno_dioxido_azufre_sulfitos,
        ing.alergeno_altramuces,
        ing.alergeno_moluscos
      FROM inventory i
      JOIN ingredients ing ON i.ingredient_id = ing.id
      LEFT JOIN inventory_families f ON i.family_id = f.id
      LEFT JOIN inventory_subfamilies sf ON i.subfamily_id = sf.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY f.name, sf.name, ing.name
    `);
    
    res.json(inventory);
  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el inventario',
      error: error.message 
    });
  }
});

// Ruta para actualizar un item del inventario
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ingredient_name,
      family_id,
      subfamily_id,
      supplier_id,
      quantity,
      purchase_price,
      expiry_date,
      batch_number
    } = req.body;

    // Verificar que el item existe
    const [existingItem] = await db.promise().query(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Item no encontrado' 
      });
    }

    // Actualizar el item en inventory
    await db.promise().query(
      `UPDATE inventory 
       SET family_id = ?, 
           subfamily_id = ?,
           supplier_id = ?,
           quantity = ?,
           purchase_price = ?,
           expiry_date = ?,
           batch_number = ?
       WHERE id = ?`,
      [family_id, subfamily_id, supplier_id, quantity, purchase_price, expiry_date, batch_number, id]
    );

    // Actualizar el nombre del ingrediente
    await db.promise().query(
      `UPDATE ingredients 
       SET name = ?,
           family_id = ?
       WHERE id = (SELECT ingredient_id FROM inventory WHERE id = ?)`,
      [ingredient_name, family_id, id]
    );

    res.json({ 
      success: true,
      message: 'Item actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar el inventario',
      error: error.message 
    });
  }
});

// Ruta para eliminar un item del inventario
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el item existe
    const [existingItem] = await db.promise().query(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Item no encontrado' 
      });
    }

    // Obtener el ingredient_id del item
    const ingredientId = existingItem[0].ingredient_id;

    // Eliminar el item del inventario
    await db.promise().query(
      'DELETE FROM inventory WHERE id = ?',
      [id]
    );

    // Eliminar el ingrediente correspondiente
    await db.promise().query(
      'DELETE FROM ingredients WHERE id = ?',
      [ingredientId]
    );

    res.json({ 
      success: true,
      message: 'Item e ingrediente eliminados correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar el inventario:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar el inventario',
      error: error.message 
    });
  }
});

// Ruta para obtener las unidades de medida
app.get('/api/inventory/unit-measures', async (req, res) => {
  try {
    const [units] = await db.promise().query(
      'SELECT DISTINCT unit_measure FROM ingredients WHERE unit_measure IS NOT NULL AND unit_measure != "" ORDER BY unit_measure'
    );
    const unitMeasures = units.map(unit => unit.unit_measure);
    console.log('Unidades de medida encontradas:', unitMeasures);
    res.json(unitMeasures);
  } catch (error) {
    console.error('Error al obtener las unidades de medida:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las unidades de medida',
      error: error.message 
    });
  }
});

// Ruta para crear un nuevo item en el inventario
app.post('/api/inventory', async (req, res) => {
  try {
    const {
      ingredient_name,
      description,
      family_id,
      subfamily_id,
      quantity,
      purchase_price,
      expiry_date,
      batch_number,
      supplier_id,
      unit_measure
    } = req.body;

    console.log('Datos recibidos:', {
      ingredient_name,
      unit_measure,
      purchase_price
    });

    // Verificar que la familia existe
    const [family] = await db.promise().query(
      'SELECT * FROM inventory_families WHERE id = ?',
      [family_id]
    );

    if (family.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Familia no encontrada' 
      });
    }

    // Verificar que la subfamilia existe y pertenece a la familia
    if (subfamily_id) {
      const [subfamily] = await db.promise().query(
        'SELECT * FROM inventory_subfamilies WHERE id = ? AND family_id = ?',
        [subfamily_id, family_id]
      );

      if (subfamily.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Subfamilia no encontrada o no pertenece a la familia seleccionada' 
        });
      }
    }

    // Verificar que el proveedor existe
    const [supplier] = await db.promise().query(
      'SELECT * FROM suppliers WHERE id = ?',
      [supplier_id]
    );

    if (supplier.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Proveedor no encontrado' 
      });
    }

    // Crear el ingrediente con la family_id
    const [ingredientResult] = await db.promise().query(
      'INSERT INTO ingredients (name, description, family_id, unit_measure, active, alergeno_gluten, alergeno_crustaceos, alergeno_huevos, alergeno_pescado, alergeno_cacahuetes, alergeno_soja, alergeno_leche, alergeno_frutos_cascara, alergeno_apio, alergeno_mostaza, alergeno_sesamo, alergeno_dioxido_azufre_sulfitos, alergeno_altramuces, alergeno_moluscos) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ingredient_name,
        description,
        family_id,
        unit_measure,
        req.body.alergeno_gluten || 0,
        req.body.alergeno_crustaceos || 0,
        req.body.alergeno_huevos || 0,
        req.body.alergeno_pescado || 0,
        req.body.alergeno_cacahuetes || 0,
        req.body.alergeno_soja || 0,
        req.body.alergeno_leche || 0,
        req.body.alergeno_frutos_cascara || 0,
        req.body.alergeno_apio || 0,
        req.body.alergeno_mostaza || 0,
        req.body.alergeno_sesamo || 0,
        req.body.alergeno_dioxido_azufre_sulfitos || 0,
        req.body.alergeno_altramuces || 0,
        req.body.alergeno_moluscos || 0
      ]
    );

    console.log('Query de inserción del ingrediente:', {
      query: 'INSERT INTO ingredients (name, description, family_id, unit_measure, active, alergeno_gluten, alergeno_crustaceos, alergeno_huevos, alergeno_pescado, alergeno_cacahuetes, alergeno_soja, alergeno_leche, alergeno_frutos_cascara, alergeno_apio, alergeno_mostaza, alergeno_sesamo, alergeno_dioxido_azufre_sulfitos, alergeno_altramuces, alergeno_moluscos) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      params: [
        ingredient_name,
        description,
        family_id,
        unit_measure,
        req.body.alergeno_gluten || 0,
        req.body.alergeno_crustaceos || 0,
        req.body.alergeno_huevos || 0,
        req.body.alergeno_pescado || 0,
        req.body.alergeno_cacahuetes || 0,
        req.body.alergeno_soja || 0,
        req.body.alergeno_leche || 0,
        req.body.alergeno_frutos_cascara || 0,
        req.body.alergeno_apio || 0,
        req.body.alergeno_mostaza || 0,
        req.body.alergeno_sesamo || 0,
        req.body.alergeno_dioxido_azufre_sulfitos || 0,
        req.body.alergeno_altramuces || 0,
        req.body.alergeno_moluscos || 0
      ]
    });

    const ingredientId = ingredientResult.insertId;

    // Verificar que el ingrediente se creó correctamente
    const [createdIngredient] = await db.promise().query(
      'SELECT * FROM ingredients WHERE id = ?',
      [ingredientId]
    );

    console.log('Ingrediente creado:', createdIngredient[0]);

    // Crear el item en el inventario con family_id y subfamily_id
    const inventoryQuery = `
      INSERT INTO inventory 
      (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, supplier_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Asegurarnos de que family_id y subfamily_id son números válidos o null
    const inventoryParams = [
      ingredientId,
      parseInt(family_id),
      subfamily_id ? parseInt(subfamily_id) : null,
      parseFloat(quantity),
      parseFloat(purchase_price),
      expiry_date,
      batch_number,
      parseInt(supplier_id)
    ];

    const [inventoryResult] = await db.promise().query(inventoryQuery, inventoryParams);
    console.log('Resultado de la inserción del inventario:', inventoryResult);

    res.json({ 
      success: true,
      message: 'Producto creado correctamente' 
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el producto',
      error: error.message 
    });
  }
});

// Ruta para obtener todos los proveedores
app.get('/api/suppliers', async (req, res) => {
  try {
    const [suppliers] = await db.promise().query('SELECT * FROM suppliers WHERE active = 1');
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
});

// Ruta para crear un nuevo proveedor
app.post('/api/suppliers', async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  
  try {
    const [result] = await db.promise().query(
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

// Ruta para eliminar un proveedor (soft delete)
app.delete('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.promise().query('UPDATE suppliers SET active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Error deleting supplier' });
  }
});

// Ruta para obtener los ingredientes de un proveedor
app.get('/api/suppliers/:id/ingredients', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [ingredients] = await db.promise().query(`
      SELECT 
        si.id,
        i.name as ingredient_name,
        si.supplier_price,
        si.notes,
        si.updated_at
      FROM supplier_ingredients si
      JOIN ingredients i ON si.ingredient_id = i.id
      WHERE si.supplier_id = ?
      ORDER BY i.name
    `, [id]);
    
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching supplier ingredients:', error);
    res.status(500).json({ error: 'Error fetching supplier ingredients' });
  }
});

// Ruta para agregar un nuevo ingrediente a un proveedor
app.post('/api/suppliers/:id/ingredients', async (req, res) => {
  const { id } = req.params;
  const { ingredient_id, supplier_price, notes } = req.body;

  try {
    // Verificar que el proveedor existe
    const [supplier] = await db.promise().query(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );

    if (supplier.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Proveedor no encontrado' 
      });
    }

    // Verificar que el ingrediente existe
    const [ingredient] = await db.promise().query(
      'SELECT * FROM ingredients WHERE id = ?',
      [ingredient_id]
    );

    if (ingredient.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Ingrediente no encontrado' 
      });
    }

    // Verificar que el ingrediente no está ya asociado al proveedor
    const [existing] = await db.promise().query(
      'SELECT * FROM supplier_ingredients WHERE supplier_id = ? AND ingredient_id = ?',
      [id, ingredient_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Este ingrediente ya está asociado al proveedor' 
      });
    }

    // Insertar el nuevo ingrediente del proveedor
    await db.promise().query(
      'INSERT INTO supplier_ingredients (supplier_id, ingredient_id, supplier_price, notes) VALUES (?, ?, ?, ?)',
      [id, ingredient_id, supplier_price, notes]
    );

    res.json({ 
      success: true,
      message: 'Ingrediente agregado correctamente' 
    });
  } catch (error) {
    console.error('Error adding supplier ingredient:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al agregar el ingrediente al proveedor' 
    });
  }
});

// Ruta para obtener todos los ingredientes
app.get('/api/ingredients', async (req, res) => {
  try {
    const [ingredients] = await db.promise().query(`
      SELECT id, name, description, unit_measure 
      FROM ingredients 
      WHERE active = 1 
      ORDER BY name
    `);
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Error fetching ingredients' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 