import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export async function getAppointments() {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
}

export async function createAppointment(data) {
    const response = await axios.post(`${API_URL}/appointments`, data);
    return response.data;
}