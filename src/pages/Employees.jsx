  import React, { useState, useEffect } from 'react'
  import { Plus, Search, Trash2, Users as UsersIcon } from 'lucide-react'
  import toast from 'react-hot-toast'
  import Modal from '../components/Modal'
  import LoadingSpinner from '../components/LoadingSpinner'
  import LoadingBar from '../components/LoadingBar'
  import EmptyState from '../components/EmptyState'
  import { employeesAPI } from '../api/api'

  const Employees = () => {
    const [employees, setEmployees] = useState([])
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
      employeeId: '',
      fullName: '',
      email: '',
      department: '',
    })
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
      fetchEmployees()
    }, [])

    useEffect(() => {
      const filtered = employees.filter((emp) =>
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEmployees(filtered)
    }, [searchTerm, employees])

    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await employeesAPI.getAll()
        setEmployees(response.data)
        setFilteredEmployees(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch employees')
      } finally {
        setLoading(false)
      }
    }

    const validateForm = () => {
      const errors = {}
      
      if (!formData.employeeId.trim()) {
        errors.employeeId = 'Employee ID is required'
      }
      
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full Name is required'
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format'
      }
      
      if (!formData.department.trim()) {
        errors.department = 'Department is required'
      }
      
      setFormErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleAddEmployee = async (e) => {
      e.preventDefault()
      
      if (!validateForm()) return

      try {
        setSubmitting(true)
        await employeesAPI.create(formData)
        toast.success('Employee added successfully!')
        setShowAddModal(false)
        setFormData({ employeeId: '', fullName: '', email: '', department: '' })
        setFormErrors({})
        fetchEmployees()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add employee')
      } finally {
        setSubmitting(false)
      }
    }

    const handleDeleteEmployee = async (id, name) => {
      if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

      const loadingToast = toast.loading('Deleting employee...')
      try {
        await employeesAPI.delete(id)
        toast.success('Employee deleted successfully!', { id: loadingToast })
        fetchEmployees()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete employee', { id: loadingToast })
      }
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: '' })
      }
    }

    return (
      <div>
        {loading && <LoadingBar />}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="mt-2 text-gray-600">Manage your employee records</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Employee
          </button>
        </div>

        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredEmployees.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={UsersIcon}
              title="No employees found"
              description={searchTerm ? "Try adjusting your search" : "Get started by adding your first employee"}
              action={
                !searchTerm && (
                  <button onClick={() => setShowAddModal(true)} className="btn-primary">
                    <Plus className="w-5 h-5 mr-2 inline" />
                    Add Employee
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
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDeleteEmployee(employee.id, employee.fullName)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
            setFormData({ employeeId: '', fullName: '', email: '', department: '' })
            setFormErrors({})
          }}
          title="Add New Employee"
        >
          <form onSubmit={handleAddEmployee}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.employeeId ? 'border-red-500' : ''}`}
                  placeholder="e.g., EMP001"
                />
                {formErrors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.employeeId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.fullName ? 'border-red-500' : ''}`}
                  placeholder="e.g., John Doe"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="e.g., john.doe@company.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.department ? 'border-red-500' : ''}`}
                  placeholder="e.g., Engineering"
                />
                {formErrors.department && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({ employeeId: '', fullName: '', email: '', department: '' })
                  setFormErrors({})
                }}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Employee'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    )
  }

  export default Employees
