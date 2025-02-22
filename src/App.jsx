import { useState } from "react";
import exerciseData from "./exercises.json"; // Importer vores lokale dataset

export default function App() {
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [input, setInput] = useState("");

  const processWorkout = () => {
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const parsedWorkout = [];

    lines.forEach((line, index) => {
      const match = line.match(/^\s*-\s*([\w\s()'-]+)\s*(\d+)x([\d/]+)(?:\s*@\s*([\d/kg/]+))?/);
      if (match) {
        const exercise = match[1].trim();
        const sets = parseInt(match[2]);
        const repsList = match[3].split("/");
        const weightList = match[4] ? match[4].split("/") : [];
        let lastKnownWeight = "";

        for (let i = 0; i < sets; i++) {
          let reps = parseInt(repsList[i] || repsList[repsList.length - 1]);
          let weight = weightList[i] ? parseInt(weightList[i].replace("kg", "")) : lastKnownWeight;
          if (weightList[i]) lastKnownWeight = weight;

          let volume = weight ? reps * weight : 0;

          parsedWorkout.push({
            id: `${index}-${i}`,
            exercise,
            set: i + 1,
            reps,
            weight,
            volume,
          });
        }
      }
    });

    setWorkout(parsedWorkout);
  };

  const completeSet = (setId) => {
    const setToComplete = workout.find((set) => set.id === setId);
    if (setToComplete) {
      setCompletedSets([...completedSets, setToComplete]);
      setWorkout(workout.filter((set) => set.id !== setId));
    }
  };

  const totalVolume = completedSets.reduce((sum, set) => sum + set.volume, 0);
  const prompts = {
    "Full Body": `
      Lav en effektiv Full Body træningsplan:
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel: 
        - Squat 4x8 @ 90kg
        - Bent-over Rows 4x10 @ 50kg
        - Shoulder Press 3x12 @ 30kg
        - Romanian Deadlifts 3x12 @ 60kg
        - Plank 3x30 sekunder
    `,
    "Push/Pull/Legs": `
      Lav en struktureret Push/Pull/Legs split træningsplan:
      - Øvelse Sæt x Reps @ Vægt
      - Push dag:
        - Bench Press 4x10 @ 80kg
        - Shoulder Press 3x12 @ 25kg
        - Dips 3x12 kropsvægt
      - Pull dag:
        - Deadlifts 4x6 @ 140kg
        - Pull-ups 3x12
        - Bicep Curls 3x10 @ 20kg
      - Legs dag:
        - Squat 4x8 @ 100kg
        - Leg Press 4x12 @ 150kg
        - Calf Raises 4x15 @ 40kg
    `,
    "Hypertrofi": `
      Lav en træningsplan til hypertrofi (muskelopbygning):
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel:
        - Bench Press 4x12/10/8/6 @ 75/80/85/90kg
        - Lat Pulldown 4x12/10/8/6 @ 50/55/60/65kg
        - Bulgarian Split Squat 3x10 @ 20kg håndvægte
        - Face Pulls 3x15 @ 30kg
        - Hammer Curls 3x12 @ 15kg
    `,
    "Styrketræning": `
      Lav en træningsplan til styrketræning (powerlifting):
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel:
        - Squat 5x5 @ 150kg
        - Bench Press 5x5 @ 100kg
        - Deadlift 5x5 @ 180kg
        - Overhead Press 3x5 @ 60kg
        - Barbell Row 3x6 @ 80kg
    `
  };
  
  const handlePromptCopy = (type) => {
    if (type && prompts[type]) {
      navigator.clipboard.writeText(prompts[type]);
      alert(`✅ ${type} ChatGPT prompt kopieret! Indsæt den i ChatGPT.`);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Fit-with-ChatGPT 🚀</h1>

      {/* INPUT-FELT */}
      {/* Vælg træningsstil og kopier prompt til ChatGPT */}
<div className="mb-4 w-full max-w-lg">
  <label className="block text-white font-semibold mb-2">Vælg din træningsstil:</label>
  <select
    onChange={(e) => handlePromptCopy(e.target.value)}
    className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="">-- Vælg --</option>
    <option value="Full Body">💪 Full Body</option>
    <option value="Push/Pull/Legs">🏋️ Push/Pull/Legs Split</option>
    <option value="Hypertrofi">🔥 Hypertrofi (Muskelopbygning)</option>
    <option value="Styrketræning">⚡ Styrketræning (Powerlifting)</option>
  </select>
</div>

      <textarea
        className="w-full max-w-lg p-4 border-2 border-gray-700 bg-gray-800 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="4"
        placeholder="Indsæt din træning her..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* KNAP */}
      <button
        onClick={processWorkout}
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
      >
        📋 Formatér Træning
      </button>

      {/* TABELLEN - VISER AKTIVE SÆT */}
      {workout.length > 0 && (
        <div className="w-full max-w-3xl mt-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-blue-300 mb-2">Aktiv Træning</h2>
          <table className="w-full bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Øvelse</th>
                <th className="py-3 px-4 text-center">Sæt</th>
                <th className="py-3 px-4 text-center">Reps</th>
                <th className="py-3 px-4 text-center">Vægt</th>
                <th className="py-3 px-4 text-center">Volume</th>
                <th className="py-3 px-4 text-center">YouTube</th>
                <th className="py-3 px-4 text-center">✔️</th>
              </tr>
            </thead>
            <tbody>
              {workout.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4">{item.exercise}</td>
                  <td className="py-3 px-4 text-center">{item.set}</td>
                  <td className="py-3 px-4 text-center">{item.reps}</td>
                  <td className="py-3 px-4 text-center">{item.weight} kg</td>
                  <td className="py-3 px-4 text-center">{item.volume} kg</td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(item.exercise)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline hover:text-blue-600"
                    >
                      🎥 Se på YouTube
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => completeSet(item.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                      ✅ Slut Sæt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABELLEN - FÆRDIGGJORTE SÆT */}
      {completedSets.length > 0 && (
        <div className="w-full max-w-3xl mt-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-green-300 mb-2">✅ Færdiggjorte Sæt</h2>
          <table className="w-full bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Øvelse</th>
                <th className="py-3 px-4 text-center">Sæt</th>
                <th className="py-3 px-4 text-center">Reps</th>
                <th className="py-3 px-4 text-center">Vægt</th>
                <th className="py-3 px-4 text-center">Volume</th>
              </tr>
            </thead>
            <tbody>
              {completedSets.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4">{item.exercise}</td>
                  <td className="py-3 px-4 text-center">{item.set}</td>
                  <td className="py-3 px-4 text-center">{item.reps}</td>
                  <td className="py-3 px-4 text-center">{item.weight} kg</td>
                  <td className="py-3 px-4 text-center">{item.volume} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-xl font-bold text-green-400 mt-4">
            🔥 Samlet Volume: {totalVolume} kg
          </h3>
        </div>
      )}
    </div>
  );
}
