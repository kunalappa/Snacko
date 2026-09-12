import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManageMenu from './admin/ManageMenu';
import OrderManagement from './admin/OrderManagement';
import UsersManagement from './admin/UsersManagement';
import AdminSettings from './admin/AdminSettings';
import ManageCategories from './admin/ManageCategories';
import FoodDetailsPage from './pages/FoodDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import ProfilePage from './pages/ProfilePage';
import MyOrderTokensPage from './pages/MyOrderTokensPage';
import { useAuth } from './context/AuthContext';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/signup" element={<LandingPage />} />

      {/* Role-Based Dashboards */}
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            role === 'student' ? <StudentDashboard /> :
              role === 'teacher' ? <TeacherDashboard /> :
                role === 'staff' ? <StaffDashboard /> :
                  role === 'admin' ? <AdminDashboard /> :
                    <Navigate to="/" />
          ) : <Navigate to="/" />
        }
      />

      <Route
        path="/teacher"
        element={isAuthenticated && role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />}
      />

      <Route
        path="/staff"
        element={isAuthenticated && role === 'staff' ? <StaffDashboard /> : <Navigate to="/" />}
      />

      {/* Shared User Routes */}
      <Route path="/food/:id" element={<FoodDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-status" element={<OrderStatusPage />} />
      <Route path="/my-tokens" element={<MyOrderTokensPage />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/staff/dashboard"
        element={isAuthenticated && role === 'staff' ? <StaffDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin"
        element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/*"
        element={
          isAuthenticated && role === 'admin' ? (
            <Routes>
              <Route path="menu" element={<ManageMenu />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          ) : <Navigate to="/" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

