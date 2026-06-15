import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/api';
import { Plus, Calendar, Clock, Edit2, Filter, XCircle } from 'lucide-react';
import { format, differenceInHours, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: number;
  dateTime: string;
  status: string;
  items: {
    id: number;
    serviceCatalog: {
      name: string;
      price: number;
    };
    status: string;
  }[];
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', `${startDate}T00:00:00`);
      if (endDate) params.append('endDate', `${endDate}T23:59:59`);
      
      const response = await api.get(`/appointments/history?${params.toString()}`);
      setAppointments(response.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const calculateTotal = (appointment: Appointment) => {
    return appointment.items.reduce((sum, item) => sum + item.serviceCatalog.price, 0);
  };

  const canModify = (dateTime: string) => {
    const diff = differenceInHours(new Date(dateTime), new Date());
    return diff >= 48;
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      await api.post(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Erro ao cancelar agendamento');
    }
  };

  return (
    <Layout title="Meus Agendamentos">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <button
              onClick={() => fetchAppointments()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="mr-2" size={16} />
              Filtrar
            </button>
          </div>

          <button
            onClick={() => navigate('/new-appointment')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="mr-2" size={16} />
            Novo Agendamento
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Nenhum agendamento encontrado para este período.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className={`bg-white p-6 rounded-lg shadow-sm border ${appointment.status === 'CANCELED' ? 'border-red-100 opacity-75' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {format(new Date(appointment.dateTime), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {format(new Date(appointment.dateTime), 'HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-pink-600">R$ {calculateTotal(appointment).toFixed(2)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      appointment.status === 'CONFIRMADO' || appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'CANCELED' || appointment.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {appointment.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.serviceCatalog.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        item.status === 'CONCLUIDO' || item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        item.status === 'CANCELADO' || item.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {appointment.status !== 'CANCELED' && (
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    {canModify(appointment.dateTime) ? (
                      <>
                        <button 
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                          <XCircle size={14} className="mr-1" />
                          Cancelar
                        </button>
                        <button 
                          onClick={() => navigate(`/reschedule/${appointment.id}`)}
                          className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center"
                        >
                          <Edit2 size={14} className="mr-1" />
                          Alterar
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs italic w-full text-center">
                        Alteração apenas por telefone (menos de 48h)
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

