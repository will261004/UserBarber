import { useState } from 'react';

import { createUser } from '../services/api';

export default function RegisterUserForm() {

const [userForm, setUserForm] = useState({

    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'barber'

});

const [userSuccessMessage, setUserSuccessMessage] = useState('');
const [userError, setUserError] = useState('');
const [userLoading, setUserLoading] = useState(false);

const handleCreateUser = async (e) => {

    e.preventDefault();

    setUserError('');
    setUserSuccessMessage('');
    setUserLoading(true);

    try {

        await createUser(userForm);

        setUserSuccessMessage('¡Usuario creado con éxito!');

        setUserForm({

            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'barber'

        });

    } catch (err) {

        console.error(err);

        setUserError(
            err.response?.data?.message ||
            'Error al registrar el usuario. Revisa los campos.'
        );

    } finally {

        setUserLoading(false);

    }

};

return (

    <form
        onSubmit={handleCreateUser}
        style={{
            background: '#f1f5f9',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
        }}
    >

        <h3 style={{ marginTop: 0, color: '#1e293b' }}>
            Registrar Nuevo Usuario / Barbero
        </h3>

        {userSuccessMessage && (

            <div
                style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    fontSize: '14px'
                }}
            >
                {userSuccessMessage}
            </div>

        )}

        {userError && (

            <div
                style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    fontSize: '14px'
                }}
            >
                {userError}
            </div>

        )}

        <div style={{ marginBottom: '15px' }}>

            <label
                style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}
            >
                Nombre:
            </label>

            <input
                type="text"
                value={userForm.name}
                onChange={(e) =>
                    setUserForm({
                        ...userForm,
                        name: e.target.value
                    })
                }
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}
                placeholder="Nombre completo"
            />

        </div>

        <div style={{ marginBottom: '15px' }}>

            <label
                style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}
            >
                Correo Electrónico:
            </label>

            <input
                type="email"
                value={userForm.email}
                onChange={(e) =>
                    setUserForm({
                        ...userForm,
                        email: e.target.value
                    })
                }
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}
                placeholder="correo@example.com"
            />

        </div>

        <div style={{ marginBottom: '15px' }}>

            <label
                style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}
            >
                Contraseña:
            </label>

            <input
                type="password"
                value={userForm.password}
                onChange={(e) =>
                    setUserForm({
                        ...userForm,
                        password: e.target.value
                    })
                }
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}
                placeholder="Mínimo 6 caracteres"
            />

        </div>

        <div style={{ marginBottom: '15px' }}>

            <label
                style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}
            >
                Confirmar Contraseña:
            </label>

            <input
                type="password"
                value={userForm.password_confirmation}
                onChange={(e) =>
                    setUserForm({
                        ...userForm,
                        password_confirmation: e.target.value
                    })
                }
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}
                placeholder="Confirma tu contraseña"
            />

        </div>

        <div style={{ marginBottom: '15px' }}>

            <label
                style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}
            >
                Rol:
            </label>

            <select
                value={userForm.role}
                onChange={(e) =>
                    setUserForm({
                        ...userForm,
                        role: e.target.value
                    })
                }
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}
            >

            <option value="user">Usuario</option>
            <option value="barber">Barbero</option>
            <option value="admin">Administrador</option>

            </select>

        </div>

        <button
            type="submit"
            disabled={userLoading}
            style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                width: '100%',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
            {userLoading ? 'Registrando...' : 'Crear Usuario'}
        </button>

    </form>

);
}
