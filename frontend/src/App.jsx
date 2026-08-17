¿import { useState, useEffect } from 'react';
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

            if (err.response?.status === 422) {
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

    // LOGIN
    if (!user) {
        return (
            <div
                style={{
                    maxWidth: '400px',
                    margin: '80px auto',
                    padding: '30px',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#2c3e50' }}>UserBarber</h1>
                    <p style={{ color: '#7f8c8d' }}>
                        Inicia sesión para continuar
                    </p>
                </header>

                {loginError && (
                    <div
                        style={{
                            background: '#ffdddd',
                            color: '#d8000c',
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '5px'
                        }}
                    >
                        {loginError}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    style={{
                        background: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold'
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
                                padding: '8px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="correo@example.com"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold'
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
                                padding: '8px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loginLoading}
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
                        {loginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        );
    }

    // APLICACIÓN DESPUÉS DEL LOGIN
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

                <p style={{ color: '#7f8c8d' }}>
                    Bienvenido, {user.name}
                </p>

                <p style={{ color: '#7f8c8d' }}>
                    Rol: {user.role}
                </p>

                <button
                    onClick={handleLogout}
                    style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
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