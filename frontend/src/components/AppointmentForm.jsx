// src/components/AppointmentForm.jsx
import React, { useState } from 'react';
import { createAppointment } from '../services/appointmentService';

export default function AppointmentForm({ onAppointmentCreated }) {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Llamada al servicio que hace el POST hacia la API de Laravel
      await createAppointment({
        client_name: clientName,
        date: date,
        time: time
      });

      setSuccessMessage('¡Cita guardada exitosamente en MySQL!');
      setClientName('');
      setDate('');
      setTime('');

      // Si pasamos una función para recargar la lista, la ejecutamos
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
    } catch (err) {
      setError(err.message || 'Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-zinc-900 border border-amber-500/30 rounded-xl p-6 shadow-xl mb-6">
      <h2 className="text-xl font-bold text-amber-400 mb-4 text-center">Registrar Nueva Cita</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 text-red-400 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-300 mb-1">Nombre del Cliente:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            placeholder="Ej. Juan Pérez"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-1">Día de la Cita:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-1">Hora de la Cita:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Guardando en base de datos...' : 'Guardar Cita'}
        </button>
      </form>
    </div>
  );
}