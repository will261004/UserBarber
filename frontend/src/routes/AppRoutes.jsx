import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import ServiceCatalogManager from '../components/ServiceCatalogManager';

const ProtectedRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes({ user, onLoginSuccess, onLogout }) {
    return (
        <Routes>
            <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
            
            <Route path="/" element={
                <ProtectedRoute user={user}>
                    <DashboardLayout onLogout={onLogout} />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardPage user={user} />} />
                <Route path="catalogos" element={<ServiceCatalogManager />} />
            </Route>

            <Route path="*" element={<div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}><h2>404 - Página no encontrada</h2></div>} />
        </Routes>
    );
}