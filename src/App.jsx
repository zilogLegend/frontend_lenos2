import React, { useState, useEffect } from "react";
// Importaciones de imágenes locales
import bannerPrincipal from "./assets/banner.png";
import imgSalchicha from "./assets/salchicha.png";
import imgCarne from "./assets/carne.png";
import imgBBQ from "./assets/bbq.png";
import imgArrachera from "./assets/arrachera.png";
import imgPollo from "./assets/pollo.png";
import imgPolloPesto from "./assets/pollopesto.png";

// IMPORTACIÓN DEL COMPONENTE DE SEGURIDAD
// Asegúrate de que el archivo Comentarios.jsx esté en la misma carpeta src
import ComentariosSeguros from './Comentarios.jsx';

// --- COMPONENTE DE BARRA DE PROGRESO ---
const ProgressBar = ({ estado }) => {
  const etapas = ["Nuevo", "Preparando", "En camino", "Completado"];
  const currentIdx = etapas.indexOf(estado || "Nuevo");
  const porcentaje = ((currentIdx + 1) / etapas.length) * 100;

  return (
    <div style={{ marginTop: "20px", background: "#1C1816", padding: "20px", borderRadius: "15px", border: "1px solid #2D2825" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "11px", textTransform: "uppercase", color: "#A0A0A0" }}>
        <span style={{ color: currentIdx >= 0 ? "#C76A2A" : "" }}>Recibido</span>
        <span style={{ color: currentIdx >= 1 ? "#C76A2A" : "" }}>Cocina</span>
        <span style={{ color: currentIdx >= 2 ? "#C76A2A" : "" }}>En camino</span>
        <span style={{ color: currentIdx >= 3 ? "#10B981" : "" }}>Listo</span>
      </div>
      <div style={{ width: "100%", height: "8px", background: "#120F0D", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ 
          width: `${porcentaje}%`, 
          height: "100%", 
          background: estado === "Completado" ? "#10B981" : "#C76A2A",
          transition: "width 0.8s ease-in-out" 
        }} />
      </div>
      <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px", color: "#FFFFFF" }}>
        Estado actual: <span style={{ color: "#C76A2A" }}>{estado || "Nuevo"}</span>
      </p>
    </div>
  );
};

