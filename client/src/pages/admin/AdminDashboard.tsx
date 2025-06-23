import { useGetUserAnalyticsQuery } from "@/redux/api/adminApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import UserManagement from "./UserManagement";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { data: analytics, isLoading, isError } = useGetUserAnalyticsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load analytics");
    }
  }, [isError]);

  // Prepare data for user distribution chart
  const userDistributionData = {
    labels: ['Admin Users', 'Regular Users'],
    datasets: [
      {
        label: 'User Distribution',
        data: [analytics?.userStats?.adminUsers || 0, analytics?.userStats?.regularUsers || 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for task completion chart
  const taskCompletionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Task Status',
        data: [
          analytics?.taskStats?.completedTasks || 0,
          (analytics?.taskStats?.totalTasks || 0) - (analytics?.taskStats?.completedTasks || 0)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 70,
        maxBarThickness: 100,
      },
    ],
  };

  // No user activity trend data - removed as requested

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading analytics...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      {analytics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold">{analytics.userStats?.totalUsers}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Admin Users</h3>
              <p className="text-2xl font-bold">{analytics.userStats?.adminUsers}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Regular Users</h3>
              <p className="text-2xl font-bold">{analytics.userStats?.regularUsers}</p>
            </div>

          </div>


                  {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart Section - User Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">User Role Distribution</h3>
              <div className="h-64 flex justify-center items-center">
                <Doughnut
                  data={userDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: 'circle',
                          font: {
                            size: 13
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 13
                        },
                        callbacks: {
                          label: function(context) {
                            return ` ${context.label}: ${context.raw}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Chart Section - Task Completion */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Task Completion Status</h3>
              <div className="h-64 flex justify-center items-center">
                <Bar
                  data={taskCompletionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: true,
                          color: 'rgba(107, 114, 128, 0.1)',
                        },
                        ticks: {
                          font: {
                            size: 12
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            size: 13,
                            weight: 'bold'
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14,
                          weight: 'bold'
                        },
                        bodyFont: {
                          size: 13
                        },
                        callbacks: {
                          label: function(context) {
                            return `Count: ${context.raw}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="flex justify-center mt-4 gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[rgba(75,192,192,0.6)]"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[rgba(255,159,64,0.6)]"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {analytics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</h3>
              <p className="text-2xl font-bold">{analytics?.taskStats?.totalTasks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</h3>
              <p className="text-2xl font-bold">{analytics?.taskStats?.completedTasks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</h3>
              <p className="text-2xl font-bold">{analytics?.taskStats?.completionRate}%</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${analytics?.taskStats?.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Task Completion Chart */}

        </div>
      )}

      <UserManagement />
    </div>
  );
};

export default AdminDashboard;
