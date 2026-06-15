import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../api/api';
import { TrendingUp, Users, DollarSign, Edit, XCircle, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface PerformanceMetrics {
  totalAppointments: number;
  totalRevenue: number;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Appointment {
  id: number;
  dateTime: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    id: number;
    serviceCatalog: {
      id: number;
      name: string;
      price: number;
    };
    status: string;
  }[];
}

const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({ dateTime: '', serviceIds: [] as number[] });

  const fetchData = useCallback(async () => {
    try {
      const [apptsRes, metricsRes, servicesRes] = await Promise.all([
        api.get('/admin/appointments'),
        api.get('/admin/dashboard/metrics'),
        api.get('/services')
      ]);
      setAppointments(apptsRes.data);
      setMetrics(metricsRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const calculateAverageTicket = () => {
    if (!metrics || metrics.totalAppointments === 0) return 0;
    return metrics.totalRevenue / metrics.totalAppointments;
  };

  const handleConfirm = async (id: number) => {
    try {
      await api.patch(`/admin/appointments/${id}/confirm`);
      setRefreshTrigger(prev => prev + 1);
    } catch {
      alert('Erro ao confirmar agendamento');
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Confirmar cancelamento administrativo?')) return;
    try {
      await api.post(`/admin/appointments/${id}/cancel`);
      setRefreshTrigger(prev => prev + 1);
    } catch {
      alert('Erro ao cancelar agendamento');
    }
  };

  const updateItemStatus = async (itemId: number, status: string) => {
    try {
      await api.patch(`/admin/appointments/items/${itemId}/status`, { status });
      setRefreshTrigger(prev => prev + 1);
    } catch {
      alert('Erro ao atualizar status do serviço');
    }
  };

  const startEdit = (appt: Appointment) => {
    setEditingAppt(appt);
    setEditForm({
      dateTime: appt.dateTime.substring(0, 16),
      serviceIds: appt.items.map(i => i.serviceCatalog.id)
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppt) return;
    try {
      await api.put(`/admin/appointments/${editingAppt.id}`, {
        dateTime: editForm.dateTime.includes('T') ? editForm.dateTime : `${editForm.dateTime}:00`,
        serviceIds: editForm.serviceIds
      });
      setEditingAppt(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Erro ao atualizar agendamento');
    }
  };

  const toggleServiceInEdit = (id: number) => {
    setEditForm(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) 
        ? prev.serviceIds.filter(sid => sid !== id)
        : [...prev.serviceIds, id]
    }));
  };

  return (
    <Layout title="Painel Administrativo">
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-pink-100 rounded-full text-pink-600 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receita Semanal</p>
              <p className="text-2xl font-bold text-gray-900">R$ {metrics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Atendimentos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalAppointments}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">R$ {calculateAverageTicket().toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviços</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Geral</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appt) => (
              <tr key={appt.id} className={appt.status === 'CANCELED' ? 'bg-gray-50 opacity-60' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{appt.user?.name || 'Cliente'}</div>
                  <div className="text-sm text-gray-500">{appt.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(appt.dateTime), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {appt.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{item.serviceCatalog.name}</span>
                        {appt.status !== 'CANCELED' && (
                          <select 
                            className="ml-2 border-none bg-transparent text-pink-600 font-semibold focus:ring-0"
                            value={item.status}
                            onChange={(e) => updateItemStatus(item.id, e.target.value)}
                          >
                            <option value="PENDING">Pendente</option>
                            <option value="COMPLETED">Concluído</option>
                            <option value="CANCELED">Cancelado</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appt.status === 'CONFIRMADO' || appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                    appt.status === 'CANCELED' || appt.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {appt.status !== 'CANCELED' && (
                    <div className="flex justify-end space-x-3">
                      {appt.status === 'PENDENTE' || appt.status === 'PENDING' && (
                        <button onClick={() => handleConfirm(appt.id)} className="text-green-600 hover:text-green-900" title="Confirmar">
                          <Check size={18} />
                        </button>
                      )}
                      <button onClick={() => startEdit(appt)} className="text-blue-600 hover:text-blue-900" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleCancel(appt.id)} className="text-red-600 hover:text-red-900" title="Cancelar">
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAppt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-8 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Editar Agendamento #{editingAppt.id}</h3>
              <button onClick={() => setEditingAppt(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={editForm.dateTime}
                  onChange={(e) => setEditForm({ ...editForm, dateTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviços</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 p-2 rounded-md">
                  {services.map(service => (
                    <div 
                      key={service.id}
                      onClick={() => toggleServiceInEdit(service.id)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        editForm.serviceIds.includes(service.id) ? 'bg-pink-50 border-pink-200 border' : 'border border-transparent'
                      }`}
                    >
                      <span className="text-sm">{service.name}</span>
                      <span className="text-xs font-bold text-pink-600">R$ {service.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingAppt(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 font-bold"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
