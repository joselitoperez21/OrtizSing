const STORAGE_KEY = "ortizsigns_owner_profile_v1";

const defaultProfile = {
  ownerName: "Daniel Orama",
  businessName: "Ortiz Signs",
  heroTitle: "Señales y diseño que hacen que tu negocio se vea grande",
  heroText:
    "Creamos rótulos, impresiones y diseño visual para negocios en Puerto Rico con enfoque en calidad, rapidez y atención personalizada.",
  aboutText:
    "En Ortiz Signs convertimos ideas en visibilidad real. Diseñamos e instalamos soluciones de rotulación para locales, vehículos, eventos y marcas personales.",
  services: [
    "Rótulos comerciales interiores y exteriores",
    "Diseño gráfico para marcas y campañas",
    "Impresión en gran formato",
    "Rotulación de vehículos y flotas",
    "Letreros personalizados para eventos"
  ],
  mission:
    "Ofrecer soluciones visuales de alta calidad que ayuden a cada cliente a destacar su marca con claridad y estilo.",
  vision:
    "Ser el taller de rotulación más recomendado en Puerto Rico por servicio, creatividad y resultados.",
  email: "ortizsigns@yahoo.com",
  phone: "787-452-1800",
  whatsapp: "17874521800",
  address: "Puerto Rico",
  youtubeUrl: "https://www.youtube.com/@DanielOrama_95",
  ownerPhoto: "/img/ortizlogo.png",
  gallery: [
    "/img/margarita.png",
    "/img/OrtizDiaNacional.jpeg",
    "/img/74490806_212125556452969_1458104898381614497_n.jpg",
    "/img/download.png",
    "/img/logos.jpeg",
    "/img/logo1.jpeg",
    "/img/OrtizLuxzem.jpeg",
    "/img/OrtizNacional.jpeg"
  ]
};

function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultProfile;
    const parsed = JSON.parse(saved);
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function toServiceArray(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toMultiline(value) {
  return value.join("\n");
}

import { useMemo, useState } from "react";

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [form, setForm] = useState(() => ({
    ...loadProfile(),
    servicesText: toMultiline(loadProfile().services)
  }));

  const whatsappUrl = useMemo(() => {
    const cleaned = profile.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  }, [profile.whatsapp]);

  const handleUnlock = () => {
    if (pin === "2026") {
      setIsUnlocked(true);
    } else {
      alert("PIN incorrecto. Cambia luego este PIN en el código por seguridad.");
    }
  };

  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleInput("ownerPhoto", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextProfile = {
      ...form,
      services: toServiceArray(form.servicesText)
    };
    setProfile(nextProfile);
    saveProfile(nextProfile);
    alert("Informacion guardada correctamente.");
  };

  return (
    <>
      <a className="yt-float" href={profile.youtubeUrl} target="_blank" rel="noreferrer">
        YouTube
      </a>

      <header className="header">
        <div>
          <p className="eyebrow">Rotulacion y Diseno</p>
          <h1>{profile.businessName}</h1>
          <p className="hero-title">{profile.heroTitle}</p>
          <p className="hero-text">{profile.heroText}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="btn btn-secondary" href={profile.youtubeUrl} target="_blank" rel="noreferrer">
              Ver canal de YouTube
            </a>
          </div>
        </div>
        <div className="owner-card">
          <img src={profile.ownerPhoto} alt={profile.ownerName} />
          <h2>{profile.ownerName}</h2>
          <p>Propietario</p>
        </div>
      </header>

      <main className="main">
        <section className="panel">
          <h2>Quienes somos</h2>
          <p>{profile.aboutText}</p>
        </section>

        <section className="panel">
          <h2>Nuestros servicios</h2>
          <ul>
            {profile.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>

        <section className="panel split">
          <article>
            <h2>Mision</h2>
            <p>{profile.mission}</p>
          </article>
          <article>
            <h2>Vision</h2>
            <p>{profile.vision}</p>
          </article>
        </section>

        <section className="panel">
          <h2>Galeria</h2>
          <div className="gallery">
            {profile.gallery.map((src) => (
              <img key={src} src={src} alt="Trabajo de Ortiz Signs" loading="lazy" />
            ))}
          </div>
        </section>

        <section className="panel contact">
          <h2>Contacto</h2>
          <p>
            Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p>
            Telefono: <a href={`tel:${profile.phone}`}>{profile.phone}</a>
          </p>
          <p>Direccion: {profile.address}</p>
          <p>
            YouTube: <a href={profile.youtubeUrl}>{profile.youtubeUrl}</a>
          </p>
        </section>
      </main>

      <button className="admin-toggle" onClick={() => setIsAdminOpen((prev) => !prev)}>
        Panel del dueno
      </button>

      {isAdminOpen && (
        <aside className="admin-panel">
          <h3>Editar contenido</h3>
          {!isUnlocked ? (
            <div className="pin-box">
              <p>PIN de acceso</p>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
              />
              <button onClick={handleUnlock}>Entrar</button>
              <small>PIN por defecto: 2026 (cambialo luego en codigo).</small>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <label>
                Nombre del negocio
                <input
                  value={form.businessName}
                  onChange={(e) => handleInput("businessName", e.target.value)}
                />
              </label>

              <label>
                Nombre del dueno
                <input value={form.ownerName} onChange={(e) => handleInput("ownerName", e.target.value)} />
              </label>

              <label>
                Titulo principal
                <input value={form.heroTitle} onChange={(e) => handleInput("heroTitle", e.target.value)} />
              </label>

              <label>
                Texto principal
                <textarea value={form.heroText} onChange={(e) => handleInput("heroText", e.target.value)} />
              </label>

              <label>
                Quienes somos
                <textarea value={form.aboutText} onChange={(e) => handleInput("aboutText", e.target.value)} />
              </label>

              <label>
                Servicios (uno por linea)
                <textarea
                  value={form.servicesText}
                  onChange={(e) => handleInput("servicesText", e.target.value)}
                />
              </label>

              <label>
                Mision
                <textarea value={form.mission} onChange={(e) => handleInput("mission", e.target.value)} />
              </label>

              <label>
                Vision
                <textarea value={form.vision} onChange={(e) => handleInput("vision", e.target.value)} />
              </label>

              <label>
                Email
                <input value={form.email} onChange={(e) => handleInput("email", e.target.value)} />
              </label>

              <label>
                Telefono
                <input value={form.phone} onChange={(e) => handleInput("phone", e.target.value)} />
              </label>

              <label>
                WhatsApp (solo numeros)
                <input value={form.whatsapp} onChange={(e) => handleInput("whatsapp", e.target.value)} />
              </label>

              <label>
                Direccion
                <input value={form.address} onChange={(e) => handleInput("address", e.target.value)} />
              </label>

              <label>
                URL de YouTube
                <input value={form.youtubeUrl} onChange={(e) => handleInput("youtubeUrl", e.target.value)} />
              </label>

              <label>
                Foto del dueno
                <input type="file" accept="image/*" onChange={handlePhoto} />
              </label>

              <button type="submit">Guardar cambios</button>
            </form>
          )}
        </aside>
      )}
    </>
  );
}
