'use client';

import AdminLayout from '@/components/AdminLayout';
import { PageHeader, Card, Button, Input, LoadingSpinner } from '@/components/admin/AdminComponents';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface UserFormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'PREMIUM';
  password?: string;
}

const roles = [
  { value: 'ADMIN', label: 'Administrator', icon: '👑', color: 'text-red-600 bg-red-100' },
  { value: 'USER', label: 'User', icon: '👤', color: 'text-blue-600 bg-blue-100' },
];

const statuses = [
  { value: 'ACTIVE', label: 'Active', icon: '🟢', color: 'text-green-600 bg-green-100' },
  { value: 'INACTIVE', label: 'Inactive', icon: '🔴', color: 'text-red-600 bg-red-100' },
  { value: 'PENDING', label: 'Pending', icon: '🟡', color: 'text-yellow-600 bg-yellow-100' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'USER',
    password: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulasi API call - replace dengan actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace dengan actual API response
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: '2024-01-15T10:30:00Z',
          avatar: '/api/placeholder/40/40'
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: '2024-01-10T00:00:00Z',
          lastLoginAt: '2024-01-14T15:20:00Z'
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'USER',
          status: 'PENDING',
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save user (create or update)
  const saveUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData, id: editingUser.id }
            : user
        ));
        toast.success('User updated successfully');
      } else {
        // Create new user
        const newUser: User = {
          ...formData,
          id: Date.now().toString(),
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [newUser, ...prev]);
        toast.success('User created successfully');
      }
      
      // Reset form
      setFormData({ name: '', email: '', role: 'USER', password: '' });
      setShowAddForm(false);
      setEditingUser(null);
      
    } catch (error) {
      toast.error('Error saving user');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error:', error);
    }
  };

  // Update user status
  const updateUserStatus = async (userId: string, status: User['status']) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Error:', error);
    }
  };

  // formatDate imported from utils

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open edit form
  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || user.username || '',
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowAddForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'USER', password: '' });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="User Management"
          description="Manage user accounts and permissions"
          action={
            <Button
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              👤 Add New User
            </Button>
          }
        />

        {/* Add/Edit User Form */}
        {showAddForm && (
          <Card
            title={editingUser ? 'Edit User' : 'Add New User'}
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={closeForm}
              >
                ✕ Cancel
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="Enter full name"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Email Address *
                </label>
                <Input
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  placeholder="Enter email address"
                  type="email"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'USER' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  disabled={saving}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <Input
                  value={formData.password || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  type="password"
                  disabled={saving}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={saveUser}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Saving...
                  </span>
                ) : (
                  editingUser ? 'Update User' : 'Create User'
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Search Users
              </label>
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name or email..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.icon} {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Card>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium">User</th>
                      <th className="text-left py-3 px-2 font-medium">Role</th>
                      <th className="text-left py-3 px-2 font-medium">Status</th>
                      <th className="text-left py-3 px-2 font-medium">Created</th>
                      <th className="text-left py-3 px-2 font-medium">Last Login</th>
                      <th className="text-left py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => {
                      const role = roles.find(r => r.value === user.role)!;
                      const status = statuses.find(s => s.value === user.status)!;
                      
                      return (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center text-white font-medium">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  (user.name || user.username || 'U').charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-neutral-gray">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                              <span>{role.icon}</span>
                              {role.label}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <select
                              value={user.status}
                              onChange={(e) => updateUserStatus(user.id, e.target.value as User['status'])}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${status.color}`}
                            >
                              {statuses.map(s => (
                                <option key={s.value} value={s.value}>
                                  {s.icon} {s.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-2 text-sm text-neutral-gray">
                            {formatDate(user.createdAt || '')}
                          </td>
                          <td className="py-3 px-2 text-sm text-neutral-gray">
                            {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditForm(user)}
                                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-xs transition-colors"
                                title="Edit User"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs transition-colors"
                                title="Delete User"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-medium text-neutral-dark mb-2">No users found</h3>
                <p className="text-neutral-gray mb-4">
                  {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                    ? 'No users match your current filters'
                    : 'No users have been created yet'
                  }
                </p>
                {!searchTerm && selectedRole === 'all' && selectedStatus === 'all' && (
                  <Button onClick={() => setShowAddForm(true)}>
                    👤 Add Your First User
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}