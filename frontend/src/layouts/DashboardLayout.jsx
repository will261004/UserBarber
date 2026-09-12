import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ onLogout }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogoutClick = () => {
        if (onLogout) onLogout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111827', color: '#fff' }}>
            {/* Sidebar / Menú Lateral */}
            <aside style={{ width: '250px', background: '#1f2937', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #374151' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#60a5fa' }}>UserBarber</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <NavLink 
                        to="/" 
                        end
                        style={({ isActive }) => ({ padding: '10px', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: isActive ? '#3b82f6' : 'transparent' })}
                    >
                        Dashboard (Citas)
                    </NavLink>
                    <NavLink 
                        to="/catalogos" 
                        style={({ isActive }) => ({ padding: '10px', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: isActive ? '#3b82f6' : 'transparent' })}
                    >
                        Catálogos y Servicios
                    </NavLink>
                </nav>
                <button 
                    onClick={handleLogoutClick} 
                    style={{ padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar Sesión
                </button>
            </aside>

            {/* Main Area / Contenido Dinámico */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header style={{ height: '60px', background: '#1f2937', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 20px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Usuario: <strong>{user.name || 'Administrador'}</strong></span>
                </header>
                <main style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#0b0f19' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}