import { useState } from "react";

export default function App() {
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [input, setInput] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");

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
    "Push": `
      Lav en træningsplan til Push (Bryst, Skulder, Triceps):
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel:
        - Bench Press 4x10 @ 80kg
        - Shoulder Press 3x12 @ 25kg
        - Dips 3x12 kropsvægt
        - Incline Dumbbell Press 3x10 @ 30kg
        - Triceps Pushdown 3x12 @ 40kg
    `,
    "Pull": `
      Lav en træningsplan til Pull (Ryg, Biceps):
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel:
        - Deadlifts 4x6 @ 140kg
        - Pull-ups 3x12
        - Barbell Rows 3x10 @ 70kg
        - Lat Pulldown 3x12 @ 50kg
        - Bicep Curls 3x10 @ 20kg
    `,
    "Legs": `
      Lav en intens ben-træningsplan:
      - Øvelse Sæt x Reps @ Vægt
      - Eksempel:
        - Squat 5x5 @ 120kg
        - Bulgarian Split Squat 3x10 @ 20kg håndvægte
        - Romanian Deadlift 4x10 @ 80kg
        - Leg Press 4x12 @ 180kg
        - Calf Raises 4x20 @ 50kg
    `
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Fit-with-ChatGPT 🚀</h1>

      {/* Vælg træningsstil */}
      <div className="mb-4 w-full max-w-lg">
        <label className="block text-white font-semibold mb-2">Vælg din træningsstil:</label>
        <select
          onChange={(e) => setSelectedPrompt(prompts[e.target.value] || "")}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Vælg --</option>
          <option value="Full Body">💪 Full Body</option>
          <option value="Push">🔥 Push (Bryst, Skulder, Triceps)</option>
          <option value="Pull">💪 Pull (Ryg, Biceps)</option>
          <option value="Legs">🦵 Legs (Ben-træning)</option>
        </select>
      </div>

      {/* Kopierbar prompt-boks */}
      {selectedPrompt && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-md border border-gray-600 w-full max-w-lg">
          <p className="text-sm mb-2">🔹 Kopiér denne prompt til ChatGPT:</p>
          <textarea
            className="w-full p-2 bg-gray-900 text-white rounded-md"
            rows="4"
            readOnly
            value={selectedPrompt}
            onClick={(e) => e.target.select()}
          />
        </div>
      )}

      {/* Input-felt til træning */}
      <textarea
        className="w-full max-w-lg p-4 border-2 border-gray-700 bg-gray-800 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="4"
        placeholder="Indsæt din træning her..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={processWorkout}
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
      >
        📋 Formatér Træning
      </button>

      {/* Aktiv træning */}
      {workout.length > 0 && (
        <div className="w-full max-w-3xl mt-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-blue-300 mb-2">Aktiv Træning</h2>
          <table className="w-full bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Øvelse</th>
                <th className="py-3 px-4 text-center">Reps</th>
                <th className="py-3 px-4 text-center">Vægt</th>
                <th className="py-3 px-4 text-center">✔️</th>
              </tr>
            </thead>
            <tbody>
              {workout.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4">{item.exercise}</td>
                  <td className="py-3 px-4 text-center">{item.reps}</td>
                  <td className="py-3 px-4 text-center">{item.weight} kg</td>
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
    </div>
  );
}
