import React, { useState, useEffect } from 'react';
import { getAppointments, deleteAppointment, getToken } from '../services/api';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentsList from '../components/AppointmentsList';
import RegisterUserForm from '../components/RegisterUserForm';

export default function DashboardPage({ user }) {
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

    const handleDeleteAppointment = async (id) => {
        await deleteAppointment(id);
        await loadAppointments();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', color: '#f3f4f6', paddingBottom: '40px' }}>
            {/* Cabecera de la página */}
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #374151', paddingBottom: '15px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#60a5fa', margin: '0 0 5px 0' }}>Panel Principal de Citas</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>
                    Bienvenido, <strong style={{ color: '#fff' }}>{user?.name}</strong> <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', background: '#374151', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>{user?.role}</span>
                </p>
            </div>

            {error && (
                <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #991b1b' }}>
                    {error}
                </div>
            )}

            {/* Contenedores organizados en tarjetas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* Tarjeta de Registrar Cita */}
                <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <AppointmentForm onAppointmentCreated={() => loadAppointments()} />
                </div>

                {/* Tarjeta de Registro de Usuario */}
                <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <RegisterUserForm />
                </div>

                {/* Tarjeta de Citas Programadas */}
                <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <AppointmentsList appointments={appointments} onDelete={handleDeleteAppointment} />
                </div>

            </div>
        </div>
    );
}