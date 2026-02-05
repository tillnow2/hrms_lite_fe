import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeesAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return {
      ...response,
      data: response.data.map(emp => ({
        id: emp.employee_id,
        employeeId: emp.employee_id,
        fullName: emp.full_name,
        email: emp.email,
        department: emp.department,
      }))
    };
  },
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return {
      ...response,
      data: {
        id: response.data.employee_id,
        employeeId: response.data.employee_id,
        fullName: response.data.full_name,
        email: response.data.email,
        department: response.data.department,
      }
    };
  },
  create: (data) => api.post('/employees', {
    employee_id: data.employeeId,
    full_name: data.fullName,
    email: data.email,
    department: data.department,
  }),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  getAll: async () => {
    const response = await api.get('/attendance');
    return {
      ...response,
      data: response.data.map(record => ({
        id: record._id,
        employeeId: record.employee_id,
        employeeName: record.employee_name,
        date: record.date,
        status: record.status,
        remarks: record.remarks,
      }))
    };
  },
  getByEmployeeId: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  create: (data) => api.post('/attendance', {
    employee_id: data.employeeId,
    date: data.date,
    status: data.status,
  }),
  getStats: () => api.get('/attendance/stats'),
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return {
      ...response,
      data: {
        totalEmployees: response.data.data.summary?.total_employees || 0,
        presentToday: response.data.data.summary?.today_present || 0,
        totalAttendance: response.data.data.summary?.total_attendance_records || 0,
        attendanceRate: response.data.data.summary?.today_attendance_percentage?.toFixed(2) || 0,
        departmentBreakdown: response.data.data.departments || [],
        recentAttendance: response.data.data.recent_attendance?.map(record => ({
          employeeId: record.employee_id,
          employeeName: record.employee_name,
          date: record.date,
          status: record.status,
        })) || [],
      }
    };
  },
};

export default api;
