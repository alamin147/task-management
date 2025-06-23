import { useGetUserAnalyticsQuery } from "@/redux/api/adminApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import UserManagement from "./UserManagement";

const AdminDashboard = () => {
  const { data: analytics, isLoading, isError } = useGetUserAnalyticsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load analytics");
    }
  }, [isError]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading analytics...</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {analytics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Users (Last 30 Days)</h3>
              <p className="text-2xl font-bold">{analytics.userStats?.activeUsers}</p>
            </div>
          </div>
        </div>
      )}

      {analytics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      )}

      <UserManagement />
    </div>
  );
};

export default AdminDashboard;
