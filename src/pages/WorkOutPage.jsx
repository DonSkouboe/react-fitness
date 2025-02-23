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
                <a
                  href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(exercise)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                >
                  🎥
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
                      completeSet(item.id);
                    } else if (info.offset.x < -80) {
                      removeSet(item.id);
                    }
                  }}
                >
                  <span className="text-center w-12">{item.set}</span>
                  <span className="text-center">{item.reps}</span>
                  <span className="text-center">{item.weight}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* FÆRDIGGJORTE SÆT */}
      {completedSets.length > 0 && (
        <div className="w-full max-w-3xl mt-6">
          <h2 className="text-xl font-bold text-green-300 mb-2">✅ Færdiggjorte Sæt</h2>
          
          {completedSets.map((set) => (
            <p key={set.id} className="text-green-400">
              {set.exercise} - {set.reps} reps @ {set.weight}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
