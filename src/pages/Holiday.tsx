import { Calendar, Clock, Flag, Gift, Heart, Moon, Sparkles, Star, Sun, Wrench } from "lucide-react";
import Navbar from "../component/navbar";

export default function Holiday() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container">
      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-hide">
        {/* Header */}
        <div className="gradient-bg px-6 py-8 relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium">
                Holiday Calendar
              </p>
              <h1 className="text-white text-2xl font-bold mt-1">
                2025 Holidays
              </h1>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-16 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-6 left-20 w-12 h-12 bg-white/5 rounded-full blur-lg" />
        </div>
        {/* Current Month Banner */}
        <div className="px-6 -mt-6 relative z-10 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-xs font-semibold uppercase tracking-wide">
                  Current Month
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  July 2025
                </p>
                <p className="text-sm text-gray-500">3 holidays remaining</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Filter Tabs */}
        <div className="px-6 mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg text-sm font-medium shadow-sm">
              <Calendar className="w-4 h-4 inline mr-2" />
              All
            </button>
            <button className="flex-1 py-2 px-4 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors">
              <Flag className="w-4 h-4 inline mr-2" />
              National
            </button>
            <button className="flex-1 py-2 px-4 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors">
              <Heart className="w-4 h-4 inline mr-2" />
              Religious
            </button>
          </div>
        </div>
        {/* Holiday List */}
        <div className="px-6">
          <div className="h-96 overflow-y-auto space-y-4 pb-28 scrollbar-hide">
            {/* Coming Soon Holiday */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-red-500 pulse-animation">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Flag className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Independence Day</p>
                    <p className="text-xs text-gray-500">National Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">Aug 17</p>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    In 27 days
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Saturday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* Today's Holiday */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Sun className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Summer Holiday</p>
                    <p className="text-xs text-gray-500">Seasonal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">Jul 21</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Today
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Monday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* Past Holiday */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-gray-400 opacity-75">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Eid al-Adha</p>
                    <p className="text-xs text-gray-500">Religious Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-600">Jun 28</p>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Passed
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Saturday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* Upcoming Holiday */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Moon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Islamic New Year</p>
                    <p className="text-xs text-gray-500">Religious Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">Aug 30</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    In 40 days
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Friday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* Christmas */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Gift className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Christmas Day</p>
                    <p className="text-xs text-gray-500">Religious Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">Dec 25</p>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    In 157 days
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Thursday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* New Year */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">New Year's Day</p>
                    <p className="text-xs text-gray-500">National Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">Jan 1</p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    2026
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Wednesday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
            {/* Labor Day */}
            <div className="holiday-card rounded-2xl p-4 shadow-lg card-hover border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Wrench className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Labor Day</p>
                    <p className="text-xs text-gray-500">National Holiday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-600">May 1</p>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Passed
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Thursday</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation - Same as Leave Management */}
      <Navbar />
    </div>
  );
}
