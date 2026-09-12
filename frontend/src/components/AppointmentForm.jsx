import React, { useState } from 'react';
import { createAppointment } from '../services/api';

export default function AppointmentForm({ onAppointmentCreated }) {
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createAppointment({ client_name: clientName, date, time });
            setClientName('');
            setDate('');
            setTime('');
            setSuccess(true);
            if (onAppointmentCreated) onAppointmentCreated();
        } catch (err) {
            console.error(err);
            setError('Error al registrar la cita. Verifique los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#60a5fa', marginBottom: '4px', textAlign: 'center' }}>Registrar Nueva Cita</h3>

            {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' }}>{error}</div>}
            {success && <div style={{ background: '#065f46', color: '#6ee7b7', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' }}>¡Cita registrada con éxito!</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#d1d5db' }}>Nombre del Cliente:</label>
                <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="Ej. Juan Pérez" 
                    required 
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#d1d5db' }}>Día de la Cita:</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#d1d5db' }}>Hora de la Cita:</label>
                <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    required 
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                style={{ marginTop: '8px', padding: '11px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s' }}
            >
                {loading ? 'Guardando...' : 'Guardar Cita'}
            </button>
        </form>
    );
}