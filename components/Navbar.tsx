'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  Search,
  BookOpen,
  Terminal,
  Award,
  FileCheck,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { User } from '@/types';

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!initialUser) {
      const headers: Record<string, string> = {};
      try {
        const storedToken = localStorage.getItem('cybersec_session_token');
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch {}

      fetch('/api/auth/me', { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, [initialUser, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      try {
        localStorage.removeItem('cybersec_session_token');
        localStorage.removeItem('cybersec_user');
      } catch {}
      setUser(null);
      window.location.href = '/login';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Curriculum', icon: BookOpen },
    { href: '/labs', label: 'Security Labs', icon: Terminal },
    { href: '/project/final', label: 'Final Project', icon: FileCheck },
    { href: '/certificate', label: 'Certificate', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                CyberSec <span className="text-cyan-400">Academy</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Enterprise Training
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center w-64 lg:w-72">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lessons, labs, CVEs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
            />
          </form>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all ${
                pathname.startsWith('/admin')
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-amber-300/80 bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/15'
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-amber-400" />
              Admin CMS
            </Link>
          )}
        </nav>

        {/* Right Authentication State */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors"
                id="user-menu-button"
              >
                <div className="h-7 w-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    {user.role === 'ADMIN' ? '⚡ ADMIN' : '🛡️ STUDENT'}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
                    Student Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-blue-400" />
                    My Profile & Badges
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                    >
                      <Settings className="h-3.5 w-3.5 text-amber-400" />
                      Admin Console
                    </Link>
                  )}

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500"
            />
          </form>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900"
              >
                <Icon className="h-4 w-4 text-cyan-400" />
                {link.label}
              </Link>
            );
          })}

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20"
            >
              <Settings className="h-4 w-4 text-amber-400" />
              Admin CMS
            </Link>
          )}

          {!user && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
