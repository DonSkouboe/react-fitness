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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Fitness Tracker 🚀</h1>

      {/* INPUT-FELT */}
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
