// src/components/AppointmentsList.jsx
import React, { useState, useEffect } from 'react';
import { getAppointments } from '../services/appointmentService';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar las citas programadas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Estado de carga (Loading)
  if (loading) {
    return (
      <div className="p-4 text-center text-amber-400 font-semibold">
        Cargando citas programadas...
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold bg-red-950/20 rounded-lg border border-red-500/30">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-6 bg-zinc-900 border border-amber-500/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-amber-400 mb-4 text-center">Citas Programadas</h2>
      
      {appointments.length === 0 ? (
        <p className="text-zinc-400 text-center">No hay citas registradas todavía.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((item) => (
            <li key={item.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">{item.client_name || item.nombre_cliente}</p>
                <p className="text-xs text-zinc-400">Fecha: {item.date || item.fecha} - Hora: {item.time || item.hora}</p>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                Confirmada
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}