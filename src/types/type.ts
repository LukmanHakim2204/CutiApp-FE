
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
  email?: string;
  employee?: {
    id: number;
    name: string;
    email: string;
    employee_phone: string;
    permanent_address?: string;
  };
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
  leave_approver?: LeaveApprover;
  created_at?: string;
  updated_at?: string;
}

export interface LeaveBalance {
  leave_type: string;
  allocated_days: number;
  used_days: number;
  remaining_days: number;
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

// Interface untuk create leave application
export interface CreateLeaveApplicationRequest {
  start_date: string;
  end_date: string;
  leave_type_id: number;
  reason?: string;
}

// Interface untuk update leave application
export interface UpdateLeaveApplicationRequest {
  start_date?: string;
  end_date?: string;
  leave_type_id?: number;
  reason?: string;
  status?: "pending" | "approved" | "rejected";
}

// Interface untuk API Error Response
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

