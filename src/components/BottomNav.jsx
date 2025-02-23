import { Home, User, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 shadow-lg">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <Home size={24} />
          <span className="text-sm">Hjem</span>
        </Link>

        <Link to="workout" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <Dumbbell size={24} />
          <span className="text-sm">Træning</span>
        </Link>

        <Link to="profile" className="flex flex-col items-center text-gray-400 hover:text-white transition">
          <User size={24} />
          <span className="text-sm">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
