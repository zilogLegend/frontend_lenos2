import React, { useState } from 'react';

const ComentariosSeguros = () => {
  const [comentario, setComentario] = useState('');
  const [comentarioRecibido, setComentarioRecibido] = useState('');

  const enviarComentario = async (e) => {
    e.preventDefault();
    
    // --- LOGS PARA LA DEMOSTRACIÓN ---
    console.log("🚀 Iniciando proceso de envío seguro...");
    console.log("📝 Contenido del comentario:", comentario);

    try {
      // 1. Usamos la variable de entorno configurada en Railway
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-le-os-production.up.railway.app';
      
      // LOG: Verificamos que la API Key esté cargada (mostramos solo el final por seguridad)
      const apiKey = import.meta.env.VITE_API_KEY;
      console.log("🔑 API Key detectada (fin):", apiKey ? `***${apiKey.slice(-4)}` : "NO DETECTADA");

      // 2. Ejecutamos la petición Fetch
      const response = await fetch(`${apiBaseUrl}/comentarios`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey 
        },
        body: JSON.stringify({ texto: comentario }),
      });

      console.log("📡 Estado de respuesta del servidor:", response.status);

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data = await response.json();
      
      // LOG: Mostramos el objeto JSON que nos devolvió el Backend
      console.log("✅ Datos recibidos de MongoDB Atlas:", data);

      setComentarioRecibido(data.texto); 
      setComentario(''); // Limpiar el campo
      
    } catch (error) {
      console.error("❌ Error en la comunicación:", error);
      alert("Error de conexión. Revisa la consola para más detalles.");
    }
  };

  return (
    <section style={{ 
      padding: '40px', 
      background: '#1C1816', 
      borderRadius: '20px', 
      marginTop: '40px', 
      border: '1px solid #2D2825' 
    }}>
      <h2 style={{ color: '#C76A2A' }}>Sección de Comentarios (Práctica de Seguridad 4.4)</h2>
      
      <p style={{ color: '#A0A0A0', marginBottom: '20px' }}>
        Esta sección utiliza un Middleware de <strong>API Key</strong> y <strong>Sanitización</strong> en el servidor.
      </p>

      <form onSubmit={enviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea 
          style={{ 
            background: '#0D0B0A', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '10px', 
            border: '1px solid #25211E', 
            minHeight: '100px',
            outline: 'none'
          }}
          placeholder="Escribe tu comentario aquí..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        />
        <button 
          type="submit" 
          style={{ 
            background: '#C76A2A', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#e07a31'}
          onMouseOut={(e) => e.target.style.background = '#C76A2A'}
        >
          Enviar con Conexión Segura
        </button>
      </form>

      {comentarioRecibido && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#120F0D', 
          borderRadius: '10px', 
          borderLeft: '4px solid #C76A2A' 
        }}>
          <p style={{ color: '#C76A2A', fontSize: '12px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            RESPUESTA EXITOSA DEL SERVIDOR (CLOUD):
          </p>
          <div style={{ color: 'white', fontSize: '16px' }}>{comentarioRecibido}</div>
        </div>
      )}
    </section>
  );
};

export default ComentariosSeguros;