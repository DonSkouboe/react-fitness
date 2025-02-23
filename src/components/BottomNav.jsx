import { Home, User, Dumbbell } from "lucide-react"; // Ikoner
import { NavLink } from "react-router-dom"; // Hvis du bruger routing

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 shadow-lg">
      <div className="flex justify-around items-center">
        {/* Hjem-knap */}
        <NavLink to="/" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <Home size={24} />
          <span className="text-sm">Hjem</span>
        </NavLink>

        {/* Træning-knap */}
        <NavLink to="/workout" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <Dumbbell size={24} />
          <span className="text-sm">Træning</span>
        </NavLink>

        {/* Profil-knap */}
        <NavLink to="/profile" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <User size={24} />
          <span className="text-sm">Profil</span>
        </NavLink>
      </div>
    </nav>
  );
}
