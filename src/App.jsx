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
      Lav en effektiv Full Body træningsplan. Hold det **udelukkende** i dette format, men kom selv med det komplette program som ønskes. Lav den i klar tekst så den er nem at kopiere:
      - Øvelse Sæt x Reps @ Vægt (kg)
      
      Eksempel:
      - Squat 4x8 @ 90kg
      - Bent-over Rows 4x10 @ 50kg
      - Shoulder Press 3x12 @ 30kg
      - Romanian Deadlifts 3x12 @ 60kg
      - Plank 3x30 sekunder
      
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `,
    "Push": `
      Lav en træningsplan til Push (Bryst, Skulder, Triceps). Hold formatet **præcis** som vist her:
      - Øvelse Sæt x Reps @ Vægt (kg)
  
      Eksempel:
      - Bench Press 4x10 @ 80kg
      - Shoulder Press 3x12 @ 25kg
      - Dips 3x12 kropsvægt
      - Incline Dumbbell Press 3x10 @ 30kg
      - Triceps Pushdown 3x12 @ 40kg
  
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `,
    "Pull": `
      Lav en træningsplan til Pull (Ryg, Biceps). **Brug KUN følgende format**:
      - Øvelse Sæt x Reps @ Vægt (kg)
  
      Eksempel:
      - Deadlifts 4x6 @ 140kg
      - Pull-ups 3x12
      - Barbell Rows 3x10 @ 70kg
      - Lat Pulldown 3x12 @ 50kg
      - Bicep Curls 3x10 @ 20kg
  
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `,
    "Legs": `
      Lav en intens ben-træningsplan i **præcis** dette format:
      - Øvelse Sæt x Reps @ Vægt (kg)
  
      Eksempel:
      - Squat 5x5 @ 120kg
      - Bulgarian Split Squat 3x10 @ 20kg håndvægte
      - Romanian Deadlift 4x10 @ 80kg
      - Leg Press 4x12 @ 180kg
      - Calf Raises 4x20 @ 50kg
  
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `,
    "Hypertrofi": `
      Lav en træningsplan til hypertrofi (muskelopbygning). Brug **KUN** dette format:
      - Øvelse Sæt x Reps @ Vægt (kg)
  
      Eksempel:
      - Bench Press 4x12/10/8/6 @ 75/80/85/90kg
      - Lat Pulldown 4x12/10/8/6 @ 50/55/60/65kg
      - Bulgarian Split Squat 3x10 @ 20kg håndvægte
      - Face Pulls 3x15 @ 30kg
      - Hammer Curls 3x12 @ 15kg
  
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `,
    "Styrketræning": `
      Lav en træningsplan til styrketræning (powerlifting). **Format SKAL være præcist som vist**:
      - Øvelse Sæt x Reps @ Vægt (kg)
  
      Eksempel:
      - Squat 5x5 @ 150kg
      - Bench Press 5x5 @ 100kg
      - Deadlift 5x5 @ 180kg
      - Overhead Press 3x5 @ 60kg
      - Barbell Row 3x6 @ 80kg
  
      **⚠️ VIGTIGT:**
      - INGEN ekstra forklaringer eller emojis.
      - INGEN punktopstillinger eller nummerering.
      - KUN i dette format.
    `
  };
  
  
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const handlePromptCopy = (type) => {
    if (type && prompts[type]) {
        let textToCopy = `LAV en detaljeret træningsplan i dette **EKSAKTE FORMAT** uden bullet points eller ekstra tekst:\n\n`;

        textToCopy += `${prompts[type]}\n\n`;

        textToCopy += `**RETNINGSLINJER FOR DIT SVAR:**  
- Skriv kun træningsprogrammet i **ren tekst** uden bullet points.  
- Brug dette format præcist:
  
  Squat 4x10 @ 90kg  
  Deadlift 4x6 @ 120kg  
  Bench Press 4x10 @ 85kg  
  Bent-over Rows 4x10 @ 55kg  
  Shoulder Press 3x12 @ 32kg  
  Hanging Leg Raises 3x15 kropsvægt  
  Plank 3x45 sekunder  

