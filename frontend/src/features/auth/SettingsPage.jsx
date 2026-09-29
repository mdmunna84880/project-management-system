import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth/authSlice';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '@/features/auth/authApi';
import { FiUser, FiLock, FiSave, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onUpdateProfile = async (data) => {
    try {
      const result = await updateProfile({ name: data.name }).unwrap();
      dispatch(setCredentials(result.data.user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update profile.');
    }
  };

  const onUpdatePassword = async (data) => {
    try {
      await updatePassword({ 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).unwrap();
      toast.success('Password updated successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <FiUser className="text-accent" />
          <h3 className="text-base font-bold text-foreground">Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-border shadow-inner">
              <span className="text-primary-foreground text-xl font-bold">{userInitials}</span>
            </div>
            <div>
              <p className="font-bold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-accent/20 text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {user?.role === 'ADMIN' ? '⚡ Admin' : '👤 Member'}
              </span>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Display Name</label>
              <input
                {...profileForm.register('name')}
                type="text"
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
              {profileForm.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive font-medium">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isUpdatingProfile ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <FiSave />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <FiLock className="text-accent" />
          <h3 className="text-base font-bold text-foreground">Change Password</h3>
        </div>
        <div className="p-6">
          <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
            {[
              { field: 'currentPassword', label: 'Current Password' },
              { field: 'newPassword', label: 'New Password' },
              { field: 'confirmPassword', label: 'Confirm New Password' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                <input
                  {...passwordForm.register(field)}
                  type="password"
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                  placeholder="••••••••"
                />
                {passwordForm.formState.errors[field] && (
                  <p className="mt-1 text-xs text-destructive font-medium">{passwordForm.formState.errors[field].message}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isUpdatingPassword ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <FiShield />
                )}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
