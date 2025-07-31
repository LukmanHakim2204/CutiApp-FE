export interface StatusColor {
  bg: string;
  text: string;
}

export interface ColorClasses {
  text: string;
  bg: string;
  border: string;
}

export interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  loading?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Array<{ name: string }>;
  employee?: EmployeeDetail;
}

export interface EmployeeDetail {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  name: string;
  gender: string;
  national_id: string;
  employee_phone: string;
  email: string;
  profile_picture?: string;
  permanent_address?: string;
  marital_status?: string;
  division?: Division;
  position?: Position;
  leaveApprover?: LeaveApprover;
}

export interface Division {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface FormData {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  employee_id: number | null;
  division_id: number | null;
  leave_approver_id: number | null;
}

export interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
  color: string;
  name: string;
  leave_type_id?: number; // optional for general use
  leave_type?: string; // optional for different structure
  allocated_days?: number;
  used_days?: number;
  remaining_days?: number;
}

export interface DisplayData {
  employee_name: string;
  division_name: string;
  leave_approver_name: string;
}

export interface LeaveType {
  id: number;
  name: string;
}

export interface LeaveApprover {
  id: number;
  name: string;
  email?: string;
}

export interface LeaveApplication {
  id: number;
  start_date: string;
  end_date: string;
  total_leave_days: number;
  leave_balance: number;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  leave_type: LeaveType;
  employee?: { name: string };
  division?: { name: string };
  leave_approver?: LeaveApprover;
  created_at?: string;
  updated_at?: string;
}

export interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface DashboardData {
  statistics: Statistics;
  recent_applications: LeaveApplication[];
  leave_balances: LeaveBalance[];
  upcoming_leave: LeaveApplication[];
}

export interface CreateLeaveApplicationRequest {
  start_date: string;
  end_date: string;
  leave_type_id: number;
  reason?: string;
}

export interface UpdateLeaveApplicationRequest {
  start_date?: string;
  end_date?: string;
  leave_type_id?: number;
  reason?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface Holiday {
  id: string;
  description: string;
  date: string;
  type: "religious" | "national" | "seasonal";
}

export interface HolidayGroup {
  holiday_name: string;
  start_date: string;
  end_date: string;
  description: string;
  holidays: Holiday[];
}

export interface ExtendedHoliday extends Holiday {
  groupName: string;
  groupStartDate: string;
  groupEndDate: string;
  groupDescription: string;
}
