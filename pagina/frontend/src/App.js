import React, { useState } from "react";

function App() {
  // Estado para modelo de regresión
  const [regInputs, setRegInputs] = useState({
    kast: "",
    time_alive: "",
    travelled_distance: "",
    round_headshots: "",
  });
  const [regResult, setRegResult] = useState(null);

  // Estado para modelo de clasificación
  const [clfInputs, setClfInputs] = useState({
    kast: "",
    time_alive: "",
    travelled_distance: "",
  });
  const [clfResult, setClfResult] = useState(null);

  // Cambios en formularios
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar datos al backend
  const predictRegression = async () => {
    const response = await fetch("http://localhost:8000/predict/impact_score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kast: parseFloat(regInputs.kast),
        time_alive: parseFloat(regInputs.time_alive),
        travelled_distance: parseFloat(regInputs.travelled_distance),
        round_headshots: parseFloat(regInputs.round_headshots),
      }),
    });
    const data = await response.json();
    setRegResult(data.impact_score);
  };

  const predictClassification = async () => {
    const response = await fetch("http://localhost:8000/predict/high_impact_player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kast: parseFloat(clfInputs.kast),
        time_alive: parseFloat(clfInputs.time_alive),
        travelled_distance: parseFloat(clfInputs.travelled_distance),
      }),
    });
    const data = await response.json();
    setClfResult(data);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Predicción de Jugador en CSGO</h1>

      {/* Formulario de regresión */}
      <div style={{ marginBottom: "40px" }}>
        <h2>1. Predecir Impact Player Score</h2>
        <input
          type="number"
          name="kast"
          placeholder="KAST"
          value={regInputs.kast}
          onChange={handleChange(setRegInputs)}
        />
        <input
          type="number"
          name="time_alive"
          placeholder="Time Alive"
          value={regInputs.time_alive}
          onChange={handleChange(setRegInputs)}
        />
        <input
          type="number"
          name="travelled_distance"
          placeholder="Travelled Distance"
          value={regInputs.travelled_distance}
          onChange={handleChange(setRegInputs)}
        />
        <input
          type="number"
          name="round_headshots"
          placeholder="Round Headshots"
          value={regInputs.round_headshots}
          onChange={handleChange(setRegInputs)}
        />
        <br />
        <button onClick={predictRegression}>Predecir Score</button>
        {regResult !== null && (
          <p><strong>Impact Player Score:</strong> {regResult}</p>
        )}
      </div>

      {/* Formulario de clasificación */}
      <div>
        <h2>2. Clasificar como High Impact Player</h2>
        <input
          type="number"
          name="kast"
          placeholder="KAST"
          value={clfInputs.kast}
          onChange={handleChange(setClfInputs)}
        />
        <input
          type="number"
          name="time_alive"
          placeholder="Time Alive"
          value={clfInputs.time_alive}
          onChange={handleChange(setClfInputs)}
        />
        <input
          type="number"
          name="travelled_distance"
          placeholder="Travelled Distance"
          value={clfInputs.travelled_distance}
          onChange={handleChange(setClfInputs)}
        />
        <br />
        <button onClick={predictClassification}>Clasificar Jugador</button>
        {clfResult !== null && (
          <p>
            <strong>¿High Impact Player?</strong> {clfResult.high_impact_prediction === 1 ? "Sí" : "No"}<br />
            <strong>Probabilidad:</strong> {clfResult.probability}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
