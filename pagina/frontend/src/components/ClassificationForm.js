import React, { useState } from 'react';

function ClassificationForm() {
  const [formData, setFormData] = useState({
    KAST: '',
    TimeAlive: '',
    TravelledDistance: '',
    RoundHeadshots: ''
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/predict_classification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setPrediction(data.prediction === 1 ? 'Jugador de alto impacto' : 'Jugador de impacto medio-bajo');
  };

  return (
    <div className="form-container">
      <h2>Clasificación de Jugador (¿Alto Impacto?)</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input type="number" name={key} value={formData[key]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit">Clasificar</button>
      </form>
      {prediction && (
        <div className="result">
          <strong>Resultado:</strong> {prediction}
        </div>
      )}
    </div>
  );
}

export default ClassificationForm;
