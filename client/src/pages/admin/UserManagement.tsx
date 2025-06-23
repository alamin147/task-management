import { useState, useEffect } from "react";
import {
  useGetUsersWithDetailsQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  UserWithDetails
} from "@/redux/api/adminApi";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { data: users, isLoading, isError, refetch } = useGetUsersWithDetailsQuery();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);

  useEffect(() => {
    if (users) {
      if (searchTerm) {
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }
  }, [users, searchTerm]);

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    try {
      await updateRole({ id: userId, role }).unwrap();
      toast.success(`User role updated to ${role}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await toggleStatus({ id: userId, status: newStatus as 'active' | 'suspended' }).unwrap();
      toast.success(`User account ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading users...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error loading users</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Tasks</th>
              <th className="px-4 py-3 text-center">Completion</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                          {user.name[0]}
                        </div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                      disabled={isUpdatingRole}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block p-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.totalTasks} ({user.completedTasks} completed)
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <span className="mr-2">{user.completionRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.status || 'active')}
                        disabled={isTogglingStatus}
                        className={`text-xs px-2 py-1 rounded ${
                          user.status === 'active'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={isDeleting}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
