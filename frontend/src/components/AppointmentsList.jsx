import React from 'react';

export default function AppointmentsList({ appointments, onDelete }) {
    if (!appointments || appointments.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                <p>No hay citas programadas por el momento.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>Citas Programadas</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {appointments.map((appointment) => (
                    <div 
                        key={appointment.id} 
                        style={{ 
                            background: '#111827', 
                            border: '1px solid #374151', 
                            borderRadius: '8px', 
                            padding: '14px 18px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>
                                {appointment.client_name || appointment.name}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                📅 {appointment.date || 'Fecha no definida'} &nbsp;|&nbsp; ⏰ {appointment.time || 'Hora no definida'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '600', marginTop: '2px' }}>
                                {appointment.status || 'Confirmada'}
                            </span>
                        </div>

                        <button 
                            onClick={() => onDelete(appointment.id)}
                            style={{ 
                                background: '#dc2626', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '6px', 
                                fontSize: '0.85rem', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}