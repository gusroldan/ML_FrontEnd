import React, { useState } from "react";

const estilos = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "1rem",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  tabButton: (active) => ({
    padding: "0.5rem 1.5rem",
    cursor: "pointer",
    border: "none",
    borderBottom: active ? "3px solid #007bff" : "3px solid transparent",
    backgroundColor: "transparent",
    fontWeight: active ? "bold" : "normal",
    color: active ? "#007bff" : "#444",
    fontSize: "1rem",
    transition: "border-color 0.3s",
  }),
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "1rem 1.5rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
    minHeight: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "600",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff",
  },
  button: {
    padding: "0.7rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  buttonDisabled: {
    backgroundColor: "#a0c4ff",
    cursor: "not-allowed",
  },
};

export default function App() {
  const [tab, setTab] = useState("regresion");

  const [inputsReg, setInputsReg] = useState({
    KAST: "",
    TimeAlive: "",
    TravelledDistance: "",
    RoundHeadshots: "",
  });
  const [resultReg, setResultReg] = useState(null);
  const [loadingReg, setLoadingReg] = useState(false);

  const [inputsClas, setInputsClas] = useState({
    KAST: "",
    TimeAlive: "",
    TravelledDistance: "",
    RoundHeadshots: "",
  });
  const [resultClas, setResultClas] = useState(null);
  const [loadingClas, setLoadingClas] = useState(false);

  const handleChangeReg = (e) => {
    setInputsReg({ ...inputsReg, [e.target.name]: e.target.value });
  };

  const handleChangeClas = (e) => {
    setInputsClas({ ...inputsClas, [e.target.name]: e.target.value });
  };

  const handleSubmitReg = async (e) => {
    e.preventDefault();
    setLoadingReg(true);
    setResultReg(null);

    try {
      const res = await fetch("http://localhost:8000/predict_regression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          KAST: Number(inputsReg.KAST),
          TimeAlive: Number(inputsReg.TimeAlive),
          TravelledDistance: Number(inputsReg.TravelledDistance),
          RoundHeadshots: Number(inputsReg.RoundHeadshots),
        }),
      });
      const data = await res.json();
      setResultReg(data.ImpactPlayerScore);
    } catch {
      setResultReg("Error al predecir");
    } finally {
      setLoadingReg(false);
    }
  };

  const handleSubmitClas = async (e) => {
    e.preventDefault();
    setLoadingClas(true);
    setResultClas(null);

    try {
      const res = await fetch("http://localhost:8000/predict_classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          KAST: Number(inputsClas.KAST),
          TimeAlive: Number(inputsClas.TimeAlive),
          TravelledDistance: Number(inputsClas.TravelledDistance),
          RoundHeadshots: Number(inputsClas.RoundHeadshots),
        }),
      });
      const data = await res.json();
      // Aquí traducimos 0 o 1 a "No" o "Sí"
      setResultClas(data.HighImpactPlayer === 1 ? "Sí" : "No");
    } catch {
      setResultClas("Error al predecir");
    } finally {
      setLoadingClas(false);
    }
  };

  return (
    <div style={estilos.container}>
      <h1 style={estilos.header}>Predicción de Jugador</h1>

      <div style={estilos.tabs}>
        <button
          style={tab === "regresion" ? estilos.tabButton(true) : estilos.tabButton(false)}
          onClick={() => setTab("regresion")}
          type="button"
        >
          Modelo Regresión
        </button>
        <button
          style={tab === "clasificacion" ? estilos.tabButton(true) : estilos.tabButton(false)}
          onClick={() => setTab("clasificacion")}
          type="button"
        >
          Modelo Clasificación
        </button>
      </div>

      {tab === "regresion" && (
        <section
          style={{
            backgroundColor: "#fff",
            padding: "1rem 2rem",
            borderRadius: 8,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div style={estilos.card}>
            {loadingReg
              ? "Cargando..."
              : resultReg !== null
              ? `Predicción ImpactPlayerScore: ${resultReg}`
              : "Ingrese los valores y presione Predecir"}
          </div>
          <form onSubmit={handleSubmitReg} style={estilos.form}>
            {["KAST", "TimeAlive", "TravelledDistance", "RoundHeadshots"].map((field) => (
              <label key={field} style={estilos.label} htmlFor={field}>
                {field}
                <input
                  id={field}
                  name={field}
                  type="number"
                  step="any"
                  required
                  value={inputsReg[field]}
                  onChange={handleChangeReg}
                  style={estilos.input}
                  placeholder={`Ingrese ${field}`}
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={loadingReg}
              style={{
                ...estilos.button,
                ...(loadingReg ? estilos.buttonDisabled : {}),
              }}
            >
              Predecir
            </button>
          </form>
        </section>
      )}

      {tab === "clasificacion" && (
        <section
          style={{
            backgroundColor: "#fff",
            padding: "1rem 2rem",
            borderRadius: 8,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div style={estilos.card}>
            {loadingClas
              ? "Cargando..."
              : resultClas !== null
              ? `Predicción High Impact Player: ${resultClas}`
              : "Ingrese los valores y presione Predecir"}
          </div>
          <form onSubmit={handleSubmitClas} style={estilos.form}>
            {["KAST", "TimeAlive", "TravelledDistance", "RoundHeadshots"].map((field) => (
              <label key={field} style={estilos.label} htmlFor={field}>
                {field}
                <input
                  id={field}
                  name={field}
                  type="number"
                  step="any"
                  required
                  value={inputsClas[field]}
                  onChange={handleChangeClas}
                  style={estilos.input}
                  placeholder={`Ingrese ${field}`}
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={loadingClas}
              style={{
                ...estilos.button,
                ...(loadingClas ? estilos.buttonDisabled : {}),
              }}
            >
              Predecir
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
