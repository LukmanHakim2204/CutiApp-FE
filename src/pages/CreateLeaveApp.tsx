import {
  ArrowLeft,
  Plus,
  ChevronDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import Navbar from "../component/Navbar";

export default function CreateLeaveApp() {
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Data saldo cuti berdasarkan tipe
  const leaveBalances = {
    annual: { total: 12, used: 1, remaining: 11, color: "orange" },
    medical: { total: 30, used: 2, remaining: 28, color: "red" },
    personal: { total: 6, used: 0, remaining: 6, color: "blue" },
    emergency: { total: 3, used: 0, remaining: 3, color: "purple" },
    vacation: { total: 7, used: 1, remaining: 6, color: "green" },
  };

  // Informasi khusus untuk setiap tipe cuti
  const leaveTypeInfo = {
    annual: {
      name: "Cuti Tahunan",
      description: "Cuti tahunan yang dialokasikan setiap tahun",
      requirements: "Dapat diambil kapan saja dengan persetujuan atasan",
      maxDays: 12,
      minAdvanceNotice: 3,
    },
    medical: {
      name: "Cuti Sakit",
      description: "Cuti untuk keperluan kesehatan",
      requirements: "Wajib melampirkan surat dokter untuk cuti >3 hari",
      maxDays: 30,
      minAdvanceNotice: 0,
    },
    personal: {
      name: "Cuti Pribadi",
      description: "Cuti untuk keperluan pribadi mendesak",
      requirements: "Perlu persetujuan khusus dari HR",
      maxDays: 6,
      minAdvanceNotice: 1,
    },
    emergency: {
      name: "Cuti Darurat",
      description: "Cuti untuk situasi darurat keluarga",
      requirements: "Bukti situasi darurat diperlukan",
      maxDays: 3,
      minAdvanceNotice: 0,
    },
    vacation: {
      name: "Cuti Liburan",
      description: "Cuti khusus untuk liburan panjang",
      requirements: "Harus diajukan minimal 2 minggu sebelumnya",
      maxDays: 7,
      minAdvanceNotice: 14,
    },
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  // Validasi form berdasarkan tipe cuti
  const validateForm = () => {
    const errors = [];
    const leaveDays = calculateLeaveDays();
    const selectedLeaveType = leaveTypeInfo[formData.leaveType];
    const balance = leaveBalances[formData.leaveType];

    if (!formData.employeeName) errors.push("Nama employee harus diisi");
    if (!formData.leaveType) errors.push("Tipe cuti harus dipilih");
    if (!formData.fromDate) errors.push("Tanggal mulai harus diisi");
    if (!formData.toDate) errors.push("Tanggal selesai harus diisi");
    if (!formData.reason) errors.push("Alasan cuti harus diisi");

    if (formData.leaveType && leaveDays > 0) {
      if (leaveDays > balance.remaining) {
        errors.push(`Saldo cuti ${selectedLeaveType.name} tidak mencukupi`);
      }
      if (leaveDays > selectedLeaveType.maxDays) {
        errors.push(
          `Maksimal ${selectedLeaveType.maxDays} hari untuk ${selectedLeaveType.name}`
        );
      }
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      alert("Error:\n" + errors.join("\n"));
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
    alert("Pengajuan cuti berhasil dibuat!");
  };

  const getCurrentBalance = () => {
    return formData.leaveType
      ? leaveBalances[formData.leaveType]
      : leaveBalances.annual;
  };

  const getCurrentLeaveInfo = () => {
    return formData.leaveType ? leaveTypeInfo[formData.leaveType] : null;
  };

  const getColorClasses = (color) => {
    const colors = {
      orange: "bg-orange-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
    };
    return colors[color] || colors.orange;
  };

  const currentBalance = getCurrentBalance();
  const currentLeaveInfo = getCurrentLeaveInfo();
  const leaveDays = calculateLeaveDays();
  const validationErrors = validateForm();

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
        <div className="px-6 pb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {currentLeaveInfo ? currentLeaveInfo.name : "Saldo Cuti Saat Ini"}
            </h3>
            <p className="text-gray-600 text-sm">
              {currentLeaveInfo
                ? currentLeaveInfo.description
                : "Informasi saldo cuti untuk periode aktif"}
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
                <div
                  className={`w-2 h-2 ${getColorClasses(
                    currentBalance.color
                  )} rounded-full`}
                ></div>
                <span>
                  {currentLeaveInfo ? currentLeaveInfo.name : "Cuti Tahunan"}
                </span>
              </div>
              <div>{currentBalance.total} hari</div>
              <div>{currentBalance.used} hari</div>
              <div>{currentBalance.remaining} hari</div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs">
                  <div
                    className={`w-2 h-2 ${
                      currentBalance.remaining > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    } rounded-full`}
                  ></div>
                  {currentBalance.remaining > 0 ? "Tersedia" : "Habis"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">
                {currentBalance.total}
              </div>
              <div className="text-xs text-gray-400">Total Alokasi</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">
                {currentBalance.used}
              </div>
              <div className="text-xs text-gray-400">Total Terpakai</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-xl font-bold text-white">
                {currentBalance.remaining}
              </div>
              <div className="text-xs text-gray-400">Total Sisa</div>
            </div>
          </div>

          {/* Leave Type Requirements */}
          {currentLeaveInfo && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Ketentuan Cuti
              </h4>
              <p className="text-sm text-blue-800">
                {currentLeaveInfo.requirements}
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <span>• Maksimal: {currentLeaveInfo.maxDays} hari</span>
                {currentLeaveInfo.minAdvanceNotice > 0 && (
                  <span className="ml-4">
                    • Pemberitahuan: {currentLeaveInfo.minAdvanceNotice} hari
                    sebelumnya
                  </span>
                )}
              </div>
            </div>
          )}
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
              {leaveDays > 0 && (
                <div
                  className={`border rounded-xl p-4 ${
                    leaveDays > currentBalance.remaining
                      ? "bg-red-100 border-red-300"
                      : "bg-orange-100 border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      {leaveDays > currentBalance.remaining ? (
                        <AlertCircle size={16} className="text-red-500" />
                      ) : (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      Jumlah Hari Cuti:
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        leaveDays > currentBalance.remaining
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {leaveDays} hari
                    </span>
                  </div>
                  {leaveDays > currentBalance.remaining && (
                    <p className="text-sm text-red-600 mt-2">
                      Saldo cuti tidak mencukupi! Sisa:{" "}
                      {currentBalance.remaining} hari
                    </p>
                  )}
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

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Perhatian
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={validationErrors.length > 0}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-6 ${
                  validationErrors.length > 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
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
