const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const allowedRoles = new Set(['student', 'teacher', 'staff', 'admin']);

// --- API Router ---
const api = express.Router();

// 1. Auth & Diagnostic routes
api.get('/ping', (req, res) => res.json({ status: 'ok', time: new Date(), version: '1.0.1' }));

api.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Enforce role matching
        if (role && users[0].role !== role) {
            return res.status(401).json({ error: `Account exists but is not registered as ${role}. Please select your correct role.` });
        }
        const user = users[0];
        // Don't send password back
        delete user.password;
        res.json(user);
    } catch (error) { res.status(500).json({ error: error.message }); }
});


// 2. Orders
api.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.name as userName, u.role as userRole 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        for (let order of orders) {
            const [items] = await db.query('SELECT oi.*, f.name, f.image_url FROM order_items oi JOIN food_items f ON oi.food_item_id = f.id WHERE oi.order_id = ?', [order.id]);
            order.items = items;
        }
        res.json(orders);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

api.post('/orders', async (req, res) => {
    const { user_id, items, total, scheduled_time } = req.body;
    if (!user_id || !items || !items.length) {
        return res.status(400).json({ error: 'user_id and items are required' });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        let validUserId = parseInt(user_id);
        if (isNaN(validUserId)) {
            const [users] = await connection.query('SELECT id FROM users LIMIT 1');
            validUserId = users.length > 0 ? users[0].id : 1;
        }
        const token = `TKN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total, token, scheduled_time, status) VALUES (?, ?, ?, ?, "Pending")',
            [validUserId, total, token, scheduled_time || null]
        );
        const orderId = orderResult.insertId;
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, food_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }
        await connection.commit();
        res.json({ id: orderId, token, message: 'Order placed successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

api.get('/orders/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        for (let order of orders) {
            const [items] = await db.query('SELECT oi.*, f.name, f.image_url FROM order_items oi JOIN food_items f ON oi.food_item_id = f.id WHERE oi.order_id = ?', [order.id]);
            order.items = items;
        }
        res.json(orders);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Grouped order management routes
api.route('/orders/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
            if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });
            const [items] = await db.query('SELECT oi.*, f.name, f.image_url FROM order_items oi JOIN food_items f ON oi.food_item_id = f.id WHERE oi.order_id = ?', [id]);
            orders[0].items = items;
            res.json(orders[0]);
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .delete(async (req, res) => {
        try {
            await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
            res.json({ message: 'Order deleted' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

api.patch('/orders/:id/payment', async (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    try {
        if (payment_status === 'Paid') {
            const [order] = await db.query('SELECT status FROM orders WHERE id = ?', [id]);
            if (order.length > 0 && order[0].status === 'Ready') {
                await db.query('UPDATE orders SET payment_status = ?, status = "Completed" WHERE id = ?', [payment_status, id]);
                return res.json({ message: 'Payment collected and order completed' });
            }
        }
        await db.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, id]);
        res.json({ message: 'Payment status updated' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

api.patch('/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Order status updated' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 3. Stats
api.get('/stats', async (req, res) => {
    try {
        const [sales] = await db.query('SELECT SUM(total) as totalSales FROM orders WHERE status = "Completed"');
        const [ordersCount] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
        const [usersCount] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role != "admin"');
        const [itemsCount] = await db.query('SELECT COUNT(*) as activeItems FROM food_items WHERE is_available = TRUE');
        res.json({
            totalSales: sales[0].totalSales || 0,
            totalOrders: ordersCount[0].totalOrders,
            totalUsers: usersCount[0].totalUsers,
            activeItems: itemsCount[0].activeItems
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 4. Menu & Categories
api.route('/menu')
    .get(async (req, res) => {
        try {
            const [rows] = await db.query('SELECT f.*, c.name as category FROM food_items f LEFT JOIN categories c ON f.category_id = c.id');
            res.json(rows);
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .post(upload.single('image'), async (req, res) => {
        const { name, description, price, category_id, prep_time } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        try {
            const [result] = await db.query('INSERT INTO food_items (name, description, price, category_id, image_url, prep_time) VALUES (?, ?, ?, ?, ?, ?)', [name, description, price, category_id, image_url, prep_time]);
            res.json({ id: result.insertId, message: 'Item added' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

api.route('/menu/:id')
    .put(upload.single('image'), async (req, res) => {
        const { id } = req.params;
        const { name, description, price, category_id, prep_time, is_available } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        try {
            await db.query('UPDATE food_items SET name=?, description=?, price=?, category_id=?, image_url=?, prep_time=?, is_available=? WHERE id=?', [name, description, price, category_id, image_url, prep_time, is_available, id]);
            res.json({ message: 'Item updated' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .delete(async (req, res) => {
        try {
            await db.query('DELETE FROM food_items WHERE id = ?', [req.params.id]);
            res.json({ message: 'Item deleted' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

api.route('/categories')
    .get(async (req, res) => {
        try {
            const [rows] = await db.query('SELECT id, name, icon FROM categories ORDER BY name ASC');
            res.json(rows);
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .post(async (req, res) => {
        const { name, icon } = req.body;
        try {
            if (!name) return res.status(400).json({ error: 'Name is required' });
            const [result] = await db.query('INSERT INTO categories (name, icon) VALUES (?, ?)', [name, icon || null]);
            res.json({ id: result.insertId, message: 'Category added' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

api.route('/categories/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
            if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
            res.json(rows[0]);
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .put(async (req, res) => {
        const { id } = req.params;
        const { name, icon } = req.body;
        try {
            await db.query('UPDATE categories SET name=?, icon=? WHERE id=?', [name, icon || null, id]);
            res.json({ message: 'Category updated' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        try {
            // Check if items are using this category
            const [items] = await db.query('SELECT id FROM food_items WHERE category_id = ? LIMIT 1', [id]);
            if (items.length > 0) {
                return res.status(400).json({ error: 'Cannot delete category while items are assigned to it' });
            }
            await db.query('DELETE FROM categories WHERE id = ?', [id]);
            res.json({ message: 'Category deleted' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

// 5. Users
api.route('/users')
    .get(async (req, res) => {
        try {
            const [rows] = await db.query('SELECT id, name, email, role, department, studentId, phone, is_active, created_at FROM users ORDER BY created_at DESC');
            res.json(rows);
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .post(async (req, res) => {
        const { name, email, role, department, studentId, phone, password } = req.body;
        try {
            if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password are required' });
            if (role && !allowedRoles.has(role)) return res.status(400).json({ error: 'Invalid role' });

            // Check for duplicate email
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

            const [result] = await db.query('INSERT INTO users (name, email, role, department, studentId, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, role || 'student', department || null, studentId || null, phone || null, password]);
            res.json({ id: result.insertId, message: 'User created' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

api.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, department, studentId, phone } = req.body;
    try {
        if (!name || !email) return res.status(400).json({ error: 'name and email required' });
        await db.query('UPDATE users SET name=?, email=?, role=?, department=?, studentId=?, phone=? WHERE id=?', [name, email, role || 'student', department || null, studentId || null, phone || null, id]);
        res.json({ message: 'User updated' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

api.patch('/users/:id/active', async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    try {
        await db.query('UPDATE users SET is_active=? WHERE id=?', [is_active ? 1 : 0, id]);
        res.json({ message: 'User status updated' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

api.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Settings
api.route('/settings')
    .get(async (req, res) => {
        try {
            const [rows] = await db.query('SELECT id, canteen_name, contact_email, contact_phone, address FROM canteen_settings WHERE id = 1');
            res.json(rows[0] || { id: 1, canteen_name: 'Campus Canteen' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    })
    .put(async (req, res) => {
        const { canteen_name, contact_email, contact_phone, address } = req.body;
        try {
            await db.query(`INSERT INTO canteen_settings (id, canteen_name, contact_email, contact_phone, address) VALUES (1, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE canteen_name=VALUES(canteen_name), contact_email=VALUES(contact_email), contact_phone=VALUES(contact_phone), address=VALUES(address)`, [canteen_name, contact_email || null, contact_phone || null, address || null]);
            res.json({ message: 'Settings updated' });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

// Mount router
app.use('/api', api);

// Custom 404 Logging
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.url} - (Hit global 404 handler)`);
    res.status(404).json({ error: `Path ${req.url} not found on this server.` });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`- GET  /api/ping`);
    console.log(`- GET  /api/orders`);
    console.log(`- POST /api/orders`);
    console.log(`- GET  /api/orders/user/:userId`);
});

