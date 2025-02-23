import { useState } from "react";
import { motion } from "motion/react";

export default function WorkoutPage({
  workout,
  setWorkout,
  completedSets,
  input,
  setInput,
  processWorkout,
  completeSet,
  removeSet
}) {
  const [confirmingSet, setConfirmingSet] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [editingSet, setEditingSet] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (setId, field, value) => {
    setWorkout((prevWorkout) =>
      prevWorkout.map((set) =>
        set.id === setId ? { ...set, [field]: parseInt(value) || 0 } : set
      )
    );
    setEditingSet(null); // Luk inputfeltet
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h2 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Træning</h2>

      {/* INPUT */}
      <textarea
        className="w-full max-w-lg p-4 border-2 border-gray-700 bg-gray-800 text-white rounded-lg shadow-lg"
        rows="4"
        placeholder="Indsæt din træning her..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button 
        onClick={processWorkout} 
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        📋 Formatér Træning
      </button>

      {/* AKTIV TRÆNING */}
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
                {/* YouTube-link med SVG-ikon */}
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
                  drag="x"
                  dragConstraints={{ left: -100, right: 100 }}
                  dragElastic={0.3}
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 80) {
                      setConfirmingSet(item.id);
                      setConfirmingDelete(null);
                    } else if (info.offset.x < -80) {
                      setConfirmingDelete(item.id);
                      setConfirmingSet(null);
                    }
                  }}
                >
                  <span className="text-center w-12">{item.set}</span>
                  
                  {/* REPS (Redigerbar) */}
                  {editingSet === `${item.id}-reps` ? (
                    <input
                      type="number"
                      className="w-16 bg-gray-700 text-white text-center rounded-md border border-gray-500"
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
                      className="w-16 bg-gray-700 text-white text-center rounded-md border border-gray-500"
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
                    onClick={() => setConfirmingSet(null)}
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
                    onClick={() => setConfirmingDelete(null)}
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
 {completedSets.length > 0 && (
        <div className="w-full max-w-3xl mt-6">
          <h2 className="text-xl font-bold text-green-300 mb-2">✅ Færdiggjorte Sæt</h2>
          <table className="w-full bg-gray-800 text-white rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-2 px-3 text-center">Sæt</th>
                <th className="py-2 px-3 text-center">Reps</th>
                <th className="py-2 px-3 text-center">Vægt</th>
                <td className="py-3 px-4 text-center">
                {isNaN(set.volume) ? "-" : `${set.volume} kg`}
                </td>
              </tr>
            </thead>
            <tbody>
              {completedSets.map((set) => (
                <tr key={set.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-center">{set.set}</td>
                  <td className="py-3 px-4 text-center">{set.reps}</td>
                  <td className="py-3 px-4 text-center">
  {typeof set.weight === "string" && set.weight.includes("kg") ? set.weight : `${set.weight} kg`}
</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-xl font-bold text-green-400 mt-4">
  🔥 Samlet Volume: {completedSets.reduce((sum, set) => sum + (isNaN(set.volume) ? 0 : set.volume), 0)} kg
</h3>

        </div>
      )}

    </div>
  );
}
