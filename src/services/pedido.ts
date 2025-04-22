import axios from 'axios';
import { api } from '@/config/api'


export const getPedidos = async () => {
  const response = await api.get('/pedidos');
  return response.data;
};
