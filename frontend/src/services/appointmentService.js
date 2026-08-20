// src/services/appointmentService.js

const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAppointments = async () => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Error al obtener las citas');
  return await response.json();
};

export const createAppointment = async (appointmentData) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al guardar la cita');
  }
  return await response.json();
};