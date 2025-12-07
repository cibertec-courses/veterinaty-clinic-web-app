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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'status-scheduled';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="page">
      <h1>Citas</h1>

      <Message type={message.type} text={message.text} />

      <div className="form-section">
        <h3>{isEditing ? 'Editar Cita' : 'Nueva Cita'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Mascota</label>
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
                disabled={isEditing}
              >
                <option value={0}>Seleccionar...</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.ownerName})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha y Hora</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Motivo</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Vacunación, Control, etc."
                required
              />
            </div>
            {isEditing && (
              <>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Scheduled">Programada</option>
                    <option value="Completed">Completada</option>
                    <option value="Cancelled">Cancelada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notas</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Notas del veterinario"
                  />
                </div>
              </>
            )}
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
            <th>Fecha</th>
            <th>Mascota</th>
            <th>Propietario</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{formatDate(appointment.appointmentDate)}</td>
              <td>{appointment.petName}</td>
              <td>{appointment.ownerName}</td>
              <td>{appointment.reason}</td>
              <td className={getStatusClass(appointment.status)}>{appointment.status}</td>
              <td className="actions">
                <button className="btn btn-info btn-small" onClick={() => handleEdit(appointment)}>
                  Editar
                </button>
                {appointment.canBeCancelled && (
                  <button className="btn btn-warning btn-small" onClick={() => handleCancel(appointment.id)}>
                    Cancelar
                  </button>
                )}
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(appointment.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <p className="empty-message">No hay citas registradas</p>
      )}
    </div>
  );
};

export default AppointmentsPage;