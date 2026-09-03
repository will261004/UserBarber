import { useState, useEffect } from 'react';
import {
    getAppointments,
    createAppointment,
    deleteAppointment,
    logout,
    getToken,
    getCurrentUser
} from './services/api';
import Login from './components/Login';
import AppointmentForm from './components/AppointmentForm';
import AppointmentsList from './components/AppointmentsList';
import RegisterUserForm from './components/RegisterUserForm'; // <-- Importamos el componente de registro
import './App.css';

function App() {
    const [user, setUser] = useState(getCurrentUser());
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        if (user && getToken()) {
            loadAppointments();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        setAppointments([]);
    };

    const handleCreateAppointment = async (form) => {
        await createAppointment(form);
        await loadAppointments();
    };

    const handleDeleteAppointment = async (id) => {
        await deleteAppointment(id);
        await loadAppointments();
    };

    // PANTALLA DE LOGIN
    if (!user) {
        return <Login onLoginSuccess={(userData) => setUser(userData)} />;
    }

    // PANEL PRINCIPAL
    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50' }}>UserBarber</h1>
                <p style={{ color: '#7f8c8d', margin: '5px 0' }}>Bienvenido, <strong>{user.name}</strong></p>
                <p style={{ color: '#7f8c8d', margin: '5px 0 15px 0', textTransform: 'capitalize' }}>Rol: <strong>{user.role}</strong></p>
                <button
                    onClick={handleLogout}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar sesión
                </button>
            </header>

            {error && (
                <div style={{ background: '#ffdddd', color: '#d8000c', padding: '10px', marginBottom: '15px', borderRadius: '5px' }}>
                    {error}
                </div>
            )}

            {/* Formulario para registrar nuevas citas */}
            <AppointmentForm onAppointmentCreated={() => loadAppointments()} />

            {/* Formulario para registrar nuevos usuarios/barberos */}
            <RegisterUserForm />

            {/* Listado de citas */}
            <AppointmentsList appointments={appointments} onDelete={handleDeleteAppointment} />
        </div>
    );
}

export default App;