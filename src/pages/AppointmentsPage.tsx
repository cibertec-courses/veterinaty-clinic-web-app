import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { petService } from '../services/petService';
import type { Appointment, CreateAppointmentDto, UpdateAppointmentDto, Pet } from '../types';
import Message from '../components/Message';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAppointmentDto & { status: string; notes: string }>({
    appointmentDate: '',
    reason: '',
    petId: 0,
    status: 'Scheduled',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
    loadPets();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch {
      showMessage('error', 'Error al cargar citas');
    }
  };

  const loadPets = async () => {
    try {
      const data = await petService.getAll();
      setPets(data);
    } catch {
      showMessage('error', 'Error al cargar mascotas');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'petId' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        const updateData: UpdateAppointmentDto = {
          appointmentDate: formData.appointmentDate,
          reason: formData.reason,
          status: formData.status,
          notes: formData.notes || null,
        };
        await appointmentService.update(currentId, updateData);
        showMessage('success', 'Cita actualizada');
      } else {
        const createData: CreateAppointmentDto = {
          appointmentDate: formData.appointmentDate,
          reason: formData.reason,
          petId: formData.petId,
        };
        await appointmentService.create(createData);
        showMessage('success', 'Cita creada');
      }
      clearForm();
      loadAppointments();
    } catch {
      showMessage('error', 'Error al guardar cita');
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      appointmentDate: appointment.appointmentDate.slice(0, 16),
      reason: appointment.reason,
      petId: appointment.petId,
      status: appointment.status,
      notes: appointment.notes || '',
    });
    setCurrentId(appointment.id);
    setIsEditing(true);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      await appointmentService.cancel(id);
      showMessage('success', 'Cita cancelada');
      loadAppointments();
    } catch {
      showMessage('error', 'Error al cancelar cita');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await appointmentService.delete(id);
      showMessage('success', 'Cita eliminada');
      loadAppointments();
    } catch {
      showMessage('error', 'Error al eliminar cita');
    }
  };

  const clearForm = () => {
    setFormData({ appointmentDate: '', reason: '', petId: 0, status: 'Scheduled', notes: '' });
    setCurrentId(null);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Scheduled: 'bg-blue-100 text-blue-700',
      Completed: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    const labels: Record<string, string> = {
      Scheduled: 'Programada',
      Completed: 'Completada',
      Cancelled: 'Cancelada',
    };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200";
  const selectClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-2";
  const btnPrimary = "px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";
  const btnSecondary = "px-6 py-2.5 bg-gray-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide";

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-md">Citas</h1>

      <Message type={message.type} text={message.text} />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 pb-4 mb-5 border-b-2 border-blue-500">
          {isEditing ? 'Editar Cita' : 'Nueva Cita'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className={`grid gap-5 ${isEditing ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-3'}`}>
            <div>
              <label className={labelClass}>Mascota</label>
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
                disabled={isEditing}
                className={selectClass}
              >
                <option value={0}>Seleccionar...</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.ownerName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fecha y Hora</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Motivo</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Vacunación, Control, etc."
                required
                className={inputClass}
              />
            </div>
            {isEditing && (
              <>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                    <option value="Scheduled">Programada</option>
                    <option value="Completed">Completada</option>
                    <option value="Cancelled">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Notas</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Notas del veterinario"
                    className={inputClass}
                  />
                </div>
              </>
            )}
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

      {appointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Mascota</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Propietario</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Motivo</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-4 text-sm text-gray-700">{appointment.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-800 font-medium">{formatDate(appointment.appointmentDate)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{appointment.petName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{appointment.ownerName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{appointment.reason}</td>
                  <td className="px-5 py-4 text-sm">{getStatusBadge(appointment.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-semibold rounded-md hover:bg-cyan-600 transition-colors"
                      >
                        Editar
                      </button>
                      {appointment.canBeCancelled && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-md hover:bg-amber-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(appointment.id)}
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

      {appointments.length === 0 && (
        <div className="text-center py-12 text-white/90 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-lg">No hay citas registradas</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
