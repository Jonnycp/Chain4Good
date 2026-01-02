import { useEffect, useState } from "react";
import { useNavigate, type ActionFunctionArgs } from "react-router";
import { Icon } from "@iconify/react";
import CategoryButton from "../components/CategoryButton";
import Header from "~/components/Header";

import logoImg from "../assets/logo.png";
import imgUser from "../assets/img_user.png";
import { categories } from "./HomePageComune";

export const CURRENCYS = ["EURC", "USDC"];

//TODO: No action perchè nel frontend manca <form method="multipart" ...

export default function NuovoProgetto() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);
  const [posizione, setPosizione] = useState<{
    lat: number;
    lng: number;
    citta: string;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setPosizione({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              citta:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "",
            });
            setFormData((prev) => ({
              ...prev,
              location:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                `${position.coords.latitude},${position.coords.longitude}`,
            }));
          })
          .catch(() => {
            setPosizione({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              citta: "",
            });
          });
      });
    }
  }, []);

  // Stato del Form
  const [formData, setFormData] = useState({
    projectName: "",
    category: "",
    budget: "",
    currency: "EURC",
    location: posizione ? `${posizione.lat},${posizione.lng}` : "",
    deadline: "",
    description: "",
    fundsUsage: [""] as string[],
    coverImage: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }));
      if (errors.coverImage) setErrors((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleFundsUsageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.fundsUsage];
      updated[index] = value;
      return { ...prev, fundsUsage: updated };
    });
    if (errors.fundsUsage) setErrors((prev) => ({ ...prev, fundsUsage: "" }));
  };

  const addFundsUsage = () => {
    setFormData((prev) => ({ ...prev, fundsUsage: [...prev.fundsUsage, ""] }));
  };

  const removeFundsUsage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.fundsUsage.filter((_, i) => i !== index);
      return { ...prev, fundsUsage: updated };
    });
  };

  // VALIDAZIONE STEP 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName) {
      newErrors.projectName = "Il nome è obbligatorio.";
    } else if (formData.projectName.length < 3) {
      newErrors.projectName = "Deve contenere almeno 3 caratteri.";
    }

    if (!formData.category) {
      newErrors.category = "Seleziona una categoria.";
    }

    const budgetVal = Number(formData.budget);
    if (!formData.budget) {
      newErrors.budget = "Inserisci un budget.";
    } else if (budgetVal <= 100) {
      newErrors.budget = "Il budget deve essere > 100.";
    } else if (budgetVal >= 1000000) {
      newErrors.budget = "Il budget deve essere < 1.000.000.";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Inserisci una data.";
    } else {
      const selectedDate = new Date(formData.deadline);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      selectedDate.setHours(0, 0, 0, 0);
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < minDate) {
        newErrors.deadline = "Almeno tra una settimana.";
      }
    }

    if (!formData.currency) {
      newErrors.currency = "Seleziona una valuta.";
    }
    if (!CURRENCYS.includes(formData.currency)) {
      newErrors.currency = "Valuta non valida.";
    }
    if (!formData.location || formData.location.length < 2) {
      newErrors.location = "Inserisci un luogo valido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // VALIDAZIONE STEP 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim())
      newErrors.description = "La descrizione è obbligatoria.";
    if (
      !formData.fundsUsage ||
      formData.fundsUsage.length === 0 ||
      formData.fundsUsage.some((fund) => !fund.trim())
    )
      newErrors.fundsUsage = "Specifica come verranno usati i fondi.";
    if (!formData.coverImage)
      newErrors.coverImage = "È necessario caricare un'immagine.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (validateStep2()) {
      const form = new FormData();
      form.append("title", formData.projectName);
      form.append("category", formData.category);
      form.append("location", formData.location);
      form.append("descrizione", formData.description);
      form.append("endDate", formData.deadline);
      form.append("targetAmount", formData.budget);
      form.append("currency", formData.currency);
      formData.fundsUsage.forEach((usage, idx) => {
        form.append(`usoFondi[]`, usage);
      });
      if (formData.coverImage) {
        form.append("coverImage", formData.coverImage);
      }

      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/projects/new",
          {
            method: "POST",
            body: form,
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setNewId(data.projectId);
          setIsSuccess(true);
        } else {
          setErrors(
            {
              coverImage: "Errore creazione: " + data.error || "Errore creazione progetto",
            }
          );
        }
      } catch (err) {
        setErrors({ coverImage: "Errore di connessione al server" });
      }
    }
  };
  const handleCancel = () => {
    navigate("/");
  };

  const getInputClass = (fieldName: string) => `
    w-full p-3 rounded-lg border outline-none focus:ring-2 transition-colors
    ${
      errors[fieldName]
        ? "bg-red-50 border-red-500 focus:ring-red-200"
        : "bg-white border-gray-300 focus:ring-primary"
    } 
  `;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10 relative flex flex-col">
      {/* HEADER */}
      <Header
        type="utente"
        profileImage={imgUser}
        activePage="home"
        showNav={false}
      />

      {/* CARD DI SUCCESSO */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-appearance-in">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full mx-auto text-center flex flex-col items-center">
            <div className="mb-6 relative">
              <img
                src={logoImg}
                alt="Successo"
                className="w-32 h-32 object-contain"
              />
            </div>

            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3">
              BEN FATTO!
            </h2>

            <p className="text-lg text-gray-600 font-medium leading-snug mb-8">
              Il tuo progetto è stato creato con successo
            </p>

            <button
              onClick={() => navigate("/progetto/" + newId)}
              className="w-full py-4 rounded-xl bg-[#0F172A] text-white font-bold text-lg shadow-md hover:opacity-90 transition-opacity"
            >
              Vai a vederlo
            </button>
          </div>
        </div>
      )}

      {/* CONTENUTO NORMALE */}
      <div
        className={`flex-1 ${isSuccess ? "blur-sm pointer-events-none" : ""} transition-all`}
      >
        <main className="px-6 mt-6 md:mt-12 w-full max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-6 md:mb-8 text-center md:text-left">
            Crea un Nuovo Progetto
          </h1>

          {/* PROGRESS BAR */}
          <div className="mb-8 md:mb-12 relative max-w-xl md:max-w-none md:mx-0 mx-auto">
            <div className="flex justify-between text-sm font-semibold text-secondary mb-1">
              <span>Step {step} di 2</span>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full relative mt-3">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 bg-primary"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
              <div className="absolute top-[-8px] left-[50%] transform -translate-x-1/2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white bg-primary border-2 border-white shadow-sm">
                1
              </div>
              <div
                className={`absolute top-[-8px] left-[100%] transform -translate-x-full w-5 h-5 rounded-full text-xs flex items-center justify-center text-white border-2 border-white shadow-sm ${step === 2 ? "bg-primary" : "bg-gray-300"}`}
              >
                2
              </div>
            </div>
          </div>

          <div className="md:bg-white md:p-8 md:rounded-3xl md:shadow-sm">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Nome Progetto */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">
                    Nome del progetto
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    style={{ textTransform: "capitalize" }}
                    value={formData.projectName}
                    onChange={handleChange}
                    className={getInputClass("projectName")}
                    placeholder="Es. Raccolta fondi..."
                  />
                  {errors.projectName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.projectName}
                    </p>
                  )}
                </div>

                {/* Categorie */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <CategoryButton
                        key={cat.id}
                        label={cat.label}
                        icon={cat.icon}
                        isSelected={formData.category === cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                      />
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">
                      Budget target (ETH)
                    </label>
                    <input
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === "e" || e.key === "+" || e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={getInputClass("budget")}
                      placeholder="0.00"
                    />
                    {errors.budget && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  {/* Scadenza */}
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">
                      Scadenza
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className={getInputClass("deadline")}
                    />
                    {errors.deadline && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.deadline}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">
                      Valuta
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={getInputClass("currency")}
                    >
                      {CURRENCYS.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">
                      Luogo
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={getInputClass("location")}
                      placeholder="Es: Milano"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
                {/* Pulsanti Step 1 */}
                <div className="mt-8 flex flex-col md:flex-row-reverse gap-3 md:items-center">
                  <button
                    onClick={handleNextStep}
                    className="w-full md:w-auto md:px-12 py-3 rounded-xl text-white font-bold text-lg shadow-md hover:opacity-90 transition bg-secondary"
                  >
                    Prosegui
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full md:w-auto md:px-6 flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-red-50 py-2 rounded-lg transition"
                  >
                    <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                    <span className="underline decoration-red-300">
                      Annulla
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Descrizione */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">
                    Descrizione completa
                  </label>
                  <textarea
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={getInputClass("description")}
                    placeholder="Racconta la tua storia..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Fondi */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">
                    Piano utilizzo fondi
                  </label>
                  {formData.fundsUsage.map((usage, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={usage}
                        onChange={(e) =>
                          handleFundsUsageChange(idx, e.target.value)
                        }
                        className={getInputClass("fundsUsage")}
                        placeholder={`Uso #${idx + 1}`}
                      />
                      {formData.fundsUsage.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFundsUsage(idx)}
                          className="text-red-500 text-xl font-bold px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFundsUsage}
                    className="flex text-white bg-primary p-3 rounded-xl justify-centerfont-semibold text-sm mt-1"
                  >
                    <Icon icon="mdi:plus" className="w-5 h-5 mr-1" />
                    Aggiungi uso
                  </button>
                  {errors.fundsUsage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fundsUsage}
                    </p>
                  )}
                </div>

                {/* Upload Immagine */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    Immagine di copertina
                  </label>
                  <div
                    className={`relative w-full h-40 md:h-52 rounded-xl flex items-center justify-center border-2 border-dashed transition cursor-pointer group bg-white
                        ${errors.coverImage ? "border-red-500 bg-red-50" : "border-gray-300 hover:bg-gray-50"}
                    `}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {formData.coverImage ? (
                      <div className="flex flex-col items-center">
                        <Icon
                          icon="mdi:image-check"
                          className="w-8 h-8 text-primary mb-2"
                        />
                        <span className="text-primary font-bold text-sm px-4 text-center break-all">
                          {formData.coverImage.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                        <div
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-colors
                            ${errors.coverImage ? "border-red-500 text-red-500" : "border-current"}
                            `}
                        >
                          <span className="text-3xl font-light leading-none pb-1">
                            +
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          Carica una foto
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.coverImage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.coverImage}
                    </p>
                  )}
                </div>

                {/* Pulsanti Step 2 */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition flex items-center justify-center bg-secondary"
                  >
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 rounded-xl text-white font-bold text-lg shadow-md hover:opacity-90 transition bg-primary"
                  >
                    Pubblica Progetto
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
