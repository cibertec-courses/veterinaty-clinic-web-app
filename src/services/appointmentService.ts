import api from './api';
import type { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '../types';

export const appointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  getByPetId: async (petId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments/pet/${petId}`);
    return response.data;
  },

  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await api.patch(`/appointments/${id}/cancel`);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};