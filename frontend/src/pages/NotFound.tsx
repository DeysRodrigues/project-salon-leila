import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scissors, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50/30 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Scissors size={120} className="text-pink-200 transform -rotate-12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black text-pink-600 tracking-tighter">404</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ops! Página perdida...</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Parece que esse caminho não leva a nenhum tratamento de beleza. Que tal voltarmos para o início e cuidarmos de você?
        </p>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Ir para a Página Inicial
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          >
            Voltar para onde eu estava
          </Button>
        </div>

        <div className="mt-12 text-pink-200 flex justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
          <div className="w-2 h-2 rounded-full bg-current opacity-40"></div>
          <div className="w-2 h-2 rounded-full bg-current"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
