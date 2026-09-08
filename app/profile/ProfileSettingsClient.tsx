'use client';

import React, { useState } from 'react';
import { User, Lock, Key, Check, AlertCircle } from 'lucide-react';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
  };
}

export default function ProfileSettingsClient({ user }: Props) {
  // Profile update state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, avatar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfileMsg({ type: 'success', text: 'Profile details saved successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setChangingPass(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      setPassMsg({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profile Form */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-400" />
          Edit Profile Information
        </h3>

        {profileMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              profileMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            {profileMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Bio / Specialization</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Aspiring Penetration Tester & SOC Analyst..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-50"
          >
            {savingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-400" />
          Update Security Password
        </h3>

        {passMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              passMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            {passMsg.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">New Password (min. 8 chars)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-all disabled:opacity-50"
          >
            {changingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
