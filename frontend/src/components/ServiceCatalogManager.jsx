import { useState, useEffect } from 'react';
import { getCategories, createCategory, getServices, createService } from '../services/api';

export default function ServiceCatalogManager() {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    
    // Formulario Categoría
    const [categoryName, setCategoryName] = useState('');
    
    // Formulario Servicio
    const [serviceForm, setServiceForm] = useState({
        category_id: '',
        name: '',
        price: '',
        duration_minutes: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadData = async () => {
        try {
            const catData = await getCategories();
            const servData = await getServices();
            setCategories(catData);
            setServices(servData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ name: categoryName });
            setCategoryName('');
            setSuccess('Categoría creada con éxito');
            setError('');
            loadData();
        } catch (err) {
            console.error(err);
            setError('Error al crear la categoría');
            setSuccess('');
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            await createService(serviceForm);
            setServiceForm({ category_id: '', name: '', price: '', duration_minutes: '' });
            setSuccess('Servicio creado con éxito');
            setError('');
            loadData();
        } catch (err) {
            console.error(err);
            setError('Error al crear el servicio');
            setSuccess('');
        }
    };

    return (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1e293b', marginTop: 0 }}>Catálogo de Servicios y Categorías</h3>
            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
            {success && <p style={{ color: 'green', fontSize: '14px' }}>{success}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                
                {/* Formulario Categorías */}
                <form onSubmit={handleCategorySubmit} style={{ background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>Nueva Categoría</h4>
                    <input
                        type="text"
                        placeholder="Ej. Cortes, Barbería, Tintes"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Guardar Categoría
                    </button>
                </form>

                {/* Formulario Servicios */}
                <form onSubmit={handleServiceSubmit} style={{ background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>Nuevo Servicio</h4>
                    <select
                        value={serviceForm.category_id}
                        onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Nombre (Ej. Corte Clásico)"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio ($)"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Guardar Servicio
                    </button>
                </form>

            </div>

            {/* Listado rápido de lo registrado */}
            <div style={{ marginTop: '20px', background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>Servicios Disponibles en el Sistema</h4>
                {services.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No hay servicios registrados aún.</p>
                ) : (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {services.map((s) => (
                            <li key={s.id} style={{ fontSize: '14px', color: '#334155', marginBottom: '5px' }}>
                                <strong>{s.name}</strong> — ${s.price} 
                                <span style={{ color: '#64748b', fontSize: '12px' }}> ({s.category?.name || 'Sin categoría'})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}