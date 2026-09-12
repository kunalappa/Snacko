-- Canteen Management Database Schema
CREATE DATABASE IF NOT EXISTS cantine_management;
USE cantine_management;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('student', 'teacher', 'staff', 'admin') DEFAULT 'student',
    department VARCHAR(100),
    studentId VARCHAR(50),
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(10) -- Store emoji or icon class
);

-- 3. Food Items table
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    rating DECIMAL(2, 1) DEFAULT 4.0,
    prep_time VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled') DEFAULT 'Pending',
    token VARCHAR(50) UNIQUE NOT NULL, -- Digital Token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- 6. Canteen Settings table
CREATE TABLE IF NOT EXISTS canteen_settings (
    id INT PRIMARY KEY,
    canteen_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT
);

-- Initial Data
INSERT INTO categories (name, icon) VALUES 
('Thali', '🍱'),
('Snacks', '🍿'),
('Beverages', '🥤'),
('Meals', '🍽️')
ON DUPLICATE KEY UPDATE name = name;

-- Insert Sample Food Items
INSERT INTO food_items (name, description, price, category_id, image_url, rating, prep_time, is_available) VALUES 
('Executive Veg Thali', 'A complete balanced meal with seasonal vegetables, dal, rice, and roti.', 120.00, 1, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 4.8, '15 min', TRUE),
('Paneer Special Thali', 'Rich paneer curry served with dal, flavored rice, and butter roti.', 150.00, 1, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 4.9, '15 min', TRUE),
('Classic Burger', 'Juicy beef patty with fresh lettuce, tomato, and our secret sauce.', 120.00, 4, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 4.5, '15 min', TRUE),
('Crispy Fries', 'Golden brown potato fries seasoned with sea salt.', 60.00, 2, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', 4.2, '10 min', TRUE),
('Iced Coffee', 'Chilled espresso with milk and a hint of vanilla.', 80.00, 3, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', 4.8, '5 min', TRUE);

-- Insert a Sample Admin User (password: admin123)
INSERT INTO users (name, email, role, department, password) VALUES 
('Admin User', 'admin@example.com', 'admin', 'Management', 'admin123')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO canteen_settings (id, canteen_name, contact_email, contact_phone, address)
VALUES (1, 'Campus Canteen', 'canteen@example.com', '0000000000', 'Campus Premises')
ON DUPLICATE KEY UPDATE canteen_name = canteen_name;

