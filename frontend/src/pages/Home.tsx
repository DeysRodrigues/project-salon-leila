import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search, User, Menu, MapPin, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Service {
  id: number;
  name: string;
  price: number;
}

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err: any) {
        if (!err.response) {
          setError('O servidor parece estar offline. Por favor, tente novamente mais tarde.');
        } else {
          setError('Falha ao carregar o catálogo de serviços.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased overflow-x-hidden">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 py-4 border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-6 md:px-20 flex justify-between items-center">
          <div className="font-serif text-4xl text-on-background lowercase tracking-tighter">leila</div>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-xs uppercase tracking-widest text-primary border-b-2 border-primary pb-1 font-bold" href="#">Home</a>
            <a className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-bold" href="#services">Serviços</a>
            <a className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-bold" href="#about">Sobre</a>
            <a className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-bold" href="#contact">Contato</a>
          </nav>
          <div className="flex items-center gap-4 text-primary">
            <button className="hover:scale-110 transition-transform"><Search size={20} /></button>
            <button className="hover:scale-110 transition-transform" onClick={() => navigate('/login')}><User size={20} /></button>
            <button className="md:hidden hover:scale-110 transition-transform"><Menu size={20} /></button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="soft-gradient min-h-[90vh] flex items-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-20 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center pt-24 md:pt-0">
            <div className="md:col-span-5 flex flex-col items-start gap-8 z-10">
              <h1 className="font-serif text-5xl md:text-7xl text-on-background leading-tight">
                Sinta a<br />
                Beleza que<br />
                Você Merece
              </h1>
              <p className="text-lg text-on-surface-variant max-w-md">
                Nossos estilistas altamente treinados garantem que você receba os melhores serviços de cuidados com o cabelo, adaptados à sua beleza única.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-primary text-on-primary font-bold text-lg px-10 py-7 rounded-full hover:bg-primary-container transition-all shadow-[0_20px_40px_rgba(121,83,71,0.2)] hover:-translate-y-1"
              >
                Agendar Agora
              </Button>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 gap-4 md:gap-6 mt-12 md:mt-0 relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full z-0"></div>
              <div className="flex flex-col gap-4 md:gap-6 pt-12 z-10">
                <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800" alt="Hair Style 1" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-500" />
                <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800" alt="Hair Style 2" className="w-full aspect-square object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="flex flex-col gap-4 md:gap-6 z-10">
                <img src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=800" alt="Hair Style 3" className="w-full aspect-square object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-500" />
                <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800" alt="Hair Style 4" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 md:py-32 bg-surface" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-16 md:mb-24">
              <span className="font-serif italic text-primary text-2xl mb-4 block">Nossos Serviços</span>
              <h2 className="font-serif text-4xl md:text-5xl text-on-background tracking-tight">Cuidado Especializado para Você</h2>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-12 max-w-2xl mx-auto border-destructive/20 bg-destructive/5 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de conexão</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-8 rounded-2xl bg-surface-container">
                    <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                services.map((service) => (
                  <div key={service.id} className="group flex flex-col md:flex-row gap-6 p-8 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all duration-300 border border-transparent hover:border-outline-variant cursor-pointer" onClick={() => navigate('/login')}>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="font-serif text-2xl font-bold">L</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-baseline border-b border-outline-variant/30 pb-2">
                        <h3 className="text-xl font-bold text-on-surface">{service.name}</h3>
                        <span className="text-xl font-bold text-primary">R$ {service.price.toFixed(2)}</span>
                      </div>
                      <p className="text-on-surface-variant mt-2">Tratamento completo realizado por nossos especialistas com garantia de satisfação.</p>
                      <span className="text-xs uppercase tracking-widest text-primary/60 mt-2 font-bold">Tempo estimado: 45-90 min</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 md:py-32 bg-surface-container-low overflow-hidden" id="about">
          <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-3 z-0"></div>
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800" alt="Sobre Nós" className="relative z-10 w-full aspect-[3/4] object-cover rounded-2xl shadow-xl" />
            </div>
            <div className="flex flex-col gap-10 order-1 md:order-2">
              <div>
                <span className="font-serif italic text-primary text-2xl mb-4 block">Sobre o Salão Leila</span>
                <h2 className="font-serif text-4xl md:text-5xl text-on-background mb-6 leading-tight">Experiência e Paixão em Cada Detalhe</h2>
                <p className="text-on-surface-variant text-lg">
                  No Salão Leila, acreditamos que a beleza vem de dentro, mas um toque profissional pode realçar sua luz natural. Há mais de 10 anos transformando vidas através da estética.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">Estilistas Mestres</h3>
                    <p className="text-on-surface-variant">Nossa equipe é composta por profissionais premiados e em constante atualização com as tendências mundiais.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">Produtos Premium</h3>
                    <p className="text-on-surface-variant">Utilizamos apenas as melhores marcas mundiais para garantir a saúde e o brilho dos seus fios.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container py-20 border-t border-outline-variant/30" id="contact">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-6">
            <div className="font-serif text-4xl text-on-background lowercase tracking-tighter">leila</div>
            <p className="text-on-surface-variant max-w-xs">Realce sua beleza natural em um ambiente pensado para o seu bem-estar e relaxamento.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-bold text-on-surface mb-2">Explore</h4>
            <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#">Sobre Nós</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#services">Serviços</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#">Agendar Horário</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-bold text-on-surface mb-2">Contato</h4>
            <p className="text-on-surface-variant flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              Rua das Flores, 123 - Centro
            </p>
            <p className="text-on-surface-variant flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              contato@salaoleila.com.br
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-20 mt-16 pt-8 border-t border-outline-variant/30 text-center">
          <p className="text-primary font-bold">© 2026 Salão Leila. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
