import { useState } from "react";
import { motion } from "motion/react";
import Profile from "./components/profile";
import BottomNav from "./components/BottomNav";
import exerciseData from "./exercises.json"; // Importer vores lokale dataset

export default function App() {
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [input, setInput] = useState("");
  const [confirmingSet, setConfirmingSet] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [editingSet, setEditingSet] = useState(null); // Holder styr på hvilket felt der redigeres
  const [tempValue, setTempValue] = useState(""); // Midlertidig værdi


  const processWorkout = () => {
    if (!input.trim()) {
      alert("⚠️ Indtast din træning først!");
      return;
    }
  
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const parsedWorkout = [];
  
    lines.forEach((line, index) => {
      // Opdateret regex til at håndtere både med og uden bindestreg
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
  

  const completeSet = (setId) => {
    const setToComplete = workout.find((set) => set.id === setId);
    if (setToComplete) {
      setCompletedSets([...completedSets, setToComplete]);
      setWorkout(workout.filter((set) => set.id !== setId));
    }
  };
  const removeSet = (setId) => {
    setWorkout((prevWorkout) => prevWorkout.filter((set) => set.id !== setId));
  };
  const handleEdit = (setId, field, value) => {
    setWorkout((prevWorkout) =>
      prevWorkout.map((set) =>
        set.id === setId
          ? { ...set, [field]: parseInt(value) || 0 }
          : set
      )
    );
    setEditingSet(null); // Luk inputfeltet
  };

  const totalVolume = [...workout, ...completedSets].reduce((sum, set) => sum + (set.reps * (set.weight || 0)), 0);

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

const updateSet = (setId, field, value) => {
  setWorkout((prevWorkout) =>
    prevWorkout.map((set) =>
      set.id === setId ? { ...set, [field]: parseInt(value) || 0, volume: set.reps * set.weight } : set
    )
  );
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
      <div className="min-h-screen flex flex-col bg-gray-900 text-white p-6 pb-16"></div>
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

{/* OPTIMERET UI FOR AKTIVE SÆT */}
{workout.length > 0 && (
  <div className="w-full max-w-3xl mt-6">
    <h2 className="text-2xl font-bold text-blue-400 mb-4">🏋️ Aktiv Træning</h2>

    {Object.entries(
      workout.reduce((acc, set) => {
        acc[set.exercise] = acc[set.exercise] || [];
        acc[set.exercise].push(set);
        return acc;
      }, {})
    ).map(([exercise, sets]) => (
      <div key={exercise} className="mb-4 p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 flex justify-between items-center">
          {exercise}
          <a
            href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(exercise)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
          >
            <svg className="w-6 h-6 fill-current text-red-600 hover:text-red-700 transition" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M549.7 124.1c-6.3-23.5-24.8-42-48.3-48.3C457.6 64 288 64 288 64s-169.6 0-213.4 11.8c-23.5 6.3-42 24.8-48.3 48.3C16 167.9 16 256 16 256s0 88.1 10.3 131.9c6.3 23.5 24.8 42 48.3 48.3C118.4 448 288 448 288 448s169.6 0 213.4-11.8c23.5-6.3 42-24.8 48.3-48.3C560 344.1 560 256 560 256s0-88.1-10.3-131.9zM232 336V176l144 80-144 80z"/>
            </svg>
          </a>
        </h3>

        {/* OVERSKRIFTER TIL SÆTTENE */}
        <div className="grid grid-cols-3 text-gray-400 text-sm mt-2 pb-1 border-b border-gray-600">
          <span className="text-center">Sæt</span>
          <span className="text-center">Reps</span>
          <span className="text-center">Vægt</span>
        </div>

        {/* INDIVIDUELLE SÆT MED SWIPE */}
        {sets.map((item) => (
          <motion.div
          key={item.id}
          className="relative flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 mt-2 shadow-md"
          initial={{ x: 0 }}
          animate={{
            x: confirmingSet === item.id || confirmingDelete === item.id ? 0 : undefined,
            backgroundColor: confirmingSet === item.id 
              ? "#16a34a" 
              : confirmingDelete === item.id 
              ? "#dc2626" 
              : "#1f2937",
          }}
          exit={{ x: 0 }}
          drag="x"
          dragConstraints={{ left: -100, right: 100 }}
          dragElastic={0.3}
          onDrag={(event, info) => {
            const element = event.target.closest(".relative");
        
            if (info.offset.x > 50) {
              element.style.backgroundColor = "#16a34a";
              element.dataset.swipeText = "✅ Færdiggør";
            } else if (info.offset.x < -50) {
              element.style.backgroundColor = "#dc2626";
              element.dataset.swipeText = "❌ Slet";
            } else {
              element.style.backgroundColor = "#1f2937";
              element.dataset.swipeText = "";
            }
          }}
          onDragEnd={(event, info) => {
            if (info.offset.x > 80) {
              setConfirmingSet(item.id);
              setConfirmingDelete(null); // Sikrer, at kun én bekræftelse vises
            } else if (info.offset.x < -80) {
              setConfirmingDelete(item.id);
              setConfirmingSet(null); // Sikrer, at kun én bekræftelse vises
            } else {
              // 🔥 **RESET SWIPE, hvis brugeren ikke swiper langt nok!**
              event.target.style.transition = "transform 0.3s ease-out";
              event.target.style.transform = "translateX(0px)";
              setTimeout(() => {
                event.target.style.transition = "";
              }, 300);
            }
          }}
        >
        


     
            {/* SÆT-INFO */}
            <span className="text-center w-12">{item.set}</span>
            
            {/* REPS (Redigerbar) */}
            {editingSet === `${item.id}-reps` ? (
              <input
                type="number"
                className="w-16 bg-gray-700 text-white text-center rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-400"
                value={tempValue}
                autoFocus
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleEdit(item.id, "reps", tempValue)}
                onKeyDown={(e) => e.key === "Enter" && handleEdit(item.id, "reps", tempValue)}
              />
            ) : (
              <span 
                className="text-center cursor-pointer hover:text-blue-400 transition"
                onClick={() => {
                  setEditingSet(`${item.id}-reps`);
                  setTempValue(item.reps);
                }}
              >
                {item.reps}
              </span>
            )}

            {/* VÆGT (Redigerbar) */}
            {editingSet === `${item.id}-weight` ? (
              <input
                type="number"
                className="w-16 bg-gray-700 text-white text-center rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-400"
                value={tempValue}
                autoFocus
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleEdit(item.id, "weight", tempValue)}
                onKeyDown={(e) => e.key === "Enter" && handleEdit(item.id, "weight", tempValue)}
              />
            ) : (
              <span 
                className="text-center cursor-pointer hover:text-blue-400 transition"
                onClick={() => {
                  setEditingSet(`${item.id}-weight`);
                  setTempValue(item.weight);
                }}
              >
                {typeof item.weight === "string" && item.weight.includes("kg") ? item.weight : `${item.weight} kg`}
              </span>
            )}
          </motion.div>
        ))}

{/* BEKRÆFT FÆRDIGGØRELSE */}
{confirmingSet === sets[0]?.id && (
  <div className="bg-green-500 text-white text-center mt-2 p-2 rounded-lg">
    ✅ Vil du færdiggøre denne øvelse?
    <button
      onClick={() => {
        completeSet(sets[0].id);
        setConfirmingSet(null);
      }}
      className="ml-4 px-4 py-2 bg-white text-green-700 rounded-lg"
    >
      Bekræft
    </button>
    <button
      onClick={(e) => {
        setConfirmingSet(null);
        e.target.closest(".relative").style.backgroundColor = ""; // Nulstil farve
      }}
      className="ml-2 px-4 py-2 bg-gray-700 text-white rounded-lg"
    >
      Annuller
    </button>
  </div>
)}

{/* BEKRÆFT SLETNING */}
{confirmingDelete === sets[0]?.id && (
  <div className="bg-red-500 text-white text-center mt-2 p-2 rounded-lg">
    ❌ Vil du slette denne øvelse?
    <button
      onClick={() => {
        removeSet(sets[0].id);
        setConfirmingDelete(null);
      }}
      className="ml-4 px-4 py-2 bg-white text-red-700 rounded-lg"
    >
      Bekræft
    </button>
    <button
      onClick={(e) => {
        setConfirmingDelete(null);
        e.target.closest(".relative").style.backgroundColor = ""; // Nulstil farve
      }}
      className="ml-2 px-4 py-2 bg-gray-700 text-white rounded-lg"
    >
      Annuller
    </button>
  </div>
)}

      </div>
    ))}
  </div>
)}



 
{/* TABELLEN - FÆRDIGGJORTE SÆT */}
{completedSets.length > 0 && (
  <div className="w-full max-w-3xl mt-6 overflow-x-auto">
    <h2 className="text-xl font-bold text-green-300 mb-2">✅ Færdiggjorte Sæt</h2>
    
    {/* Gruppering af færdiggjorte sæt */}
    {Object.entries(
      completedSets.reduce((acc, set) => {
        acc[set.exercise] = acc[set.exercise] || [];
        acc[set.exercise].push(set);
        return acc;
      }, {})
    ).map(([exercise, sets]) => (
      <div key={exercise} className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-green-400">{exercise}</h3>

        <table className="w-full mt-2 bg-gray-900 text-white rounded-lg shadow-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-3 text-center">Sæt</th>
              <th className="py-2 px-3 text-center">Reps</th>
              <th className="py-2 px-3 text-center">Vægt</th>
              <th className="py-2 px-3 text-center">Volume</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                <td className="py-3 px-4 text-center">{item.set}</td>
                <td className="py-3 px-4 text-center">{item.reps}</td>
                <td className="py-3 px-4 text-center">
                  {typeof item.weight === "string" ? item.weight : `${item.weight} kg`}
                </td>
                <td className="py-3 px-4 text-center">
                  {isNaN(item.volume) ? "-" : `${item.volume} kg`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}

    {/* Total volume beregning */}
    <h3 className="text-xl font-bold text-green-400 mt-4">
      🔥 Samlet Volume: {completedSets.reduce((sum, set) => sum + (isNaN(set.volume) ? 0 : set.volume), 0)} kg
    </h3>
  </div>
)}
<BottomNav />
    </div>
    
  );
}
