import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

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

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('userName', data.user.name);

            onLoginSuccess();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el usuario');
            }

            setSuccessMessage('¡Usuario registrado exitosamente!');
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
            
            // Regresar al login después de unos segundos o dejarlo listo
            setTimeout(() => {
                setIsRegistering(false);
                setSuccessMessage('');
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: '#fff' }}>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ background: '#1f2937', padding: '30px', borderRadius: '8px', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión - UserBarber'}
                </h2>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
                {successMessage && <div style={{ color: '#10b981', marginBottom: '15px', fontSize: '14px' }}>{successMessage}</div>}
                
                {isRegistering && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                        />
                    </div>
                )}

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

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                    />
                </div>

                {isRegistering && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Confirmar Contraseña:</label>
                        <input 
                            type="password" 
                            value={passwordConfirmation} 
                            onChange={(e) => setPasswordConfirmation(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                        />
                    </div>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
                    {isRegistering ? 'Crear Usuario' : 'Entrar'}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <button 
                        type="button" 
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMessage(''); }}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
                    >
                        {isRegistering ? '¿Ya tienes cuenta? Iniciar Sesión' : '¿Agregar un nuevo usuario? Regístrate'}
                    </button>
                </div>
            </form>
        </div>
    );
}