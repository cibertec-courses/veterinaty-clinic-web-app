import api from './api';
import type { Pet, CreatePetDto, UpdatePetDto } from '../types';

export const petService = {
  getAll: async (): Promise<Pet[]> => {
    const response = await api.get('/pets');
    return response.data;
  },

  getById: async (id: number): Promise<Pet> => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  getByOwnerId: async (ownerId: number): Promise<Pet[]> => {
    const response = await api.get(`/pets/owner/${ownerId}`);
    return response.data;
  },

  create: async (data: CreatePetDto): Promise<Pet> => {
    const response = await api.post('/pets', data);
    return response.data;
  },

  update: async (id: number, data: UpdatePetDto): Promise<Pet> => {
    const response = await api.put(`/pets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`);
  },
};