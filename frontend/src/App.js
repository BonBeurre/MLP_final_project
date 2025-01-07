import React, { useState } from "react";

function App() {
    const [formData, setFormData] = useState({
        sepal_length: "",
        sepal_width: "",
        petal_length: "",
        petal_width: ""
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/predict/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setPrediction(data.prediction);
        } catch (error) {
            console.error("Erreur lors de la prédiction :", error);
        }
    };

    return (

        
        <div>
            
            <h1>Prédiction Iris</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="sepal_length"
                    placeholder="Sepal Length"
                    value={formData.sepal_length}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="sepal_width"
                    placeholder="Sepal Width"
                    value={formData.sepal_width}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="petal_length"
                    placeholder="Petal Length"
                    value={formData.petal_length}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="petal_width"
                    placeholder="Petal Width"
                    value={formData.petal_width}
                    onChange={handleChange}
                />
                <button type="submit">Prédire</button>
            </form>
            {prediction && <h2>Prédiction : {prediction}</h2>}

            
        </div>
        
    );
}

export default App;