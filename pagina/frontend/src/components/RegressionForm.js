import React, { useState } from 'react';

function RegressionForm() {
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
    const response = await fetch('http://localhost:8000/predict_regression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div className="form-container">
      <h2>Predicción de ImpactPlayerScore (Regresión)</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input type="number" name={key} value={formData[key]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit">Predecir</button>
      </form>
      {prediction !== null && (
        <div className="result">
          <strong>Resultado:</strong> {prediction.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default RegressionForm;
