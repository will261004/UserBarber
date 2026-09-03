import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export async function login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
}

export async function logout() {
    const token = localStorage.getItem('token');

    if (token) {
        await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
}

export async function getAppointments() {
    const token = getToken();

    const response = await axios.get(`${API_URL}/appointments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function createAppointment(data) {
    const token = getToken();

    const response = await axios.post(
        `${API_URL}/appointments`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function getUsers() {
    const token = getToken();

    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function createUser(data) {
    const token = getToken();

    const response = await axios.post(
        `${API_URL}/users`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

// Alias añadido para que coincida exactamente con la importación del formulario de registro
export async function registerUser(data) {
    return await createUser(data);
}

export async function updateUser(id, data) {
    const token = getToken();

    const response = await axios.put(
        `${API_URL}/users/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function deleteUser(id) {
    const token = getToken();

    const response = await axios.delete(
        `${API_URL}/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

// Función adicional para eliminar citas si la usas en tu panel
export async function deleteAppointment(id) {
    const token = getToken();

    const response = await axios.delete(
        `${API_URL}/appointments/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}