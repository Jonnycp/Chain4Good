import { useState } from 'react';
import { useNavigate } from 'react-router'; 
import CategoryButton from '../components/CategoryButton';

import logoImg from '../assets/logo.png';
import cuoreImg from '../assets/cuore.png';
import libroImg from '../assets/libro.png';
import sirenaImg from '../assets/sirena.png';
import alberoImg from '../assets/albero.png';
import sportImg from '../assets/sport.png';
import spazzaturaImg from '../assets/spazzatura.png';
import frecciaImg from '../assets/freccia.png';

// Configurazione Categorie
const CATEGORIES = [
  { id: 'medical', label: 'Spese mediche', icon: cuoreImg },
  { id: 'education', label: 'Istruzione', icon: libroImg },
  { id: 'emergency', label: 'Emergenze', icon: sirenaImg },
  { id: 'environment', label: 'Ambiente', icon: alberoImg },
  { id: 'sport', label: 'Sport', icon: sportImg },
];

export default function NuovoProgetto() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Stato del Form
  const [formData, setFormData] = useState({
    projectName: '',
    category: '', 
    budget: '',
    deadline: '',
    description: '',
    fundsUsage: '',
    coverImage: null as File | null
  });

  // Stato per gli errori di validazione
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Rimuove l'errore mentre l'utente digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, coverImage: e.target.files![0] }));
      if (errors.coverImage) setErrors(prev => ({ ...prev, coverImage: '' }));
    }
  };

  // --- VALIDAZIONE STEP 1 ---
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    // 1. Nome: Prima lettera maiuscola e almeno 3 caratteri
    const nameRegex = /^[A-Z].{2,}$/;
    if (!formData.projectName) {
      newErrors.projectName = "Il nome è obbligatorio.";
    } else if (!/^[A-Z]/.test(formData.projectName)) {
      newErrors.projectName = "Deve iniziare con una lettera maiuscola.";
    } else if (formData.projectName.length < 3) {
      newErrors.projectName = "Deve contenere almeno 3 caratteri.";
    }

    // 2. Categoria: Deve essere selezionata
    if (!formData.category) {
      newErrors.category = "Seleziona una categoria.";
    }

    // 3. Budget: Deve essere maggiore di 0 e minore di 1 milione
    const budgetVal = Number(formData.budget);
    
    if (!formData.budget) {
      newErrors.budget = "Inserisci un budget.";
    } else if (budgetVal <= 100) { // <--- MODIFICA QUI: da === 0 a <= 0
      newErrors.budget = "Il budget deve essere un numero positivo maggiore di 100.";
    } else if (budgetVal >= 1000000) {
      newErrors.budget = "Il budget deve essere minore di 1.000.000.";
    }

    // 4. Scadenza: Almeno 1 settimana superiore all'attuale
    if (!formData.deadline) {
      newErrors.deadline = "Inserisci una data di scadenza.";
    } else {
      const selectedDate = new Date(formData.deadline);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7); // Oggi + 7 giorni
      
      // Resettiamo le ore per confronto solo data
      selectedDate.setHours(0,0,0,0);
      minDate.setHours(0,0,0,0);

      if (selectedDate < minDate) {
        newErrors.deadline = "La scadenza deve essere tra almeno una settimana.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- VALIDAZIONE STEP 2 ---
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    // 5. Descrizione: Presente
    if (!formData.description.trim()) {
      newErrors.description = "La descrizione è obbligatoria.";
    }

    // 6. Come useremo i fondi: Presente
    if (!formData.fundsUsage.trim()) {
      newErrors.fundsUsage = "Specifica come verranno usati i fondi.";
    }

    // 7. Immagine: Presente
    if (!formData.coverImage) {
      newErrors.coverImage = "È necessario caricare un'immagine di copertina.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0); // Scroll in alto per UX migliore
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      const finalObject = {
        ...formData,
        createdAt: new Date().toISOString(),
      };
      console.log("=== DATI PROGETTO ===", finalObject);
      alert("Progetto creato con successo! Controlla la console.");
    }
  };

  const handleCancel = () => {
    navigate('/'); 
  };

  // Helper per classi input
  const getInputClass = (fieldName: string) => `
    w-full p-3 rounded-lg border outline-none focus:ring-2 transition-colors
    ${errors[fieldName] 
      ? 'bg-red-50 border-red-500 focus:ring-red-200' 
      : 'bg-gray-100 border-transparent focus:ring-primary'}
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden p-6 relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Chain4Good" className="h-8 w-auto object-contain" />
            <span className="text-xl font-bold text-secondary">Chain4Good</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
             <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">U</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-secondary mb-4">Crea un Nuovo Progetto</h1>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-secondary mb-1">
            <span>Step {step} di 2</span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full relative mt-3">
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 bg-primary"
              style={{ width: step === 1 ? '50%' : '100%' }} 
            />
            <div className="absolute top-[-8px] left-[50%] transform -translate-x-1/2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white bg-primary border-2 border-white shadow-sm">1</div>
            <div className={`absolute top-[-8px] left-[100%] transform -translate-x-full w-5 h-5 rounded-full text-xs flex items-center justify-center text-white border-2 border-white shadow-sm ${step === 2 ? 'bg-primary' : 'bg-gray-300'}`}>2</div>
          </div>
        </div>

        {/* --- STEP 1 --- */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Nome Progetto */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-1">Nome del progetto</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className={getInputClass('projectName')}
                placeholder="Es. Raccolta fondi..."
              />
              {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
            </div>

            {/* Categorie */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <CategoryButton 
                    key={cat.id}
                    label={cat.label}
                    icon={cat.icon}
                    isSelected={formData.category === cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                  />
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-1">Budget target</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={getInputClass('budget')}
              />
              {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
            </div>

            {/* Scadenza */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-1">Scadenza</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={getInputClass('deadline')}
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>

            {/* Pulsanti Step 1 */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleNextStep}
                className="w-full py-3 rounded-xl text-white font-bold text-lg shadow-md hover:opacity-90 transition bg-secondary"
              >
                Prosegui
              </button>
              
              <button 
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-red-50 py-2 rounded-lg transition"
              >
                <img src={spazzaturaImg} alt="Annulla" className="w-4 h-4" />
                <span className="underline decoration-red-300">Annulla</span>
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2 --- */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Descrizione */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-1">Descrizione</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={getInputClass('description')}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Fondi */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-1">Come useremo i fondi</label>
              <textarea
                name="fundsUsage"
                rows={3}
                value={formData.fundsUsage}
                onChange={handleChange}
                className={getInputClass('fundsUsage')}
              />
              {errors.fundsUsage && <p className="text-red-500 text-xs mt-1">{errors.fundsUsage}</p>}
            </div>

            {/* Upload Immagine */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-2">Immagine di copertina</label>
              <div 
                className={`relative w-full h-28 rounded-lg flex items-center justify-center border-2 border-dashed transition cursor-pointer group
                  ${errors.coverImage ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {formData.coverImage ? (
                  <span className="text-primary font-bold text-sm px-4 text-center break-all">
                    {formData.coverImage.name}
                  </span>
                ) : (
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors
                    ${errors.coverImage ? 'border-red-500 text-red-500' : 'border-black group-hover:border-primary group-hover:text-primary'}
                  `}>
                    <span className="text-2xl font-light leading-none pb-1">+</span>
                  </div>
                )}
              </div>
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>}
            </div>

            {/* Pulsanti Step 2 */}
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition flex items-center justify-center bg-secondary"
              >
                 <img 
                    src={frecciaImg} 
                    alt="Indietro" 
                    className="w-5 h-auto" 
                    style={{ filter: 'brightness(0) invert(1)' }} 
                 />
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl text-white font-bold text-lg shadow-md hover:opacity-90 transition bg-primary"
              >
                Carica progetto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}