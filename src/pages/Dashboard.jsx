import React, { useState, useEffect } from 'react'
import { Users, Calendar, CheckCircle, TrendingUp } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { dashboardAPI } from '../api/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardAPI.getStats()
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics')
    } finally {
      setLoading(false)
    }
  }
  if (loading) return <LoadingSpinner />

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: stats?.presentToday || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Attendance',
      value: stats?.totalAttendance || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to HRMS Lite - Overview of your HR metrics</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
          {stats?.departmentBreakdown && stats.departmentBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.departmentBreakdown.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{dept.department || 'N/A'}</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {dept.count} employees
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No department data available</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/employees"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-900">Manage Employees</p>
              <p className="text-sm text-gray-500 mt-1">Add, view, or remove employees</p>
            </a>
            <a
              href="/attendance"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-900">Mark Attendance</p>
              <p className="text-sm text-gray-500 mt-1">Record daily attendance for employees</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