- **Ingen forklaringer, ingen overskrifter, ingen ekstra mellemrum eller symboler**.  
- Hvis vægt ikke er relevant, skriv "kropsvægt".  
- **Brug præcis 5-7 øvelser pr. program**.  
- Afslut med en tom linje for nem kopiering.`;  

        setGeneratedPrompt(textToCopy); // Sætter teksten i en kopierbar boks
    }
};

  
  // Funktion til at kopiere prompten
  const copyPromptToClipboard = () => {
      if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(generatedPrompt)
              .then(() => alert("✅ Prompt kopieret! Indsæt den i ChatGPT."))
              .catch(() => fallbackCopyTextToClipboard(generatedPrompt));
      } else {
          fallbackCopyTextToClipboard(generatedPrompt);
      }
  };
  


// 📌 Fallback-metode til ældre browsere og iOS-enheder
const fallbackCopyTextToClipboard = (text) => {
  // Kopiér tekst manuelt ved at indsætte i textarea
  setInput(`❗ Kunne ikke kopiere automatisk. Kopiér denne tekst manuelt og indsæt i ChatGPT:\n\n${text}`);
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
    <option value="Push">🔥 Push (Bryst, Skulder, Triceps)</option>
    <option value="Pull">💪 Pull (Ryg, Biceps)</option>
    <option value="Legs">🦵 Legs (Ben-træning)</option>
    <option value="Hypertrofi">🏋️ Hypertrofi (Muskelopbygning)</option>
    <option value="Styrketræning">⚡ Styrketræning (Powerlifting)</option>
  </select>
</div>

{generatedPrompt && (
  <div className="w-full max-w-lg mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
    <label className="block text-white font-semibold mb-2">
      📋 Kopier denne prompt og brug den i ChatGPT:
    </label>
    <textarea
      className="w-full bg-gray-700 text-white p-2 rounded-md"
      rows="6"
      value={generatedPrompt}
      readOnly
    />
    <button
      onClick={copyPromptToClipboard}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      📋 Kopier Prompt
    </button>
  </div>
)}

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
{/* TABELLEN - VISER AKTIVE SÆT */}
{workout.length > 0 && (
  <div className="w-full max-w-3xl mt-6 overflow-x-auto">
    <h2 className="text-xl font-bold text-blue-300 mb-2">Aktiv Træning</h2>
    <table className="w-full bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
      <thead className="bg-blue-600 text-white">
        <tr className="text-sm md:text-base">
          <th className="py-3 px-4 text-left">Øvelse</th>
          <th className="py-3 px-4 text-center">Sæt</th>
          <th className="py-3 px-4 text-center">Reps</th>
          <th className="py-3 px-4 text-center">Vægt</th>
          <th className="py-3 px-4 text-center">Volume</th>
          <th className="py-3 px-4 text-center">📹 Instruks</th>
          <th className="py-3 px-4 text-center">✔️</th>
        </tr>
      </thead>
      <tbody>
        {workout.map((item) => (
          <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
            <td className="py-3 px-4">{item.exercise}</td>
            <td className="py-3 px-4 text-center">{item.set}</td>
            <td className="py-3 px-4 text-center">
              <input
                type="number"
                value={item.reps}
                onChange={(e) => handleRepsChange(item.id, e.target.value)}
                className="w-14 md:w-16 text-center bg-gray-700 border border-gray-600 rounded-md text-white px-2 py-1"
              />
            </td>
            <td className="py-3 px-4 text-center">
              <input
                type="number"
                value={item.weight}
                onChange={(e) => handleWeightChange(item.id, e.target.value)}
                className="w-16 md:w-20 text-center bg-gray-700 border border-gray-600 rounded-md text-white px-2 py-1"
              />
              <span className="text-gray-400 ml-1">kg</span>
            </td>
            <td className="py-3 px-4 text-center">{item.volume} kg</td>
            <td className="py-3 px-4 text-center">
              <a
                href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(item.exercise)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-400 hover:text-red-500 transition"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.6,3.1H4.4C3.1,3.1,2,4.2,2,5.5v13c0,1.3,1.1,2.4,2.4,2.4h15.1c1.3,0,2.4-1.1,2.4-2.4v-13C22,4.2,20.9,3.1,19.6,3.1z M15.4,12.5l-5.9,3.3c-0.3,0.2-0.7,0-0.7-0.4V9.5c0-0.4,0.4-0.6,0.7-0.4l5.9,3.3C15.7,12.2,15.7,12.4,15.4,12.5z"/>
                </svg>
                <span className="hidden md:inline">YouTube</span>
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
