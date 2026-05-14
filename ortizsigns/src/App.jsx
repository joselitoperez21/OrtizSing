const STORAGE_KEY = "ortizsigns_owner_profile_v1";
const API_PROFILE_ENDPOINT = "/api/profile";
const DEFAULT_OWNER_PHOTO = "/img/ortizlogo.png";

const defaultProfile = {
  ownerName: "Daniel Orama",
  businessName: "Ortiz Signs",
  heroTitle: "Diseño, fabricación e instalación de rótulos para negocios, eventos y proyectos personalizados",
  heroText:
    "En Ortiz Signs ayudamos a negocios y clientes en Puerto Rico a destacar su imagen con rótulos, diseños personalizados y trabajos visuales de calidad. Nos encargamos del proceso completo: desde la idea y el diseño, hasta la fabricación, montaje e instalación final. Cotizaciones sin compromiso y más de 30 años de experiencia.",
  aboutText:
    "En Ortiz Signs nos especializamos en diseño, rotulación e imagen visual para negocios, eventos y proyectos personalizados. Ayudamos a nuestros clientes a darle presencia a su marca mediante trabajos creativos, profesionales y bien instalados.\n\nNos encargamos de todo el proceso: desde la idea y el diseño, hasta la producción, montaje e instalación final. Cada trabajo se realiza con atención al detalle, buscando que el resultado sea limpio, llamativo, funcional y de calidad.\n\nNuestro compromiso es ofrecer soluciones visuales que representen correctamente la identidad de cada cliente. Ya sea para un negocio nuevo, una promoción, un evento especial, un vehículo comercial o una renovación de imagen, en Ortiz Signs convertimos tus ideas en rótulos, diseños y proyectos visuales hechos para destacar.",
  services: [
    "Rótulos comerciales interiores y exteriores",
    "Diseño gráfico para negocios, marcas y promociones",
    "Signs personalizados para eventos y proyectos especiales",
    "Rotulación de vehículos comerciales",
    "Impresión en gran formato",
    "Letras, banners, viniles y materiales promocionales",
    "Fabricación e instalación de rótulos",
    "Montaje profesional en el lugar del cliente"
  ],
  mission:
    "Crear soluciones visuales de calidad que ayuden a negocios y clientes a destacar su marca mediante diseño, rotulación, fabricación e instalación profesional.",
  vision:
    "Ser una referencia local en rotulación, diseño e imagen comercial, reconocidos por la calidad de nuestros trabajos, el servicio directo y los resultados duraderos.",
  email: "ortizsignspr@gmail.com",
  phone: "939-638-0678",
  whatsapp: "19396380678",
  address: "Puerto Rico",
  mapEmbedUrl: "",
  youtubeUrl: "https://www.youtube.com/@DanielOrama_95",
  ownerPhoto: DEFAULT_OWNER_PHOTO,
  showSlideshow: true,
  slideshowPhotos: [
    "/img/margarita.png",
    "/img/OrtizDiaNacional.jpeg",
    "/img/74490806_212125556452969_1458104898381614497_n.jpg",
    "/img/download.png"
  ],
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

function normalizeProfile(raw) {
  const merged = { ...defaultProfile, ...(raw ?? {}) };
  const isAllowedOwnerPhoto =
    typeof merged.ownerPhoto === "string" && /^\/img\/[^?#]+\.(png|jpe?g|webp|gif)$/i.test(merged.ownerPhoto);
  return {
    ...merged,
    ownerPhoto: isAllowedOwnerPhoto ? merged.ownerPhoto : DEFAULT_OWNER_PHOTO,
    services: Array.isArray(merged.services) ? merged.services : defaultProfile.services,
    gallery: Array.isArray(merged.gallery) ? merged.gallery : defaultProfile.gallery,
    slideshowPhotos: Array.isArray(merged.slideshowPhotos)
      ? merged.slideshowPhotos
      : defaultProfile.slideshowPhotos,
    showSlideshow: typeof merged.showSlideshow === "boolean" ? merged.showSlideshow : true
  };
}

function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultProfile;
    const parsed = JSON.parse(saved);
    const merged = normalizeProfile(parsed);

    // Backward compatibility: if old saved data doesn't include slideshowPhotos,
    // initialize it from gallery so owner can edit the currently visible slides.
    if (!Object.prototype.hasOwnProperty.call(parsed, "slideshowPhotos")) {
      merged.slideshowPhotos = (merged.gallery ?? []).slice(0, 8);
    }

    // Update legacy contact data to current official data when old defaults are detected.
    if (!parsed.email || parsed.email === "ortizsigns@yahoo.com") {
      merged.email = defaultProfile.email;
    }
    if (!parsed.phone || parsed.phone === "787-452-1800") {
      merged.phone = defaultProfile.phone;
    }
    if (!parsed.whatsapp || parsed.whatsapp === "17874521800") {
      merged.whatsapp = defaultProfile.whatsapp;
    }
    if (!parsed.heroTitle || hasLegacyTechTerms(parsed.heroTitle)) {
      merged.heroTitle = defaultProfile.heroTitle;
    }
    if (!parsed.heroText || hasLegacyTechTerms(parsed.heroText)) {
      merged.heroText = defaultProfile.heroText;
    }
    if (!parsed.aboutText || hasLegacyTechTerms(parsed.aboutText)) {
      merged.aboutText = defaultProfile.aboutText;
    }

    return merged;
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function hasLegacyTechTerms(text) {
  if (!text) return false;
  return /(inform[aá]tic|soporte t[eé]cnic|computador|redes|impresoras|tecnolog[ií]a|presencia digital)/i.test(
    text
  );
}

import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);

  const [form, setForm] = useState(() => {
    const initial = loadProfile();
    return {
      ...initial,
      slideshowPhotos:
        initial.slideshowPhotos ?? (initial.gallery && initial.gallery.length ? initial.gallery.slice(0, 8) : [])
    };
  });

  const whatsappUrl = useMemo(() => {
    const cleaned = profile.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  }, [profile.whatsapp]);
  const phoneUrl = useMemo(() => {
    const cleaned = profile.phone.replace(/[^\d+]/g, "");
    return `tel:${cleaned}`;
  }, [profile.phone]);

  const slides = useMemo(() => {
    const baseSlides = profile.slideshowPhotos ?? (profile.gallery?.slice(0, 8) ?? []);
    if (!baseSlides.length) return ["/img/ortizlogo.png"];
    return baseSlides;
  }, [profile.slideshowPhotos, profile.gallery]);

  const lightboxImages = useMemo(() => {
    if (profile.gallery?.length) return profile.gallery;
    return slides;
  }, [profile.gallery, slides]);
  const hasMap = Boolean(profile.mapEmbedUrl?.trim());

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  useEffect(() => {
    if (logoTapCount === 0) return;
    const timer = setTimeout(() => setLogoTapCount(0), 1800);
    return () => clearTimeout(timer);
  }, [logoTapCount]);

  useEffect(() => {
    let ignore = false;

    const fetchGlobalProfile = async () => {
      try {
        const response = await fetch(API_PROFILE_ENDPOINT, { method: "GET" });
        if (!response.ok) return;
        const payload = await response.json();
        if (!payload?.profile || ignore) return;

        const normalized = normalizeProfile(payload.profile);
        setProfile(normalized);
        setForm(normalized);
        saveProfile(normalized);
      } catch {
        // Keep local fallback when API is unavailable.
      }
    };

    fetchGlobalProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (lightboxIndex < 0) return;
    const onKey = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goLightbox(-1);
      if (event.key === "ArrowRight") goLightbox(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, lightboxImages.length]);

  const handleLogoSecretOpen = () => {
    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

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

  const handleRemoveOwnerPhoto = () => {
    handleInput("ownerPhoto", DEFAULT_OWNER_PHOTO);
  };

  const handleAddGalleryPhotos = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, String(reader.result)]
        }));
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const handleRemoveGalleryPhoto = (indexToDelete) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToDelete)
    }));
  };

  const handleClearGallery = () => {
    setForm((prev) => ({ ...prev, gallery: [] }));
  };

  const handleAddSlideshowPhotos = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          slideshowPhotos: [...(prev.slideshowPhotos ?? []), String(reader.result)]
        }));
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const handleRemoveSlideshowPhoto = (indexToDelete) => {
    setForm((prev) => ({
      ...prev,
      slideshowPhotos: (prev.slideshowPhotos ?? []).filter((_, index) => index !== indexToDelete)
    }));
  };

  const handleReplaceSlideshowPhoto = (indexToReplace, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => {
        const nextSlides = [...(prev.slideshowPhotos ?? [])];
        nextSlides[indexToReplace] = String(reader.result);
        return { ...prev, slideshowPhotos: nextSlides };
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleClearSlideshowPhotos = () => {
    setForm((prev) => ({ ...prev, slideshowPhotos: [] }));
  };

  const handleServiceItemChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((item, idx) => (idx === index ? value : item))
    }));
  };

  const handleAddServiceItem = () => {
    setForm((prev) => ({
      ...prev,
      services: [...(prev.services ?? []), "Nuevo servicio"]
    }));
  };

  const handleRemoveServiceItem = (index) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, idx) => idx !== index)
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const nextProfile = normalizeProfile({
      ...form
    });
    setProfile(nextProfile);
    saveProfile(nextProfile);

    try {
      setIsSyncingProfile(true);
      const response = await fetch(API_PROFILE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: nextProfile, pin })
      });

      if (!response.ok) {
        throw new Error("global-save-failed");
      }

      alert("Información guardada y publicada para todos.");
    } catch {
      alert("Se guardó en este dispositivo, pero falló publicar globalmente.");
    } finally {
      setIsSyncingProfile(false);
    }
  };

  const openLightboxBySrc = (src) => {
    const idx = lightboxImages.findIndex((img) => img === src);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => setLightboxIndex(-1);

  const goLightbox = (direction) => {
    if (!lightboxImages.length) return;
    setLightboxIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return lightboxImages.length - 1;
      if (next >= lightboxImages.length) return 0;
      return next;
    });
  };

  return (
    <>
      <header className="topbar">
        <div className="brand-mini">
          <img
            src={profile.ownerPhoto}
            alt={profile.ownerName}
            onClick={handleLogoSecretOpen}
            title="Logo"
          />
          <div>
            <strong>{profile.businessName}</strong>
            <small>{profile.ownerName}</small>
          </div>
        </div>
      </header>

      <section className="header">
        <div className="hero-content">
          <p className="eyebrow">SIGNS, DISEÑO Y ROTULACIÓN PROFESIONAL</p>
          <h1>{profile.businessName}</h1>
          <p className="hero-title">{profile.heroTitle}</p>
          <p className="hero-text">{profile.heroText}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Solicitar cotización
            </a>
            <a className="btn btn-secondary" href="#galeria">
              Ver trabajos
            </a>
          </div>
        </div>
        <div className="hero-points panel">
          <h2>Qué hacemos</h2>
          <ul>
            <li>Diseño de rótulos según la identidad de tu negocio</li>
            <li>Fabricación de signs con materiales de calidad</li>
            <li>Rotulación comercial interior y exterior</li>
            <li>Instalación profesional en negocios, oficinas, vehículos y eventos</li>
            <li>Diseños personalizados para promociones, marcas y proyectos especiales</li>
            <li>Atención directa para cotización y seguimiento</li>
          </ul>
        </div>
      </section>

      {profile.showSlideshow !== false && (
        <section className="slideshow panel">
          <div className="slideshow-frame">
            <img
              src={slides[activeSlide]}
              alt="Trabajo destacado"
              onClick={() => openLightboxBySrc(slides[activeSlide])}
            />
          </div>
          <div className="slideshow-dots">
            {slides.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                className={idx === activeSlide ? "dot active" : "dot"}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      <main className="main">
        <section className="panel">
          <h2>Quiénes somos</h2>
          <p>{profile.aboutText}</p>
        </section>

        <section className="panel">
          <h2>Nuestros servicios</h2>
          <div className="service-cards">
            {profile.services.map((service) => (
              <article className="service-card" key={service}>
                <h3>{service}</h3>
                <p>Trabajo personalizado, materiales de calidad y entrega profesional.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel split">
          <article>
            <h2>Misión</h2>
            <p>{profile.mission}</p>
          </article>
          <article>
            <h2>Visión</h2>
            <p>{profile.vision}</p>
          </article>
        </section>

        <section className="panel" id="galeria">
          <h2>Galería</h2>
          <div className="gallery">
            {profile.gallery.map((src) => (
              <img
                key={src}
                src={src}
                alt="Trabajo de Ortiz Signs"
                loading="lazy"
                onClick={() => openLightboxBySrc(src)}
              />
            ))}
          </div>
        </section>

        <section className="panel contact-pro">
          <div className="contact-head">
            <h2>Contacto</h2>
            <p>Nos especializamos en toda clase de rótulos. Cotizaciones sin compromiso.</p>
          </div>
          <div className={`contact-grid ${hasMap ? "with-map" : "no-map"}`}>
            <div className="contact-list">
              <article className="contact-item">
                <span className="contact-label">Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </article>
              <article className="contact-item">
                <span className="contact-label">Telefono</span>
                <a href={phoneUrl}>{profile.phone}</a>
              </article>
              <article className="contact-item">
                <span className="contact-label">WhatsApp</span>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  {profile.phone}
                </a>
              </article>
              <article className="contact-item">
                <span className="contact-label">Direccion</span>
                <p>{profile.address}</p>
              </article>
              <article className="contact-item">
                <span className="contact-label">YouTube</span>
                <a href={profile.youtubeUrl} target="_blank" rel="noreferrer">
                  @DanielOrama_95
                </a>
              </article>
              <article className="contact-item">
                <span className="contact-label">Instagram</span>
                <a href="https://www.instagram.com/ortizsignspr/?hl=es" target="_blank" rel="noreferrer">
                  @ortizsignspr
                </a>
              </article>
              <article className="contact-item">
                <span className="contact-label">Facebook</span>
                <a href="https://www.facebook.com/ortizsignspr" target="_blank" rel="noreferrer">
                  facebook.com/ortizsignspr
                </a>
              </article>
            </div>
            {hasMap ? (
              <aside className="contact-map-card">
                <h3>Ubicación</h3>
                <p>Consulta la zona y coordina instalación o visita por cita.</p>
                <div className="contact-map-frame">
                  <iframe
                    src={profile.mapEmbedUrl}
                    title="Mapa de ubicación Ortiz Signs"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      </main>

      {isAdminOpen && (
        <aside className="admin-panel">
          <div className="admin-head">
            <h3>Editar contenido</h3>
            <button
              type="button"
              className="admin-close"
              onClick={() => setIsAdminOpen(false)}
              aria-label="Cerrar panel"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </div>
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
                Nombre del dueño
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
                Quiénes somos
                <textarea value={form.aboutText} onChange={(e) => handleInput("aboutText", e.target.value)} />
              </label>

              <label>
                Servicios
              </label>
              <div className="service-editor-list">
                {(form.services ?? []).map((service, index) => (
                  <div className="service-editor-item" key={`${service}-${index}`}>
                    <input
                      value={service}
                      onChange={(e) => handleServiceItemChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() => handleRemoveServiceItem(index)}
                    >
                      Borrar
                    </button>
                  </div>
                ))}
                <button type="button" className="secondary-action" onClick={handleAddServiceItem}>
                  Añadir servicio
                </button>
              </div>

              <label>
                Misión
                <textarea value={form.mission} onChange={(e) => handleInput("mission", e.target.value)} />
              </label>

              <label>
                Visión
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
                URL mapa (Google embed, opcional)
                <input value={form.mapEmbedUrl} onChange={(e) => handleInput("mapEmbedUrl", e.target.value)} />
              </label>

              <label>
                URL de YouTube
                <input value={form.youtubeUrl} onChange={(e) => handleInput("youtubeUrl", e.target.value)} />
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.showSlideshow !== false}
                  onChange={(e) => handleInput("showSlideshow", e.target.checked)}
                />
                Mostrar slideshow en la pagina
              </label>

              <label>
                Agregar fotos al slideshow
                <input type="file" accept="image/*" multiple onChange={handleAddSlideshowPhotos} />
              </label>
              <details className="media-collapse" open>
                <summary>
                  Fotos del slideshow ({form.slideshowPhotos?.length ?? 0})
                </summary>
                {form.slideshowPhotos?.length > 0 ? (
                  <div className="gallery-admin-list">
                    {form.slideshowPhotos.map((src, index) => (
                      <div key={`${src}-${index}-slide`} className="gallery-admin-item">
                        <img src={src} alt={`Slideshow ${index + 1}`} />
                        <div className="admin-photo-actions">
                          <label className="secondary-action compact-file">
                            Reemplazar
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleReplaceSlideshowPhoto(index, e)}
                            />
                          </label>
                          <button
                            type="button"
                            className="danger-action"
                            onClick={() => handleRemoveSlideshowPhoto(index)}
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <small>No hay fotos en el slideshow.</small>
                )}
              </details>
              <button type="button" className="danger-action" onClick={handleClearSlideshowPhotos}>
                Borrar todas las fotos del slideshow
              </button>

              <label>
                Foto del dueño
                <input type="file" accept="image/*" onChange={handlePhoto} />
              </label>
              <button type="button" className="secondary-action" onClick={handleRemoveOwnerPhoto}>
                Quitar foto del dueño
              </button>

              <label>
                Agregar fotos a galeria
                <input type="file" accept="image/*" multiple onChange={handleAddGalleryPhotos} />
              </label>
              <details className="media-collapse">
                <summary>
                  Fotos de galeria ({form.gallery.length})
                </summary>
                {form.gallery.length > 0 ? (
                  <div className="gallery-admin-list">
                    {form.gallery.map((src, index) => (
                      <div key={`${src}-${index}`} className="gallery-admin-item">
                        <img src={src} alt={`Galería ${index + 1}`} />
                        <button
                          type="button"
                          className="danger-action"
                          onClick={() => handleRemoveGalleryPhoto(index)}
                        >
                          Borrar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <small>No hay fotos en la galeria.</small>
                )}
              </details>
              <button type="button" className="danger-action" onClick={handleClearGallery}>
                Borrar todas las fotos
              </button>

              <button type="submit" disabled={isSyncingProfile}>
                {isSyncingProfile ? "Publicando..." : "Guardar cambios"}
              </button>
            </form>
          )}
        </aside>
      )}

      {lightboxIndex >= 0 && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Cerrar imagen"
          >
            ×
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <img
            src={lightboxImages[lightboxIndex]}
            alt="Vista completa"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            aria-label="Siguiente imagen"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
