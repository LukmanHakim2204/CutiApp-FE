import { ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "../component/navbar";

export default function CreateLeaveApp() {
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
    alert("Pengajuan cuti berhasil dibuat!");
  };

  const calculateLeaveDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-hide overflow-y-auto h-screen pb-32">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-white sticky top-0 z-10">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <ArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Saldo Cuti Karyawan
          </h1>
          <div className="w-10" />
        </div>
        {/* Leave Balance Information */}
        <div className="px-6 pb-32">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Saldo Cuti Saat Ini
            </h3>
            <p className="text-gray-600 text-sm">
              Informasi saldo cuti untuk periode aktif
            </p>
          </div>

          {/* Leave Balance Table */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 p-4 text-xs font-medium text-gray-300 border-b border-gray-700">
              <div>Jenis Cuti</div>
              <div>Alokasi</div>
              <div>Terpakai</div>
              <div>Sisa</div>
              <div>Status</div>
            </div>

            {/* Table Row */}
            <div className="grid grid-cols-5 gap-2 p-4 text-xs text-gray-300 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Cuti Tahunan</span>
              </div>
              <div>12 hari</div>
              <div>1 hari</div>
              <div>11 hari</div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Tersedia
                </span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">12</div>
              <div className="text-xs text-gray-400">Total Alokasi</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">1</div>
              <div className="text-xs text-gray-400">Total Terpakai</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">11</div>
              <div className="text-xs text-gray-400">Total Sisa</div>
            </div>
          </div>
        </div>

        {/* Create Leave Form */}
        <div className="px-6 mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Plus className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Buat Pengajuan Cuti Baru
              </h2>
            </div>

            <div className="space-y-4">
              {/* Employee Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nama Employee
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama employee"
                  value={formData.employeeName}
                  onChange={(e) =>
                    handleInputChange("employeeName", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors text-gray-700 placeholder-gray-400 bg-white"
                />
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tipe Cuti
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) =>
                      handleInputChange("leaveType", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors text-gray-700 bg-white appearance-none"
                  >
                    <option value="">Pilih tipe cuti</option>
                    <option value="annual">Cuti Tahunan</option>
                    <option value="medical">Cuti Sakit</option>
                    <option value="personal">Cuti Pribadi</option>
                    <option value="emergency">Cuti Darurat</option>
                    <option value="vacation">Cuti Liburan</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) =>
                      handleInputChange("fromDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors text-gray-700 bg-white"
                    style={{ colorScheme: "light" }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) =>
                      handleInputChange("toDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors text-gray-700 bg-white"
                    style={{ colorScheme: "light" }}
                  />
                </div>
              </div>

              {/* Auto-calculated Leave Days */}
              {calculateLeaveDays() > 0 && (
                <div className="bg-orange-100 border border-orange-300 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      Jumlah Hari Cuti:
                    </span>
                    <span className="text-orange-600 font-bold text-lg">
                      {calculateLeaveDays()} hari
                    </span>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Alasan Cuti
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan alasan pengajuan cuti..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors text-gray-700 placeholder-gray-400 resize-none bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-6"
              >
                Buat Pengajuan Cuti
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
