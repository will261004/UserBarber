import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, getServices, createService, deleteService } from '../services/api';

export default function ServiceCatalogManager() {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    
    // Estados para los formularios
    const [categoryName, setCategoryName] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const loadData = async () => {
        try {
            const [cats, servs] = await Promise.all([getCategories(), getServices()]);
            setCategories(cats || []);
            setServices(servs || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;
        try {
            await createCategory({ name: categoryName });
            setCategoryName('');
            setMessage({ text: 'Categoría creada con éxito', type: 'success' });
            loadData();
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Error al crear la categoría', type: 'error' });
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        if (!serviceName.trim() || !servicePrice || !selectedCategoryId) return;
        try {
            await createService({ 
                name: serviceName, 
                price: servicePrice, 
                category_id: selectedCategoryId 
            });
            setServiceName('');
            setServicePrice('');
            setSelectedCategoryId('');
            setMessage({ text: 'Servicio creado con éxito', type: 'success' });
            loadData();
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Error al crear el servicio', type: 'error' });
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
        try {
            await deleteService(id);
            setMessage({ text: 'Servicio eliminado', type: 'success' });
            loadData();
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Error al eliminar', type: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', color: '#f3f4f6', paddingBottom: '30px' }}>
            
            {/* Tarjeta Contenedora Principal */}
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa', textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '15px' }}>
                    Catálogo de Servicios y Categorías
                </h2>

                {message.text && (
                    <div style={{ background: message.type === 'success' ? '#065f46' : '#7f1d1d', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                        {message.text}
                    </div>
                )}

                {/* Sección Superior: Formularios en 2 Columnas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    
                    {/* Formulario Nueva Categoría */}
                    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '18px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#93c5fd', marginBottom: '14px', textAlign: 'center' }}>Nueva Categoría</h3>
                        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Nombre de la Categoría:</label>
                                <input 
                                    type="text" 
                                    value={categoryName} 
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    placeholder="Ej. Cortes, Barbería, Tintes" 
                                    required 
                                    style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#1f2937', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                style={{ marginTop: '6px', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                Guardar Categoría
                            </button>
                        </form>
                    </div>

                    {/* Formulario Nuevo Servicio */}
                    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '18px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#93c5fd', marginBottom: '14px', textAlign: 'center' }}>Nuevo Servicio</h3>
                        <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Categoría:</label>
                                <select 
                                    value={selectedCategoryId} 
                                    onChange={(e) => setSelectedCategoryId(e.target.value)} 
                                    required 
                                    style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#1f2937', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Nombre del Servicio:</label>
                                <input 
                                    type="text" 
                                    value={serviceName} 
                                    onChange={(e) => setServiceName(e.target.value)} 
                                    placeholder="Ej. Corte Clásico" 
                                    required 
                                    style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#1f2937', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Precio ($):</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={servicePrice} 
                                    onChange={(e) => setServicePrice(e.target.value)} 
                                    placeholder="0.00" 
                                    required 
                                    style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#1f2937', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                style={{ marginTop: '2px', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                Guardar Servicio
                            </button>
                        </form>
                    </div>

                </div>

                {/* Sección Inferior: Listado de Servicios Disponibles */}
                <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '18px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#93c5fd', marginBottom: '14px', textAlign: 'center' }}>Servicios Disponibles en el Sistema</h3>
                    
                    {services.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem', margin: '20px 0' }}>No hay servicios registrados aún.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {services.map((service) => (
                                <div 
                                    key={service.id} 
                                    style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#fff' }}>{service.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>
                                            Precio: <strong style={{ color: '#34d399' }}>${service.price}</strong>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteService(service.id)}
                                        style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}