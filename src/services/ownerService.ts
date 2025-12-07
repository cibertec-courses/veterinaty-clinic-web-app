import api from './api';
import type { Owner, CreateOwnerDto, UpdateOwnerDto } from '../types';

export const ownerService = {
  getAll: async (): Promise<Owner[]> => {
    const response = await api.get('/owners');
    return response.data;
  },

  getById: async (id: number): Promise<Owner> => {
    const response = await api.get(`/owners/${id}`);
    return response.data;
  },

  create: async (data: CreateOwnerDto): Promise<Owner> => {
    const response = await api.post('/owners', data);
    return response.data;
  },

  update: async (id: number, data: UpdateOwnerDto): Promise<Owner> => {
    const response = await api.put(`/owners/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/owners/${id}`);
  },
};