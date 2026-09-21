import React, { useState } from 'react';

export default function AppointmentsList({ appointments, onDelete }) {

const [searchTerm, setSearchTerm] = useState('');

// Filtrar citas en tiempo real por el nombre del cliente
const filteredAppointments = (appointments || []).filter((appointment) => {

    const clientName = appointment.client_name || appointment.name || '';

    return clientName.toLowerCase().includes(searchTerm.toLowerCase());

});

return (

    <div style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>
            Citas Programadas
        </h3>

        {/* Barra de Búsqueda y Filtro requerida */}
        <div style={{ marginBottom: '4px' }}>

            <input
                type="text"
                placeholder=" Buscar cita por nombre de cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #4b5563',
                    background: '#111827',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                }}
            />

        </div>

        {filteredAppointments.length === 0 ? (

            <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>

                <p>No se encontraron citas que coincidan con la búsqueda.</p>

            </div>

        ) : (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {filteredAppointments.map((appointment) => (

                    <div
                        key={appointment.id}
                        style={{
                            background: '#111827',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.05rem' }}>
                                {appointment.client_name || appointment.name || 'Cliente sin nombre'}
                            </span>

                            <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                                📅 {appointment.appointment_date || 'Fecha no definida'} &nbsp;|&nbsp; ⏰ {appointment.appointment_time || 'Hora no definida'}
                            </span>

                            <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '600' }}>
                                {appointment.status || 'Confirmada'}
                            </span>

                        </div>

                        <button
                            onClick={() => onDelete(appointment.id)}
                            style={{
                                background: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 14px',
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

        )}

    </div>

);
 }