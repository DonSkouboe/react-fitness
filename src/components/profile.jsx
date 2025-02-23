import { useState } from "react";

export default function Profile() {
  const [username, setUsername] = useState("Bruger");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(180);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">👤 Brugerprofil</h2>

      <label className="block mb-2">Navn:</label>
      <input
        type="text"
        className="w-full p-2 bg-gray-700 text-white rounded-md"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="block mt-4 mb-2">Alder:</label>
      <input
        type="number"
        className="w-full p-2 bg-gray-700 text-white rounded-md"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <label className="block mt-4 mb-2">Vægt (kg):</label>
      <input
        type="number"
        className="w-full p-2 bg-gray-700 text-white rounded-md"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <label className="block mt-4 mb-2">Højde (cm):</label>
      <input
        type="number"
        className="w-full p-2 bg-gray-700 text-white rounded-md"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
    </div>
  );
}
