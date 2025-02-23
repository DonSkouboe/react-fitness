import { useState } from "react";
import { motion } from "framer-motion";

export default function WorkOutPage() {
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [editingSet, setEditingSet] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [confirmingSet, setConfirmingSet] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  // Funktion til at markere et sæt som færdigt
  const completeSet = (setId) => {
    const setToComplete = workout.find((set) => set.id === setId);
    if (setToComplete) {
      setCompletedSets([...completedSets, setToComplete]);
      setWorkout(workout.filter((set) => set.id !== setId));
    }
  };

  // Funktion til at fjerne et sæt
  const removeSet = (setId) => {
    setWorkout((prevWorkout) => prevWorkout.filter((set) => set.id !== setId));
  };

  // Funktion til at redigere et sæt (reps eller vægt)
  const handleEdit = (setId, field, value) => {
    setWorkout((prevWorkout) =>
      prevWorkout.map((set) =>
        set.id === setId ? { ...set, [field]: parseInt(value) || 0 } : set
      )
    );
    setEditingSet(null); // Luk inputfeltet
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Træning</h1>

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
                {/* YouTube-link med større ikon */}
                <a
                  href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(exercise)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                >
                  <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M549.7 124.1c-6.3-23.5-24.8-42-48.3-48.3C457.6 64 288 64 288 64s-169.6 0-213.4 11.8c-23.5 6.3-42 24.8-48.3 48.3C16 167.9 16 256 16 256s0 88.1 10.3 131.9c6.3 23.5 24.8 42 48.3 48.3C118.4 448 288 448 288 448s169.6 0 213.4-11.8c23.5-6.3 42-24.8 48.3-48.3C560 344.1 560 256 560 256s0-88.1-10.3-131.9zM232 336V176l144 80-144 80z"/>
                  </svg>
                </a>
              </h3>

              {sets.map((item) => (
                <motion.div
                  key={item.id}
                  className="relative flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 mt-2 shadow-md"
                  initial={{ x: 0 }}
                  drag="x"
                  dragConstraints={{ left: -100, right: 100 }}
                  dragElastic={0.3}
                  onDrag={(event, info) => {
                    if (info.offset.x > 50) {
                      setConfirmingSet(item.id);
                      setConfirmingDelete(null);
                    } else if (info.offset.x < -50) {
                      setConfirmingDelete(item.id);
                      setConfirmingSet(null);
                    }
                  }}
                >
                  <span className="text-center w-12">{item.set}</span>

                  {/* Reps (Redigerbar) */}
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

                  {/* Vægt (Redigerbar) */}
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
                      {item.weight} kg
                    </span>
                  )}
                </motion.div>
              ))}

              {/* Bekræft Færdiggørelse */}
              {confirmingSet && (
                <button onClick={() => completeSet(confirmingSet)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                  ✅ Bekræft Færdiggørelse
                </button>
              )}

              {/* Bekræft Sletning */}
              {confirmingDelete && (
                <button onClick={() => removeSet(confirmingDelete)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                  ❌ Bekræft Sletning
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
