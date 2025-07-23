import { ArrowLeft } from "lucide-react";
import Navbar from "../component/navbar";
import { Link } from "react-router-dom";

export default function History() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <Link
            to="/home"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">
            History Leave Application
          </h1>
          <div className="w-10" />
        </div>
        {/* Leave Applications List - AREA SCROLL ITEMS */}
        <div className="px-6 space-y-4 pb-32">
          {/* Application 1 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
          {/* Application 2 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
          {/* Application 3 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
          {/* Application 4 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
          {/* Application 5 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
          {/* Application 6 */}
          <div className="leave-card bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Date
                </div>
                <h3 className="font-bold text-gray-800">
                  18 July 2025 - 19 July 2025
                </h3>
              </div>
              <span className="status-rejected px-3 py-1.5 rounded-full text-xs font-bold">
                Rejected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-800">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Approved By</div>
                <div className="text-xs font-medium text-gray-700">
                  Aulia Nurussyifa El Abidah
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation - NAVBAR TETAP ADA */}
      <Navbar />
    </div>
  );
}
