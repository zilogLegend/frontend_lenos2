import React, { useState } from 'react';

const ComentariosSeguros = () => {
  const [comentario, setComentario] = useState('');
  const [comentarioRecibido, setComentarioRecibido] = useState('');

  const enviarComentario = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-le-os-production.up.railway.app/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: comentario }),
      });
      const data = await response.json();
      // Mostramos el comentario tal cual viene del servidor
      setComentarioRecibido(data.texto); 
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  return (
    <section style={{ padding: '40px', background: '#1C1816', borderRadius: '20px', marginTop: '40px', border: '1px solid #2D2825' }}>
      <h2 style={{ color: '#C76A2A' }}>Sección de Comentarios (Práctica de Seguridad)</h2>
      
      <form onSubmit={enviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea 
          style={{ background: '#0D0B0A', color: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #25211E' }}
          placeholder="Escribe tu comentario aquí..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        />
        <button type="submit" style={{ background: '#C76A2A', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Enviar Comentario
        </button>
      </form>

      {comentarioRecibido && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#120F0D', borderRadius: '10px' }}>
          <p style={{ color: '#A0A0A0', fontSize: '12px' }}>Comentario renderizado de forma segura:</p>
          {/* React escapa automáticamente el HTML aquí para prevenir XSS */}
          <div style={{ color: 'white' }}>{comentarioRecibido}</div>
        </div>
      )}
    </section>
  );
};

export default ComentariosSeguros;