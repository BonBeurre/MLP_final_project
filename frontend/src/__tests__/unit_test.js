import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component", () => {
    it("renders the form and input fields", () => {
        render(<App />);
        expect(screen.getByPlaceholderText("Sepal Length")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Sepal Width")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Petal Length")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Petal Width")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Prédire/i })).toBeInTheDocument();
    });

    it("updates input values on user typing", () => {
        render(<App />);
        const sepalLengthInput = screen.getByPlaceholderText("Sepal Length");

        fireEvent.change(sepalLengthInput, { target: { value: "5.1" } });
        expect(sepalLengthInput.value).toBe("5.1");

        const sepalWidthInput = screen.getByPlaceholderText("Sepal Width");
        fireEvent.change(sepalWidthInput, { target: { value: "3.5" } });
        expect(sepalWidthInput.value).toBe("3.5");
    });

    it("handles form submission and displays prediction", async () => {
        const mockPrediction = { prediction: "Iris-setosa" };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockPrediction),
            })
        );

        render(<App />);
        const sepalLengthInput = screen.getByPlaceholderText("Sepal Length");
        const sepalWidthInput = screen.getByPlaceholderText("Sepal Width");
        const petalLengthInput = screen.getByPlaceholderText("Petal Length");
        const petalWidthInput = screen.getByPlaceholderText("Petal Width");
        const submitButton = screen.getByRole("button", { name: /Prédire/i });

        fireEvent.change(sepalLengthInput, { target: { value: "5.1" } });
        fireEvent.change(sepalWidthInput, { target: { value: "3.5" } });
        fireEvent.change(petalLengthInput, { target: { value: "1.4" } });
        fireEvent.change(petalWidthInput, { target: { value: "0.2" } });

        fireEvent.click(submitButton);

        const prediction = await screen.findByText(/Prédiction : Iris-setosa/);
        expect(prediction).toBeInTheDocument();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith("https://soft-serena-adibon-43b0a5e4.koyeb.app/predict/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sepal_length: "5.1",
                sepal_width: "3.5",
                petal_length: "1.4",
                petal_width: "0.2",
            }),
        });

        global.fetch.mockRestore();
    });

    it("handles fetch errors gracefully", async () => {
        global.fetch = jest.fn(() => Promise.reject("API error"));

        render(<App />);
        const sepalLengthInput = screen.getByPlaceholderText("Sepal Length");
        const submitButton = screen.getByRole("button", { name: /Prédire/i });

        // Fill in the form
        fireEvent.change(sepalLengthInput, { target: { value: "5.1" } });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for console.error to be called
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        await new Promise((resolve) => setTimeout(resolve, 100)); // Allow promise to settle

        expect(consoleSpy).toHaveBeenCalledWith(
            "Erreur lors de la prédiction :",
            "API error"
        );

        // Cleanup
        consoleSpy.mockRestore();
        global.fetch.mockRestore();
    });
});
