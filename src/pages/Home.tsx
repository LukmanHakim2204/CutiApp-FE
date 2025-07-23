import {
  BellIcon,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Heart,
  UserCheck,
  UserIcon,
  UserX,
  XCircle,
} from "lucide-react";
import Navbar from "../component/navbar";

export default function Home() {
  return (
    <>
      <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container">
        {/* Scrollable Content Area */}
        <div className="content-area scrollbar-hide">
          {/* Header */}
          <div className="gradient-bg px-8 mb-3 py-8 relative">
            <div className="flex justify-between px-4 items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  Welcome back
                </p>
                <h1 className="text-white text-2xl font-bold mt-1">
                  Lukman Hakim
                </h1>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <BellIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-16 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-6 left-20 w-12 h-12 bg-white/5 rounded-full blur-lg" />
          </div>
          {/* Stats Cards */}
          <div className="px-6 -mt-8 relative z-10">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Total Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg card-hover border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">20</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              {/* Pending Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg card-hover border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">5</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
              {/* Approved Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg card-hover border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              {/* Rejected Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg card-hover border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-xs font-semibold uppercase tracking-wide">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg text-sm font-medium shadow-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                Pending
              </button>
              <button className="flex-1 py-2 px-4 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Approved
              </button>
              <button className="flex-1 py-2 px-4 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors">
                <XCircle className="w-4 h-4 inline mr-2" />
                Rejected
              </button>
            </div>
            {/* Leave Applications List */}
            <div className="h-96 overflow-y-auto space-y-4 mb-3 scrollbar-hide">
              {/* Leave Application Item 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <CalendarDays className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Annual Leave
                      </p>
                      <p className="text-xs text-gray-500">18-19 July 2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full status-badge">
                    Pending
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">2</p>
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">8</p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Manager</p>
                  </div>
                </div>
              </div>
              {/* Leave Application Item 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Sick Leave</p>
                      <p className="text-xs text-gray-500">15-16 July 2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full status-badge">
                    Approved
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">2</p>
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">6</p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">HR Team</p>
                  </div>
                </div>
              </div>
              {/* Leave Application Item 3 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <UserX className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Personal Leave
                      </p>
                      <p className="text-xs text-gray-500">10-12 July 2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full status-badge">
                    Rejected
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">3</p>
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">8</p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                      <UserX className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Manager</p>
                  </div>
                </div>
              </div>
              {/* Additional items for testing scroll */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Emergency Leave
                      </p>
                      <p className="text-xs text-gray-500">05-06 July 2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full status-badge">
                    Approved
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">2</p>
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">4</p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">HR Team</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Maternity Leave
                      </p>
                      <p className="text-xs text-gray-500">01-30 June 2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full status-badge">
                    Approved
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">30</p>
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">90</p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">HR Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Navigation - Sticky */}
        <Navbar />
      </div>
    </>
  );
}