function App() {
  const [view, setView] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userRole, setUserRole] = useState("client"); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [pedidoActualId, setPedidoActualId] = useState(null);
  const [trackingEstado, setTrackingEstado] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [pedidosCliente, setPedidosCliente] = useState([]);

  // --- ESTADOS DEL FORMULARIO ---
  const [name, setName] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [carrito, setCarrito] = useState([{ leñoTipo: "Leño de Carne Ahumada", cantidad: 1 }]);
  const [pedidosBD, setPedidosBD] = useState([]); 

  const colors = {
    bg: "#120F0D",
    cardBg: "#1C1816",
    accent: "#C76A2A",
    textMain: "#FFFFFF",
    textSecondary: "#A0A0A0",
    border: "#2D2825",
  };

  const productos = [
    { id: 1, nombre: "Leño Sabor Salchicha", precio: 18.00, promo: 0, categoria: "Leños rellenos", img: imgSalchicha },
    { id: 2, nombre: "Leño de Carne Ahumada", precio: 25.00, promo: 19.99, categoria: "Leños rellenos", img: imgCarne },
    { id: 3, nombre: "Leño de Pollo al Pesto", precio: 22.00, promo: 0, categoria: "Leños rellenos", img: imgPolloPesto },
    { id: 4, nombre: "Leño BBQ Texas", precio: 28.00, promo: 24.00, categoria: "Leños rellenos", img: imgBBQ },
    { id: 5, nombre: "Leños Sabor Arrachera", precio: 30.00, promo: 0, categoria: "Leños rellenos", img: imgArrachera },
    { id: 6, nombre: "Leños Sabor Pollo", precio: 20.00, promo: 0, categoria: "Leños rellenos", img: imgPollo },
  ];

  useEffect(() => {
    let interval;
    if (showTracking && pedidoActualId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://backend-le-os-production.up.railway.app/api/pedidos/${pedidoActualId}`);
          if (res.ok) {
            const data = await res.json();
            setTrackingEstado(data.estado);
            if (data.estado === "Completado") clearInterval(interval);
          }
        } catch (err) { console.error("Error al rastrear:", err); }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showTracking, pedidoActualId]);

  const cargarPedidos = () => {
    fetch('https://backend-le-os-production.up.railway.app/api/pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidosBD(data);
        if (userRole === "client" && name) {
            setPedidosCliente(data.filter(p => p.nombre === name));
        }
      })
      .catch(err => console.error("Error cargando pedidos:", err));
  };

  useEffect(() => {
    if (isLoggedIn) cargarPedidos();
  }, [isLoggedIn, userRole, view]);

  const handleCompletarPedido = async (id) => {
    try {
      const res = await fetch(`https://backend-le-os-production.up.railway.app/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Completado' })
      });
      if (res.ok) cargarPedidos();
    } catch (error) { console.error("Error:", error); }
  };

  const handleBorrarPedido = async (id) => {
    if (window.confirm("¿Borrar registro?")) {
      try {
        await fetch(`https://backend-le-os-production.up.railway.app/api/pedidos/${id}`, { method: 'DELETE' });
        cargarPedidos();
      } catch (error) { console.error("Error:", error); }
    }
  };

  const handleConfirmarPedido = async () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    if (!name || !apellidos || !address) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const total = carrito.reduce((acc, item) => {
      const prod = productos.find(p => p.nombre === item.leñoTipo);
      const precioFinal = prod.promo > 0 ? prod.promo : prod.precio;
      return acc + (precioFinal * item.cantidad);
    }, 0);

    const pedidoCompleto = {
      nombre: name, 
      apellidos: apellidos, 
      telefono: phone,
      direccion: address, 
      items: carrito, 
      totalPagar: total, 
      estado: "Nuevo"
    };

    try {
      const res = await fetch('https://backend-le-os-production.up.railway.app/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoCompleto)
      });

      if (res.ok) {
        const data = await res.json();
        setPedidoActualId(data.id);
        setTrackingEstado("Nuevo");
        setShowTracking(true);
        cargarPedidos();
        
        const detalle = carrito.map(i => `• ${i.cantidad}x ${i.leñoTipo}`).join('%0A');
        const mensajeWA = `¡Hola! 🔥 *Nuevo pedido:*%0A%0A*Cliente:* ${name} ${apellidos}%0A*Teléfono:* ${phone}%0A*Dirección:* ${address}%0A%0A*Detalle:*%0A${detalle}%0A%0A*Total:* $${total.toFixed(2)}`;
        window.open(`https://wa.me/529212460459?text=${mensajeWA}`, '_blank');
      }
    } catch (error) { alert("Error al conectar con el servidor."); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const emailInput = e.target[authMode === 'signup' ? 1 : 0].value;
    if (emailInput === "DBamino12@gmail.com") {
      setUserRole("admin");
      setView("pedidos");
    } else if (emailInput === "DBamino11@gmail.com") {
      setUserRole("client");
      setView("home");
    }
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("client");
    setView("home");
    setShowProfileMenu(false);
  };

  const addAnotherLeno = () => {
    setCarrito([...carrito, { leñoTipo: "Leño de Carne Ahumada", cantidad: 1 }]);
  };

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.textMain, minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      {/* MODAL DE AUTH */}
      {showAuthModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: colors.cardBg, padding: "40px", borderRadius: "20px", border: `1px solid ${colors.border}`, width: "90%", maxWidth: "400px", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "white", cursor: "pointer" }}>✕</button>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🪵</div>
            <h2 style={{ color: colors.textMain, marginBottom: "10px" }}>{authMode === 'login' ? 'Bienvenido' : 'Crea tu cuenta'}</h2>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {authMode === 'signup' && <input style={inputDarkStyle} type="text" placeholder="Nombre completo" required />}
              <input style={inputDarkStyle} type="email" placeholder="Correo electrónico" required />
              <input style={inputDarkStyle} type="password" placeholder="Contraseña" required />
              <button type="submit" style={{ background: colors.accent, color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                {authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", borderBottom: `1px solid ${colors.border}`, background: colors.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", cursor: "pointer" }} onClick={() => setView("home")}>
          <span style={{ background: colors.accent, padding: "5px", borderRadius: "5px" }}>🪵</span>
          <span>LEÑOS RELLENOS</span>
        </div>
        <div style={{ display: "flex", gap: "25px", fontSize: "14px", color: colors.textSecondary, alignItems: "center" }}>
          {userRole === "client" && (
            <>
              <span style={navItemStyle(view === "home")} onClick={() => setView("home")}>Home</span>
              <span style={navItemStyle(view === "productos")} onClick={() => setView("productos")}>Products</span>
            </>
          )}
          {userRole === "admin" && <span style={navItemStyle(view === "pedidos")} onClick={() => setView("pedidos")}>Orders</span>}
          
          {isLoggedIn ? (
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: userRole === "admin" ? "#C76A2A" : "#5D69BE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: "pointer", position: "relative" }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {userRole === "admin" ? "A" : "E"}
              {showProfileMenu && (
                <div style={{ position: "absolute", top: "40px", right: 0, background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "8px", width: "160px", padding: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                  <div style={dropdownItemStyle} onClick={handleLogout}>🚪 Cerrar sesión</div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} style={{ background: colors.accent, color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Iniciar Sesión</button>
          )}
        </div>
      </nav>

      <main style={{ padding: "40px 5%" }}>
        {view === "home" || view === "productos" ? (
          <>
            <div style={{ width: "100%", height: "350px", borderRadius: "20px", overflow: "hidden", marginBottom: "40px", position: "relative", border: `1px solid ${colors.border}` }}>
                <img src={bannerPrincipal} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10%", background: "linear-gradient(to right, rgba(0,0,0,0.8), transparent)" }}>
                    <h1 style={{ fontSize: "48px", color: colors.accent, margin: 0 }}>Sabor a la Leña</h1>
                    <p style={{ fontSize: "20px", color: colors.textMain, maxWidth: "500px" }}>Disfruta de nuestros leños rellenos con el toque ahumado perfecto.</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", marginBottom: "60px" }}>
              {productos.map((item) => (
                <div key={item.id} style={{ background: colors.cardBg, borderRadius: "15px", overflow: "hidden", border: `1px solid ${colors.border}` }}>
                  <img src={item.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <div style={{ padding: "20px" }}>
                    <h3>{item.nombre}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                      <div><p style={labelStyle}>Precio</p><p style={{fontWeight:"bold"}}>${item.precio.toFixed(2)}</p></div>
                      <div><p style={labelStyle}>Promo</p><p style={{ color: colors.accent }}>{item.promo > 0 ? `$${item.promo.toFixed(2)}` : "-"}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORMULARIO DE PEDIDO */}
            <section style={{ maxWidth: "650px", margin: "40px auto", background: "#161311", padding: "40px", borderRadius: "25px", border: "1px solid #231F1C" }}>
              <h2 style={{ textAlign: "center", marginBottom: "35px", color: colors.accent, fontSize: "28px", fontWeight: "600" }}>Hacer Pedido por WhatsApp</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", gap: "15px" }}>
                  <input style={inputFormStyle} placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                  <input style={inputFormStyle} placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                </div>
                <input style={inputFormStyle} type="tel" maxLength="10" placeholder="Tu teléfono" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                <input style={inputFormStyle} placeholder="Dirección completa de entrega" value={address} onChange={(e) => setAddress(e.target.value)} />
                <p style={{ color: "#8E8E8E", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "10px" }}>Selecciona tus leños:</p>
                {carrito.map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "15px" }}>
                    <select style={{ ...inputFormStyle, flex: 3 }} value={item.leñoTipo} onChange={(e) => {
                      const newCarrito = [...carrito]; newCarrito[index].leñoTipo = e.target.value; setCarrito(newCarrito);
                    }}>
                      {productos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                    <input type="number" style={{ ...inputFormStyle, flex: 1, textAlign: "center" }} value={item.cantidad} onChange={(e) => {
                      const newCarrito = [...carrito]; newCarrito[index].cantidad = parseInt(e.target.value) || 1; setCarrito(newCarrito);
                    }} />
                  </div>
                ))}
                <button onClick={addAnotherLeno} style={{ background: "transparent", border: "1px dashed #C76A2A", color: colors.accent, padding: "12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>+ Añadir otro tipo de leño</button>
                <button onClick={handleConfirmarPedido} style={{ background: "#C76A2A", color: "white", padding: "18px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "18px", marginTop: "10px", boxShadow: "0 4px 15px rgba(199, 106, 42, 0.3)" }}>Confirmar Pedido 📱</button>
                {showTracking && <ProgressBar estado={trackingEstado} />}
              </div>
            </section>

            {/* HISTORIAL */}
            {isLoggedIn && userRole === "client" && (
                <section style={{ marginTop: "60px" }}>
                    <h2 style={{ color: colors.accent, marginBottom: "20px" }}>Mi Historial de Pedidos</h2>
                    <div style={{ background: colors.cardBg, borderRadius: "15px", border: `1px solid ${colors.border}`, padding: "20px" }}>
                        {pedidosCliente.length > 0 ? (
                            pedidosCliente.map(p => (
                                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <div style={{ fontWeight: "bold" }}>Pedido #{p.id?.slice(-5)}</div>
                                        <div style={{ fontSize: "12px", color: colors.textSecondary }}>{p.items?.map(i => `${i.cantidad}x ${i.leñoTipo}`).join(", ")}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ color: colors.accent }}>${p.totalPagar?.toFixed(2)}</div>
                                        <div style={{ fontSize: "11px", textTransform: "uppercase" }}>{p.estado}</div>
                                    </div>
                                </div>
                            ))
                        ) : <p style={{ color: colors.textSecondary }}>Aún no tienes pedidos registrados con este nombre.</p>}
                    </div>
                </section>
            )}
          </>
        ) : null}

        {/* Panel Admin */}
        {userRole === "admin" && view === "pedidos" && (
          <>
            <h1 style={{ marginBottom: "30px" }}>Gestión de Pedidos Real-Time</h1>
            <div style={{ overflowX: "auto", background: colors.cardBg, borderRadius: "15px", border: `1px solid ${colors.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}`, textAlign: "left" }}>
                    <th style={{ padding: "20px" }}>CLIENTE</th>
                    <th>PRODUCTOS</th>
                    <th>TOTAL</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosBD.map((p) => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: "20px" }}>{p.nombre} {p.apellidos}</td>
                      <td>{p.items?.map((item, idx) => <div key={idx}>{item.cantidad}x {item.leñoTipo}</div>)}</td>
                      <td style={{ color: colors.accent }}>${p.totalPagar?.toFixed(2)}</td>
                      <td>{p.estado}</td>
                      <td>
                        <button onClick={() => handleCompletarPedido(p.id)} style={{ background: "#10B981", border: "none", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }}>✅</button>
                        <button onClick={() => handleBorrarPedido(p.id)} style={{ background: "#EF4444", border: "none", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SECCIÓN DE SEGURIDAD (COMENTARIOS) - Movida para asegurar visibilidad */}
        <div style={{ width: '100%', clear: 'both' }}>
           <ComentariosSeguros />
        </div>
      </main>
    </div>
  );
}

// --- ESTILOS ---
const navItemStyle = (isActive) => ({ cursor: "pointer", color: isActive ? "#FFFFFF" : "#A0A0A0", fontWeight: isActive ? "bold" : "normal", borderBottom: isActive ? "2px solid #C76A2A" : "none", paddingBottom: "5px" });
const dropdownItemStyle = { padding: "10px", fontSize: "14px", cursor: "pointer", borderRadius: "4px" };
const inputDarkStyle = { background: "#120F0D", border: "1px solid #2D2825", padding: "14px", borderRadius: "10px", color: "white", width: "100%", boxSizing: "border-box", outline: "none" };
const inputFormStyle = { background: "#0D0B0A", border: "1px solid #25211E", padding: "16px", borderRadius: "12px", color: "#E0E0E0", width: "100%", boxSizing: "border-box", outline: "none", fontSize: "14px" };
const labelStyle = { fontSize: "11px", color: "#A0A0A0", textTransform: "uppercase", marginBottom: "5px" };
//cambio de refuerzo 2
//cambio
export default App;