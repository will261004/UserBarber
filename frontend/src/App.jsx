import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { getCurrentUser } from './services/api';

export default function App() {
    const [user, setUser] = useState(() => getCurrentUser());

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AppRoutes 
            user={user} 
            onLoginSuccess={handleLoginSuccess} 
            onLogout={handleLogout} 
        />
    );
}