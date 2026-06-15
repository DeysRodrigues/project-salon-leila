import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/api';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { format, isSameWeek } from 'date-fns';

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Appointment {
  id: number;
  dateTime: string;
  items: {
    serviceCatalog: {
      id: number;
    };
  }[];
}

const Reschedule: React.FC = () => {
  const { id } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dateTime, setDateTime] = useState('');
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, historyRes, currentApptRes] = await Promise.all([
          api.get('/services'),
          api.get('/appointments/history'),
          api.get(`/appointments/history`) // We'll filter this list to find the current one
        ]);
        
        setServices(servicesRes.data);
        setExistingAppointments(historyRes.data);
        
        const currentAppt = (historyRes.data as Appointment[]).find(a => a.id === Number(id));
        if (currentAppt) {
          setDateTime(currentAppt.dateTime.substring(0, 16));
          setSelectedServices(currentAppt.items.map(item => item.serviceCatalog.id));
        } else {
          setError('Agendamento não encontrado');
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Erro ao carregar dados do agendamento');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) ? prev.filter(s => s !== serviceId) : [...prev, serviceId]
    );
  };

  const handleDateChange = (val: string) => {
    setDateTime(val);
    if (!val) {
      setSuggestion(null);
      return;
    }

    const selectedDate = new Date(val);
    const sameWeekAppt = existingAppointments.find(appt => 
      appt.id !== Number(id) && 
      isSameWeek(new Date(appt.dateTime), selectedDate, { weekStartsOn: 0 })
    );

    if (sameWeekAppt && !format(new Date(sameWeekAppt.dateTime), 'yyyy-MM-dd').includes(val.split('T')[0])) {
      setSuggestion(`Você já tem outro agendamento nesta semana em ${format(new Date(sameWeekAppt.dateTime), "dd/MM 'às' HH:mm")}. Gostaria de agrupar seus serviços?`);
    } else {
      setSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setError('Selecione pelo menos um serviço');
      return;
    }
    try {
      await api.put(`/appointments/${id}`, {
        dateTime: dateTime.includes('T') ? dateTime : `${dateTime}:00`,
        serviceIds: selectedServices
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao atualizar agendamento');
    }
  };

  if (loading) return <Layout title="Carregando..."><p className="text-center py-12">Carregando...</p></Layout>;

  return (
    <Layout title="Alterar Agendamento">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="mr-2" size={18} />
              {error}
            </div>
          )}

          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
            <p><strong>Atenção:</strong> Alterações com menos de 48h de antecedência só podem ser feitas por telefone.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Serviços</label>
            <div className="grid grid-cols-1 gap-4">
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedServices.includes(service.id) 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedServices.includes(service.id) ? 'bg-pink-500 border-pink-500' : 'border-gray-300'
                    }`}>
                      {selectedServices.includes(service.id) && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className="text-pink-600 font-bold">R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              value={dateTime}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          {suggestion && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md flex items-start">
              <Info className="mr-2 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium">{suggestion}</p>
                <button 
                  type="button"
                  onClick={() => {
                    const sameWeekAppt = existingAppointments.find(appt => 
                      appt.id !== Number(id) &&
                      isSameWeek(new Date(appt.dateTime), new Date(dateTime), { weekStartsOn: 0 })
                    );
                    if (sameWeekAppt) setDateTime(sameWeekAppt.dateTime.substring(0, 16));
                  }}
                  className="mt-2 text-sm font-bold underline"
                >
                  Usar mesma data
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Reschedule;
