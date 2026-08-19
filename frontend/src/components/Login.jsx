import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Guardamos el token y el rol en localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('userName', data.user.name);

            // Avisamos al componente principal que ya entramos
            onLoginSuccess();

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: '#fff' }}>
            <form onSubmit={handleLogin} style={{ background: '#1f2937', padding: '30px', borderRadius: '8px', width: '320px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión - UserBarber</h2>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
}