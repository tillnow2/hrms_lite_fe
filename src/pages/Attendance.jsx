import React, { useState, useEffect } from 'react'
import { Plus, Calendar as CalendarIcon, Filter } from 'lucide-react'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'
import { attendanceAPI, employeesAPI } from '../api/api'
import { format } from 'date-fns'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('')
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filterDate, filterEmployee, attendance])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeesAPI.getAll(),
      ])
      setAttendance(attendanceRes.data)
      setEmployees(employeesRes.data)
      setFilteredAttendance(attendanceRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...attendance]

    if (filterDate) {
      filtered = filtered.filter((record) => 
        format(new Date(record.date), 'yyyy-MM-dd') === filterDate
      )
    }

    if (filterEmployee) {
      filtered = filtered.filter((record) => {
        return record.employeeId === filterEmployee
      })
    }

    setFilteredAttendance(filtered)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.employeeId) {
      errors.employeeId = 'Please select an employee'
    }
    
    if (!formData.date) {
      errors.date = 'Date is required'
    }
    
    if (!formData.status) {
      errors.status = 'Status is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleMarkAttendance = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setError(null)
      await attendanceAPI.create(formData)
      setSuccess('Attendance marked successfully!')
      setShowAddModal(false)
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      })
      setFormErrors({})
      fetchData()
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
  }

  const clearFilters = () => {
    setFilterDate('')
    setFilterEmployee('')
  }

  const getEmployeeName = (record) => {
    if (record.employeeName) {
      return record.employeeName
    }
    if (typeof record.employeeId === 'object' && record.employeeId.fullName) {
      return record.employeeId.fullName
    }
    const emp = employees.find(e => e.employeeId === record.employeeId)
    return emp?.fullName || 'Unknown'
  }

  const getEmployeeDepartment = (record) => {
    if (typeof record.employeeId === 'object' && record.employeeId.department) {
      return record.employeeId.department
    }
    const emp = employees.find(e => e.employeeId === record.employeeId)
    return emp?.department || 'N/A'
  }

  const getTotalPresentDays = (empId) => {
    return attendance.filter(record => 
      record.employeeId === empId && 
      record.status === 'Present'
    ).length
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-2 text-gray-600">Track and manage employee attendance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Mark Attendance
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Employee
            </label>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="input-field"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filterEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <p className="text-sm text-gray-500">Total Present Days</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {getTotalPresentDays(filterEmployee)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Absent Days</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {attendance.filter(r => 
                r.employeeId === filterEmployee && 
                r.status === 'Absent'
              ).length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {attendance.filter(r => 
                r.employeeId === filterEmployee
              ).length}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filteredAttendance.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CalendarIcon}
            title="No attendance records found"
            description={filterDate || filterEmployee ? "Try adjusting your filters" : "Get started by marking attendance"}
            action={
              !filterDate && !filterEmployee && (
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Mark Attendance
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getEmployeeName(record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getEmployeeDepartment(record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({
            employeeId: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
          })
          setFormErrors({})
        }}
        title="Mark Attendance"
      >
        <form onSubmit={handleMarkAttendance}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className={`input-field ${formErrors.employeeId ? 'border-red-500' : ''}`}
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.employeeId}>
                    {emp.fullName} ({emp.employeeId})
                  </option>
                ))}
              </select>
              {formErrors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{formErrors.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`input-field ${formErrors.date ? 'border-red-500' : ''}`}
              />
              {formErrors.date && (
                <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Present' })}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    formData.status === 'Present'
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Absent' })}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    formData.status === 'Absent'
                      ? 'bg-red-100 text-red-700 border-2 border-red-500'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  Absent
                </button>
              </div>
              {formErrors.status && (
                <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false)
                setFormData({
                  employeeId: '',
                  date: new Date().toISOString().split('T')[0],
                  status: 'Present',
                })
                setFormErrors({})
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Mark Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Attendance
