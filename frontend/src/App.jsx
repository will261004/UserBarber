import { useState, useEffect } from 'react';
import {
    getAppointments,
    createAppointment,
    login,
    logout,
    getToken,
    getCurrentUser
} from './services/api';
import './App.css';

function App() {
    const [user, setUser] = useState(getCurrentUser());
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({
        client_name: '',
        appointment_date: '',
        appointment_time: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && getToken()) {
            loadAppointments();
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoginError('');
        setLoginLoading(true);

        try {
            const data = await login(email, password);
            setUser(data.user);
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);

            if (err.response?.status === 422 || err.response?.status === 401) {
                setLoginError('Correo o contraseña incorrectos.');
            } else {
                setLoginError('No se pudo conectar con el servidor.');
            }
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }

        setUser(null);
        setAppointments([]);
    };

    const loadAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar las citas.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createAppointment(form);

            setForm({
                client_name: '',
                appointment_date: '',
                appointment_time: ''
            });

            await loadAppointments();
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al guardar la cita. Revisa los datos.');
        } finally {
            setLoading(false);
        }
    };

    // PANTALLA DE LOGIN (Si no hay usuario autenticado)
    if (!user) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#111827',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <div
                    style={{
                        background: '#1f2937',
                        padding: '40px',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        color: '#fff'
                    }}
                >
                    <header style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <h1 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '28px' }}>UserBarber</h1>
                        <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
                            Inicia sesión para acceder a la agenda
                        </p>
                    </header>

                    {loginError && (
                        <div
                            style={{
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                padding: '12px',
                                marginBottom: '20px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                textAlign: 'center'
                            }}
                        >
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#d1d5db'
                                }}
                            >
                                Correo electrónico:
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #4b5563',
                                    background: '#374151',
                                    color: '#fff',
                                    boxSizing: 'border-box',
                                    fontSize: '14px'
                                }}
                                placeholder="correo@example.com"
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#d1d5db'
                                }}
                            >
                                Contraseña:
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #4b5563',
                                    background: '#374151',
                                    color: '#fff',
                                    boxSizing: 'border-box',
                                    fontSize: '14px'
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                width: '100%',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            {loginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // APLICACIÓN DESPUÉS DEL LOGIN (Agenda y Panel)
    return (
        <div
            style={{
                maxWidth: '600px',
                margin: '40px auto',
                padding: '20px',
                fontFamily: 'Arial, sans-serif'
            }}
        >
            <header
                style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                }}
            >
                <h1 style={{ color: '#2c3e50' }}>UserBarber</h1>

                <p style={{ color: '#7f8c8d', margin: '5px 0' }}>
                    Bienvenido, <strong>{user.name}</strong>
                </p>

                <p style={{ color: '#7f8c8d', margin: '5px 0 15px 0', textTransform: 'capitalize' }}>
                    Rol: <strong>{user.role}</strong>
                </p>

                <button
                    onClick={handleLogout}
                    style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Cerrar sesión
                </button>
            </header>

            {error && (
                <div
                    style={{
                        background: '#ffdddd',
                        color: '#d8000c',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '5px'
                    }}
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}
            >
                <h3>Registrar Nueva Cita</h3>

                <div style={{ marginBottom: '15px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        Nombre del Cliente:
                    </label>

                    <input
                        type="text"
                        value={form.client_name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                client_name: e.target.value
                            })
                        }
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Ej. Juan Pérez"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        Día de la Cita:
                    </label>

                    <input
                        type="date"
                        value={form.appointment_date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                appointment_date: e.target.value
                            })
                        }
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        Hora de la Cita:
                    </label>

                    <input
                        type="time"
                        value={form.appointment_time}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                appointment_time: e.target.value
                            })
                        }
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        width: '100%',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cita'}
                </button>
            </form>

            <div>
                <h3>Citas Programadas</h3>

                {appointments.length === 0 ? (
                    <p style={{ color: '#95a5a6' }}>
                        No hay citas registradas todavía.
                    </p>
                ) : (
                    <ul
                        style={{
                            listStyle: 'none',
                            padding: 0
                        }}
                    >
                        {appointments.map((app) => (
                            <li
                                key={app.id}
                                style={{
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <strong>{app.client_name}</strong>
                                </div>

                                <div style={{ color: '#555' }}>
                                    📅 {app.appointment_date} | ⏰{' '}
                                    {app.appointment_time}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;