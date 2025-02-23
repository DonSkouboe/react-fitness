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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">💪 Træning</h2>
  
        {/* INPUT */}
        <textarea
          className="w-full p-4 border-2 bg-gray-800 text-white rounded-lg"
          rows="4"
          placeholder="Indsæt din træning her..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
  
        <button 
          onClick={processWorkout} 
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          📋 Formatér Træning
        </button>
  
        {/* AKTIV TRÆNING */}
        {workout.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold">🏋️ Aktiv Træning</h3>
            {workout.map((set) => (
              <div key={set.id} className="p-3 bg-gray-800 rounded-md mt-2 flex justify-between">
                <span>{set.exercise} - {set.reps} reps @ {set.weight}</span>
                <button 
                  onClick={() => completeSet(set.id)} 
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  ✅
                </button>
                <button 
                  onClick={() => removeSet(set.id)} 
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
  
        {/* FÆRDIGGJORTE SÆT */}
        {completedSets.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-green-300">✅ Færdiggjorte Sæt</h3>
            {completedSets.map((set) => (
              <p key={set.id} className="text-green-400">{set.exercise} - {set.reps} reps @ {set.weight}</p>
            ))}
          </div>
        )}
      </div>
    );
  }
  