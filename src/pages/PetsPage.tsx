import { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import { ownerService } from '../services/ownerService';
import type { Pet, CreatePetDto, Owner } from '../types';
import Message from '../components/Message';

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreatePetDto>({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    ownerId: 0,
  });

  useEffect(() => {
    loadPets();
    loadOwners();
  }, []);

  const loadPets = async () => {
    try {
      const data = await petService.getAll();
      setPets(data);
    } catch {
      showMessage('error', 'Error al cargar mascotas');
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'ownerId' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        const { name, species, breed, birthDate } = formData;
        await petService.update(currentId, { name, species, breed, birthDate });
        showMessage('success', 'Mascota actualizada');
      } else {
        await petService.create(formData);
        showMessage('success', 'Mascota creada');
      }
      clearForm();
      loadPets();
    } catch {
      showMessage('error', 'Error al guardar mascota');
    }
  };

  const handleEdit = (pet: Pet) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birthDate.split('T')[0],
      ownerId: pet.ownerId,
    });
    setCurrentId(pet.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta mascota?')) return;
    try {
      await petService.delete(id);
      showMessage('success', 'Mascota eliminada');
      loadPets();
    } catch {
      showMessage('error', 'Error al eliminar. Puede tener citas asociadas.');
    }
  };

  const clearForm = () => {
    setFormData({ name: '', species: '', breed: '', birthDate: '', ownerId: 0 });
    setCurrentId(null);
    setIsEditing(false);
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200";
  const selectClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-2";
  const btnPrimary = "px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";
  const btnSecondary = "px-6 py-2.5 bg-gray-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";

  const speciesEmoji: Record<string, string> = {
    'Perro': '🐕',
    'Gato': '🐈',
    'Ave': '🐦',
    'Conejo': '🐰',
    'Otro': '🐾',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-md">Mascotas</h1>

      <Message type={message.type} text={message.text} />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 pb-4 mb-5 border-b-2 border-blue-500">
          {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Max"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Especie</label>
              <select name="species" value={formData.species} onChange={handleChange} required className={selectClass}>
                <option value="">Seleccionar...</option>
                <option value="Perro">🐕 Perro</option>
                <option value="Gato">🐈 Gato</option>
                <option value="Ave">🐦 Ave</option>
                <option value="Conejo">🐰 Conejo</option>
                <option value="Otro">🐾 Otro</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Raza</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Labrador"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Propietario</label>
              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                required
                disabled={isEditing}
                className={selectClass}
              >
                <option value={0}>Seleccionar...</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.fullName}
                  </option>
                ))}
              </select>
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

      {pets.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Especie</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Raza</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Edad</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Propietario</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-4 text-sm text-gray-700">{pet.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-800 font-medium">{pet.name}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                      <span>{speciesEmoji[pet.species] || '🐾'}</span>
                      {pet.species}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{pet.breed}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                      {pet.ageInYears} años
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{pet.ownerName}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-semibold rounded-md hover:bg-cyan-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
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

      {pets.length === 0 && (
        <div className="text-center py-12 text-white/90 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-lg">No hay mascotas registradas</p>
        </div>
      )}
    </div>
  );
};

export default PetsPage;
