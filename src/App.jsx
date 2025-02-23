import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile.jsx";
import WorkoutPage from "./pages/WorkOutPage.jsx";
import HomePage from "./pages/HomePage";

export default function App() {
  // 📌 State (træningsdata)
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [input, setInput] = useState("");
  const [confirmingSet, setConfirmingSet] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [editingSet, setEditingSet] = useState(null);
  const [tempValue, setTempValue] = useState("");
 
  // 📌 Funktion til at processere input og lave træningsdata
  const processWorkout = () => {
    if (!input.trim()) {
      alert("⚠️ Indtast din træning først!");
      return;
    }

    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const parsedWorkout = [];

    lines.forEach((line, index) => {
      const match = line.match(/^\s*-?\s*([\w\s()'-]+)\s*(\d+)x([\d/]+)(?:\s*@\s*([\d/kg/]+|kropsvægt|sekunder))?/i);
      if (match) {
        const exercise = match[1].trim();
        const sets = parseInt(match[2]);
        const repsList = match[3].split("/");
        const weightList = match[4] ? match[4].split("/") : [];
        let lastKnownWeight = "";

        for (let i = 0; i < sets; i++) {
          let reps = parseInt(repsList[i] || repsList[repsList.length - 1]);
          let weight = weightList[i] 
            ? weightList[i].includes("kg") || weightList[i] === "kropsvægt" || weightList[i] === "sekunder"
              ? weightList[i]
              : parseInt(weightList[i].replace("kg", ""))
            : lastKnownWeight;
          
          if (weightList[i]) lastKnownWeight = weight;

          let volume = weight && !isNaN(parseInt(weight)) ? reps * parseInt(weight) : 0;

          parsedWorkout.push({
            id: `${index}-${i}`,
            exercise,
            set: i + 1,
            reps,
            weight,
            volume,
          });
        }
      } else {
        console.error("Kunne ikke parse linje:", line);
      }
    });

    if (parsedWorkout.length === 0) {
      alert("⚠️ Ingen gyldige øvelser fundet! Sørg for at følge formatet: - Øvelse 4x10 @ 80kg");
      return;
    }

    setWorkout(parsedWorkout);
  };

  // 📌 Funktion til at markere et sæt som færdigt
  const completeSet = (setId) => {
    setWorkout((prevWorkout) => prevWorkout.filter((set) => set.id !== setId));
    setCompletedSets((prevCompleted) => {
      const setToComplete = workout.find((set) => set.id === setId);
      return setToComplete ? [...prevCompleted, setToComplete] : prevCompleted;
    });
  };

 

  // 📌 Funktion til at slette et sæt
  const removeSet = (setId) => {
    setWorkout((prevWorkout) => prevWorkout.filter((set) => set.id !== setId));
  };

  return (
    <Router>
      <Routes>
        {/* 📌 Layout håndterer navigation */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route 
            path="workout" 
            element={
              <WorkoutPage
                workout={workout}
                setWorkout={setWorkout}
                completedSets={completedSets}
                setCompletedSets={setCompletedSets}
                input={input}
                setInput={setInput}
                processWorkout={processWorkout}
                completeSet={completeSet}
                removeSet={removeSet}
              />
            } 
          />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
