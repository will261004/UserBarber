import React, { useState } from 'react';
import { login as apiLogin, registerUser } from '../services/api';

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
            // Usamos la función oficial del api.js que ya maneja correctamente el token y el almacenamiento del usuario
            const data = await apiLogin(email, password);
            
            // onLoginSuccess espera recibir los datos del usuario para actualizar el estado en App.jsx
            onLoginSuccess(data.user);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            await registerUser({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setSuccessMessage('¡Usuario registrado exitosamente!');
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
            
            // Regresar al login después de unos segundos
            setTimeout(() => {
                setIsRegistering(false);
                setSuccessMessage('');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al registrar el usuario');
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
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff', boxSizing: 'border-box' }}
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
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setEmail ? setPassword(e.target.value) : null} // Mantener captura limpia de password
                        onInput={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff', boxSizing: 'border-box' }}
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
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #4b5563', background: '#374151', color: '#fff', boxSizing: 'border-box' }}
                        />
                    </div>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
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