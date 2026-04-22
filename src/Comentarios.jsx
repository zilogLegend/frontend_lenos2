import React, { useState } from 'react';

const ComentariosSeguros = () => {
  const [comentario, setComentario] = useState('');
  const [comentarioRecibido, setComentarioRecibido] = useState('');

  const enviarComentario = async (e) => {
    e.preventDefault();
    try {
      // 1. Usamos la variable de entorno actualizada (sin el /api)
      // Si la variable no carga, usamos la URL base directa de Railway
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-le-os-production.up.railway.app';

      // 2. Apuntamos a /comentarios (que ahora es la ruta directa en tu index.js)
      const response = await fetch(`${apiBaseUrl}/comentarios`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY 
        },
        body: JSON.stringify({ texto: comentario }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data = await response.json();
      setComentarioRecibido(data.texto); 
      setComentario(''); // Limpiar el campo
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Error de conexión. Verifica que el Backend y la API Key estén activos.");
    }
  };

  return (
    <section style={{ padding: '40px', background: '#1C1816', borderRadius: '20px', marginTop: '40px', border: '1px solid #2D2825' }}>
      <h2 style={{ color: '#C76A2A' }}>Sección de Comentarios (Práctica de Seguridad 4.4)</h2>
      
      <form onSubmit={enviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea 
          style={{ background: '#0D0B0A', color: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #25211E', minHeight: '100px' }}
          placeholder="Escribe tu comentario aquí..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        />
        <button type="submit" style={{ background: '#C76A2A', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Enviar con Conexión Segura
        </button>
      </form>

      {comentarioRecibido && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#120F0D', borderRadius: '10px', borderLeft: '4px solid #C76A2A' }}>
          <p style={{ color: '#A0A0A0', fontSize: '12px' }}>Respuesta del servidor (Cloud):</p>
          <div style={{ color: 'white' }}>{comentarioRecibido}</div>
        </div>
      )}
    </section>
  );
};

export default ComentariosSeguros;