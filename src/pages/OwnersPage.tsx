import { useState, useEffect } from 'react';
import { ownerService } from '../services/ownerService';
import type { Owner, CreateOwnerDto } from '../types';
import Message from '../components/Message';

const OwnersPage = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateOwnerDto>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const data = await ownerService.getAll();
      setOwners(data);
    } catch {
      showMessage('error', 'Error al cargar propietarios');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await ownerService.update(currentId, formData);
        showMessage('success', 'Propietario actualizado');
      } else {
        await ownerService.create(formData);
        showMessage('success', 'Propietario creado');
      }
      clearForm();
      loadOwners();
    } catch {
      showMessage('error', 'Error al guardar propietario');
    }
  };

  const handleEdit = (owner: Owner) => {
    setFormData({
      firstName: owner.firstName,
      lastName: owner.lastName,
      phone: owner.phone,
      email: owner.email,
    });
    setCurrentId(owner.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este propietario?')) return;
    try {
      await ownerService.delete(id);
      showMessage('success', 'Propietario eliminado');
      loadOwners();
    } catch {
      showMessage('error', 'Error al eliminar. Puede tener mascotas asociadas.');
    }
  };

  const clearForm = () => {
    setFormData({ firstName: '', lastName: '', phone: '', email: '' });
    setCurrentId(null);
    setIsEditing(false);
  };

  return (
    <div className="page">
      <h1>Propietarios</h1>
      
      <Message type={message.type} text={message.text} />

      <div className="form-section">
        <h3>{isEditing ? 'Editar Propietario' : 'Nuevo Propietario'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="999888777"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@mail.com"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={clearForm}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Mascotas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>{owner.id}</td>
              <td>{owner.fullName}</td>
              <td>{owner.phone}</td>
              <td>{owner.email}</td>
              <td>{owner.petCount}</td>
              <td className="actions">
                <button className="btn btn-info btn-small" onClick={() => handleEdit(owner)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(owner.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {owners.length === 0 && (
        <p className="empty-message">No hay propietarios registrados</p>
      )}
    </div>
  );
};

export default OwnersPage;