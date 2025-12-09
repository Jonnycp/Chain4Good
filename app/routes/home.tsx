
{/*
import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import CardHome from '~/components/CardHome';

export default function Home() {
  return (
    <div className='dark bg-dark'>
      <h1 className="font-sans bg-secondary">Hello world!</h1>
      <Button>Click Me</Button>
      <Input aria-label="Name" className="w-64" placeholder="Enter your name" />
      <h1>sto facendo la card</h1>
    </div>
  );
} 
  */}


import CardHome from '../components/CardHome'; // Assicurati che il percorso sia giusto

export default function Home() {
  
  // DATI DI PROVA (Mock Data)
  // In futuro questi arriveranno dal tuo database/API
  const progettoTest = {
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=80", // Immagine natura generica
    authorLogo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", // Faccia generica
    title: "Riforestazione Urbana: Il Parco del Futuro",
    authorName: "Marco Verdi",
    daysLeft: 14,
    currentAmount: 3450,
    targetAmount: 5000
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Progetti in evidenza</h1>
        
        {/* GRIGLIA PROGETTI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Renderizziamo la card passandole i dati spread (...) */}
          <CardHome {...progettoTest} />

          {/* Esempio di una seconda card con dati diversi manuali */}
          <CardHome 
            coverImage="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80"
            authorLogo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
            title="Pulizia delle Spiagge: Un Mare di Speranza"
            authorName="Luca Bianchi"
            daysLeft={7}
            currentAmount={2200}
            targetAmount={4000}
          />
          
        </div>
      </div>
    </div>
  );
}