import {
  FileTextIcon,
  HomeIcon,
  PlusIcon,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* Bottom Navigation - Sticky */}
      <div className="bottom-nav">
        <div className="px-0 pb-0">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-none px-6 py-4 shadow-2xl relative">
            {/* Central FAB */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Link
                to="/create-leave-app"
                className="w-12 h-12 bg-white border-2 border-orange-400 rounded-full shadow-lg flex items-center justify-center floating-action cursor-pointer"
              >
                <PlusIcon className="w-6 h-6 text-orange-500" />
              </Link>
            </div>
            {/* Navigation Items */}
            <div className="flex justify-between items-center">
              <Link
                to="/home"
                className="nav-item flex flex-col items-center py-2 px-4 cursor-pointer"
              >
                <HomeIcon className="w-6 h-6 text-white" />
              </Link>
              <Link
                to="/history"
                className="nav-item flex flex-col items-center py-2 px-4 cursor-pointer"
              >
                <FileTextIcon className="w-6 h-6 text-white/70" />
              </Link>
              {/* Space for central FAB */}
              <div className="w-12" />
              <Link
                to="/holiday"
                className="nav-item flex flex-col items-center py-2 px-4 cursor-pointer"
              >
                <TrendingUp className="w-6 h-6 text-white/70" />
              </Link>
              <Link
                to="/profile"
                className="nav-item flex flex-col items-center py-2 px-4 cursor-pointer"
              >
                <UserIcon className="w-6 h-6 text-white/70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
