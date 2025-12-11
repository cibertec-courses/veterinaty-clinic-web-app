import { useState, useEffect } from 'react';
import { ownerService } from '../services/ownerService';
import type { Owner, CreateOwnerDto } from '../types';
import Message from '../components/Message';

const OwnersPage = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
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

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-2";
  const btnPrimary = "px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";
  const btnSecondary = "px-6 py-2.5 bg-gray-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-md">Propietarios</h1>

      <Message type={message.type} text={message.text} />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 pb-4 mb-5 border-b-2 border-blue-500">
          {isEditing ? 'Editar Propietario' : 'Nuevo Propietario'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Juan"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="999888777"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@mail.com"
                required
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className={btnPrimary}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" className={btnSecondary} onClick={clearForm}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {owners.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre Completo</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Mascotas</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-4 text-sm text-gray-700">{owner.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-800 font-medium">{owner.fullName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{owner.phone}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{owner.email}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {owner.petCount}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(owner)}
                        className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-semibold rounded-md hover:bg-cyan-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(owner.id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {owners.length === 0 && (
        <div className="text-center py-12 text-white/90 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-lg">No hay propietarios registrados</p>
        </div>
      )}
    </div>
  );
};

export default OwnersPage;
