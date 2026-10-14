import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Shield, 
  Check, 
  X, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Edit3,
  Snowflake,
  Unlock,
  Download,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  ShieldAlert,
  Building,
  User,
  KeyRound,
  Lock,
  Copy,
  Sparkles,
  ShieldCheck,
  Dice5
} from 'lucide-react';
import { AdminRole, AdminUser, UserAccountStatus } from '../../types/admin';
import { 
  getAllStaffUsers, 
  createStaffUser, 
  updateStaffUser, 
  updateStaffUserPassword,
  freezeStaffUser,
  unfreezeStaffUser,
  deleteStaffUser,
  DEFAULT_ACCOUNT_PASSWORDS
} from '../../services/adminService';

interface UserManagementModuleProps {
  currentUser: AdminUser;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const ROLE_LABELS: Record<AdminRole, { title: string; color: string; badge: string }> = {
  superadmin: { title: 'Super Administrator', color: 'text-purple-300', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  direktur: { title: 'Direktur BUMDes', color: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  bendahara: { title: 'Bendahara Kas', color: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  karyawan: { title: 'Karyawan / Kasir', color: 'text-cyan-300', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  operator: { title: 'Operator Lapangan', color: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  manajer_fasilitas: { title: 'Manajer Aula Gedung', color: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  editor: { title: 'Editor & Publikasi', color: 'text-pink-300', badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  auditor: { title: 'Auditor / Pengawas BPD', color: 'text-rose-300', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  pic_wilayah: { title: 'PIC Wilayah (Dusun/RW)', color: 'text-teal-300', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  pelanggan: { title: 'Akun Warga / Pelanggan', color: 'text-slate-300', badge: 'bg-slate-700/40 text-slate-300 border-slate-600' }
};

export default function UserManagementModule({ currentUser, onShowToast }: UserManagementModuleProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab: 'staff' | 'pelanggan' | 'all'
  const [activeCategory, setActiveCategory] = useState<'staff' | 'pelanggan' | 'all'>('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen' | 'inactive'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [freezingUser, setFreezingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Form State: Add User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('operator');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserZone, setNewUserZone] = useState('Dusun I (Wilayah Sentral)');
  const [newUserNotes, setNewUserNotes] = useState('');
  const [creating, setCreating] = useState(false);

  // Form State: Freeze User
  const [freezeReason, setFreezeReason] = useState('Penyalahgunaan akun atau masa nonaktif sementara oleh Super Admin');

  // Form State: Edit User & Credential Management
  const [editModalTab, setEditModalTab] = useState<'profil' | 'password'>('profil');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('karyawan');
  const [editPhone, setEditPhone] = useState('');
  const [editZone, setEditZone] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Password Management State
  const [currentPasswordValue, setCurrentPasswordValue] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllStaffUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal with Optional Initial Tab
  const handleOpenEdit = (user: AdminUser, initialTab: 'profil' | 'password' = 'profil') => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPhone(user.phone || '');
    setEditZone(user.assignedZone || '');
    setEditNotes(user.notes || '');

    // Resolve current password from user profile or predefined accounts
    const knownPassword = user.currentPassword || DEFAULT_ACCOUNT_PASSWORDS[user.email.toLowerCase()] || 'BumdesWaru#2026';
    setCurrentPasswordValue(knownPassword);
    setShowCurrentPassword(false);
    setCopiedPassword(false);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordChangeSuccess(null);
    setPasswordChangeError(null);
    setEditModalTab(initialTab);
  };

  const handleCopyPassword = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let generated = 'Waskita!';
    for (let i = 0; i < 6; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(generated);
    setConfirmPasswordInput(generated);
    setShowNewPassword(true);
    setShowConfirmPassword(true);
    setPasswordChangeError(null);
  };

  const handleSetDefaultPassword = () => {
    const def = DEFAULT_ACCOUNT_PASSWORDS[editingUser?.email.toLowerCase() || ''] || 'BumdesWaru#2026';
    setNewPasswordInput(def);
    setConfirmPasswordInput(def);
    setShowNewPassword(true);
    setShowConfirmPassword(true);
    setPasswordChangeError(null);
  };

  // Save Password Only Handler
  const handleSavePasswordOnly = async () => {
    if (!editingUser) return;
    if (!newPasswordInput || newPasswordInput.trim().length < 6) {
      setPasswordChangeError('Password baru minimal harus 6 karakter.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    setUpdatingPassword(true);
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    try {
      const trimmedPass = newPasswordInput.trim();
      await updateStaffUserPassword(editingUser.uid, editingUser.email, trimmedPass);

      setCurrentPasswordValue(trimmedPass);
      const nowIso = new Date().toISOString();

      setUsers(prev => prev.map(u => u.uid === editingUser.uid ? { ...u, currentPassword: trimmedPass, passwordUpdatedAt: nowIso } : u));
      setEditingUser(prev => prev ? { ...prev, currentPassword: trimmedPass, passwordUpdatedAt: nowIso } : null);

      if (viewingUser && viewingUser.uid === editingUser.uid) {
        setViewingUser(prev => prev ? { ...prev, currentPassword: trimmedPass, passwordUpdatedAt: nowIso } : null);
      }

      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setPasswordChangeSuccess(`✓ Password untuk ${editingUser.name} berhasil diperbarui menjadi: ${trimmedPass}`);
      onShowToast(`✓ Password untuk akun ${editingUser.name} berhasil diperbarui!`, 'success');
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Gagal mengubah password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Submit Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);

    try {
      const updates: Partial<AdminUser> = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        role: editRole,
        phone: editPhone.trim(),
        assignedZone: editZone.trim() || undefined,
        notes: editNotes.trim()
      };

      // If user also filled new password in the modal
      if (newPasswordInput) {
        if (newPasswordInput.trim().length < 6) {
          throw new Error('Password baru minimal 6 karakter.');
        }
        if (newPasswordInput !== confirmPasswordInput) {
          throw new Error('Konfirmasi password baru tidak cocok.');
        }
        const trimmedPass = newPasswordInput.trim();
        await updateStaffUserPassword(editingUser.uid, editEmail.trim().toLowerCase(), trimmedPass);
        updates.currentPassword = trimmedPass;
        updates.passwordUpdatedAt = new Date().toISOString();
      }

      await updateStaffUser(editingUser.uid, updates);

      setUsers(prev =>
        prev.map(u => (u.uid === editingUser.uid ? { ...u, ...updates } : u))
      );

      if (viewingUser && viewingUser.uid === editingUser.uid) {
        setViewingUser(prev => prev ? { ...prev, ...updates } : null);
      }

      onShowToast(`✓ Data profil ${editName} berhasil diperbarui!`, 'success');
      setEditingUser(null);
    } catch (err: any) {
      onShowToast(err.message || 'Gagal memperbarui profil', 'warning');
    } finally {
      setSavingEdit(false);
    }
  };

  // Freeze User Action
  const handleConfirmFreeze = async () => {
    if (!freezingUser) return;
    try {
      await freezeStaffUser(freezingUser.uid, freezeReason);
      setUsers(prev =>
        prev.map(u =>
          u.uid === freezingUser.uid
            ? { ...u, active: false, status: 'frozen', frozenReason: freezeReason, frozenAt: new Date().toISOString() }
            : u
        )
      );
      if (viewingUser && viewingUser.uid === freezingUser.uid) {
        setViewingUser(prev =>
          prev ? { ...prev, active: false, status: 'frozen', frozenReason: freezeReason, frozenAt: new Date().toISOString() } : null
        );
      }
      onShowToast(`Akun ${freezingUser.name} berhasil DIBEKUKAN sementara.`, 'info');
      setFreezingUser(null);
    } catch (err: any) {
      onShowToast(err.message || 'Gagal membekukan akun', 'warning');
    }
  };

  // Unfreeze User Action
  const handleUnfreeze = async (user: AdminUser) => {
    try {
      await unfreezeStaffUser(user.uid);
      setUsers(prev =>
        prev.map(u =>
          u.uid === user.uid
            ? { ...u, active: true, status: 'active', frozenReason: undefined, frozenAt: undefined }
            : u
        )
      );
      if (viewingUser && viewingUser.uid === user.uid) {
        setViewingUser(prev =>
          prev ? { ...prev, active: true, status: 'active', frozenReason: undefined, frozenAt: undefined } : null
        );
      }
      onShowToast(`✓ Pembekuan dicabut. Akun ${user.name} kembali AKTIF normal.`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Gagal membatalkan pembekuan', 'warning');
    }
  };

  // Toggle Standard Active/Inactive
  const handleToggleActive = async (targetUser: AdminUser) => {
    const nextStatus = !targetUser.active;
    try {
      await updateStaffUser(targetUser.uid, {
        active: nextStatus,
        status: nextStatus ? 'active' : 'inactive'
      });
      setUsers(prev =>
        prev.map(u =>
          u.uid === targetUser.uid
            ? { ...u, active: nextStatus, status: nextStatus ? 'active' : 'inactive' }
            : u
        )
      );
      onShowToast(
        `Status akun ${targetUser.name} diubah menjadi ${nextStatus ? 'AKTIF' : 'NONAKTIF'}`,
        'info'
      );
    } catch (err: any) {
      onShowToast(err.message || 'Gagal mengubah status', 'warning');
    }
  };

  // Delete User Action
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteStaffUser(deletingUser.uid);
      setUsers(prev => prev.filter(u => u.uid !== deletingUser.uid));
      if (viewingUser && viewingUser.uid === deletingUser.uid) {
        setViewingUser(null);
      }
      onShowToast(`✓ Akun "${deletingUser.name}" berhasil dihapus secara permanen dari sistem.`, 'success');
      setDeletingUser(null);
    } catch (err: any) {
      onShowToast(err.message || 'Gagal menghapus pengguna', 'warning');
    }
  };

  // Create User Action
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName) return;
    if (newUserPassword.length < 6) {
      onShowToast('Kata sandi awal minimal 6 karakter', 'warning');
      return;
    }

    setCreating(true);
    try {
      const isCustomer = newUserRole === 'pelanggan';
      const created = await createStaffUser(
        {
          name: newUserName.trim(),
          email: newUserEmail.trim().toLowerCase(),
          role: newUserRole,
          active: true,
          status: 'active',
          userCategory: isCustomer ? 'pelanggan' : 'staff',
          phone: newUserPhone.trim(),
          notes: newUserNotes.trim(),
          assignedZone: newUserRole === 'pic_wilayah' ? newUserZone : undefined
        },
        newUserPassword
      );

      setUsers(prev => [...prev, created]);
      onShowToast(`✓ Akun baru ${created.name} (${ROLE_LABELS[created.role].title}) berhasil ditambahkan!`, 'success');
      
      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserPhone('');
      setNewUserNotes('');
      setIsAddModalOpen(false);
    } catch (err: any) {
      onShowToast(err.message || 'Gagal membuat pengguna', 'warning');
    } finally {
      setCreating(false);
    }
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    const headers = ['UID', 'Nama Lengkap', 'Email', 'Peran', 'Status', 'Nomor HP', 'Wilayah / Dusun', 'Tanggal Dibuat'];
    const rows = filteredUsers.map(u => [
      u.uid,
      `"${u.name}"`,
      u.email,
      ROLE_LABELS[u.role]?.title || u.role,
      u.status || (u.active ? 'active' : 'inactive'),
      u.phone || '-',
      `"${u.assignedZone || '-'}"`,
      u.createdAt || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bumdes_users_database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('✓ Data pengguna berhasil diekspor ke file CSV', 'success');
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    // 1. Category tab filter
    const userCat = u.role === 'pelanggan' ? 'pelanggan' : 'staff';
    if (activeCategory !== 'all' && userCat !== activeCategory) return false;

    // 2. Search query filter
    const query = searchQuery.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query)) ||
      (u.assignedZone && u.assignedZone.toLowerCase().includes(query));

    // 3. Role filter
    const matchRole = roleFilter === 'all' || u.role === roleFilter;

    // 4. Status filter
    const effectiveStatus: UserAccountStatus = u.status || (u.active ? 'active' : 'inactive');
    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const staffCount = users.filter(u => u.role !== 'pelanggan').length;
  const customerCount = users.filter(u => u.role === 'pelanggan').length;
  const frozenCount = users.filter(u => u.status === 'frozen').length;

  return (
    <div className="space-y-6">
      {/* Top Super Admin Identity & Status Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#07192f] to-slate-950 border border-cyan-500/30 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">Super Admin Database Control:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AKSES OTORITAS PENUH (CRUD + FREEZE)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Pengguna aktif: <strong>{currentUser.email}</strong> ({currentUser.name}) · Mengelola data staf internal BUMDes dan akun warga/pelanggan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await loadUsers();
              onShowToast('✓ Database pengguna berhasil diperbarui dari Firestore.', 'info');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Database Category Tabs & Main Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Semua Akun ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === 'staff'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Staf & Pejabat BUMDes ({staffCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('pelanggan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === 'pelanggan'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Warga & Pelanggan Sewa ({customerCount})</span>
          </button>

          {frozenCount > 0 && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-amber-400" />
              <span>{frozenCount} Akun Dibekukan</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, nomor HP, atau wilayah penugasan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="frozen">Dibekukan (Freeze)</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Semua Peran</option>
              <option value="superadmin">Super Administrator</option>
              <option value="direktur">Direktur BUMDes</option>
              <option value="bendahara">Bendahara Kas</option>
              <option value="karyawan">Karyawan / Kasir</option>
              <option value="operator">Operator Lapangan</option>
              <option value="pic_wilayah">PIC Wilayah (Dusun/RW)</option>
              <option value="manajer_fasilitas">Manajer Aula Gedung</option>
              <option value="editor">Editor Publikasi</option>
              <option value="auditor">Auditor / BPD</option>
              <option value="pelanggan">Warga / Pelanggan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Users Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#091a2e] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Identitas Pengguna</th>
                <th className="py-3.5 px-4 font-bold">Peran (Role)</th>
                <th className="py-3.5 px-4 font-bold">Wilayah / Kontak</th>
                <th className="py-3.5 px-4 font-bold text-center">Status Akun</th>
                <th className="py-3.5 px-4 font-bold text-right">Kelola & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada pengguna yang cocok dengan kriteria filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleMeta = ROLE_LABELS[user.role] || { title: user.role, color: 'text-slate-300', badge: 'bg-slate-800 text-slate-300' };
                  const isCurrent = user.uid === currentUser.uid;
                  const effectiveStatus: UserAccountStatus = user.status || (user.active ? 'active' : 'inactive');

                  return (
                    <tr key={user.uid} className="hover:bg-slate-900/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            effectiveStatus === 'frozen'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-slate-800 text-cyan-400 border border-slate-700'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white hover:text-cyan-300 cursor-pointer" onClick={() => setViewingUser(user)}>
                                {user.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-black">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${roleMeta.badge}`}>
                          {roleMeta.title}
                        </span>
                      </td>

                      {/* Zone / Phone */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {user.assignedZone ? (
                          <div className="flex items-center gap-1 text-teal-300 font-semibold">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{user.assignedZone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Desa Waru (Umum)</span>
                        )}
                        {user.phone ? (
                          <span className="block text-slate-400 font-mono mt-0.5">{user.phone}</span>
                        ) : (
                          <span className="text-slate-600 block text-[10px]">-</span>
                        )}
                      </td>

                      {/* Status Badges with Freeze Indicator */}
                      <td className="py-3.5 px-4 text-center">
                        {effectiveStatus === 'frozen' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-950/90 text-amber-300 border border-amber-600 shadow-xs">
                              <Snowflake className="w-3 h-3 text-amber-400" />
                              <span>DIBEKUKAN</span>
                            </span>
                            {user.frozenReason && (
                              <span className="text-[9px] text-amber-400/80 mt-0.5 max-w-[120px] truncate" title={user.frozenReason}>
                                {user.frozenReason}
                              </span>
                            )}
                          </div>
                        ) : user.active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>AKTIF</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-950/80 text-rose-300 border border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>NONAKTIF</span>
                          </span>
                        )}
                      </td>

                      {/* Action Controls */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail Profile Button */}
                          <button
                            type="button"
                            onClick={() => setViewingUser(user)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                            title="Cek Detail Profil Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Data Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user, 'profil')}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors cursor-pointer"
                            title="Edit & Ubah Profil Pengguna"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Password Management Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user, 'password')}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-amber-950/60 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-700/60 transition-colors cursor-pointer"
                            title="Lihat & Ubah Kata Sandi Akun Ini"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Freeze / Unfreeze Action Button */}
                          {!isCurrent && (
                            effectiveStatus === 'frozen' ? (
                              <button
                                type="button"
                                onClick={() => handleUnfreeze(user)}
                                className="p-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700 transition-colors cursor-pointer"
                                title="Batalkan Pembekuan (Aktifkan Kembali)"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setFreezingUser(user);
                                  setFreezeReason('Penyalahgunaan akun atau masa evaluasi oleh Super Admin');
                                }}
                                className="p-1.5 rounded-xl bg-slate-900 hover:bg-amber-950/50 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-700 transition-colors cursor-pointer"
                                title="Bekukan Akun Sementara"
                              >
                                <Snowflake className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}

                          {/* Delete Action Button (Safe Modal) */}
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(user)}
                              className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors cursor-pointer"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL PROFIL PENGGUNA                                           */}
      {/* ========================================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black">Detail Profil Pengguna</h4>
                  <span className="text-[11px] text-slate-400 font-mono">UID: {viewingUser.uid}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Primary Info */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xl font-black text-slate-950 shadow-md">
                {viewingUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">{viewingUser.name}</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${ROLE_LABELS[viewingUser.role]?.badge}`}>
                  {ROLE_LABELS[viewingUser.role]?.title}
                </span>
                <span className="text-xs text-slate-400 block font-mono">{viewingUser.email}</span>
              </div>
            </div>

            {/* Status & Freeze Warning if any */}
            {viewingUser.status === 'frozen' && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/60 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Snowflake className="w-4 h-4 text-amber-400" />
                  <span>AKUN DALAM STATUS DIBEKUKAN</span>
                </div>
                <p className="text-xs text-amber-200/90">
                  <strong>Alasan:</strong> {viewingUser.frozenReason || 'Tidak ada alasan khusus dicantumkan'}
                </p>
                {viewingUser.frozenAt && (
                  <span className="text-[10px] text-amber-400/80 font-mono block">
                    Dibekukan pada: {new Date(viewingUser.frozenAt).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor WhatsApp / HP</span>
                <span className="font-mono text-cyan-300 font-bold">{viewingUser.phone || 'Belum diisi'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Wilayah / Teritorial</span>
                <span className="text-white font-semibold">{viewingUser.assignedZone || 'Desa Waru (Pusat)'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tanggal Registrasi</span>
                <span className="font-mono text-slate-300">
                  {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kategori Akun</span>
                <span className="text-teal-300 font-bold">
                  {viewingUser.role === 'pelanggan' ? 'Warga / Pelanggan Sewa' : 'Staf Internal BUMDes'}
                </span>
              </div>
            </div>

            {/* Super Admin Privileged Credential Box in Profile Details */}
            <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Kata Sandi Akun (Akses Super Admin)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Super Admin View
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400/80 shrink-0" />
                  <span className="font-mono text-sm font-bold text-amber-200 tracking-wider">
                    {viewingUser.currentPassword || DEFAULT_ACCOUNT_PASSWORDS[viewingUser.email.toLowerCase()] || 'BumdesWaru#2026'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(viewingUser.currentPassword || DEFAULT_ACCOUNT_PASSWORDS[viewingUser.email.toLowerCase()] || 'BumdesWaru#2026')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                    title="Salin Kata Sandi"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPassword ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const target = viewingUser;
                      setViewingUser(null);
                      handleOpenEdit(target, 'password');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Ubah Password</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Sebagai Super Administrator, Anda memiliki otoritas penuh melihat dan mengubah kredensial seluruh staf & pelanggan.
              </p>
            </div>

            {viewingUser.notes && (
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan Tambahan Super Admin</span>
                <p className="text-slate-300">{viewingUser.notes}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = viewingUser;
                  setViewingUser(null);
                  handleOpenEdit(target, 'password');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Lihat & Ubah Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingUser;
                  setViewingUser(null);
                  handleOpenEdit(target, 'profil');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Data Profil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT / UBAH DATA PENGGUNA & KREDENSIAL PASSWORD                   */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-white max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black">Kelola Profil & Kredensial Pengguna</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{editingUser.name} ({editingUser.email})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs Navigation: Profil vs Password */}
            <div className="flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setEditModalTab('profil')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  editModalTab === 'profil'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Informasi Profil</span>
              </button>

              <button
                type="button"
                onClick={() => setEditModalTab('password')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  editModalTab === 'password'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Lihat & Ubah Password</span>
                <span className={`w-2 h-2 rounded-full ${editModalTab === 'password' ? 'bg-slate-950' : 'bg-amber-400 animate-pulse'}`}></span>
              </button>
            </div>

            {/* TAB CONTENT 1: EDIT INFORMASI PROFIL */}
            {editModalTab === 'profil' && (
              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Alamat Email *</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nomor WhatsApp / HP</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Peran Otoritas (Role) *</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as AdminRole)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-cyan-400"
                    >
                      <option value="superadmin">Super Administrator</option>
                      <option value="direktur">Direktur BUMDes</option>
                      <option value="bendahara">Bendahara Kas</option>
                      <option value="karyawan">Karyawan / Kasir</option>
                      <option value="operator">Operator Lapangan</option>
                      <option value="pic_wilayah">PIC Wilayah (Dusun/RW)</option>
                      <option value="manajer_fasilitas">Manajer Aula Gedung</option>
                      <option value="editor">Editor & Publikasi</option>
                      <option value="auditor">Auditor / BPD</option>
                      <option value="pelanggan">Akun Warga / Pelanggan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Penugasan Wilayah / Dusun</label>
                    <input
                      type="text"
                      value={editZone}
                      onChange={(e) => setEditZone(e.target.value)}
                      placeholder="Contoh: Dusun I & Dusun II"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Catatan Khusus / Deskripsi</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Catatan wewenang atau tanggung jawab akun..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Quick Hint to Password Management */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-300">
                      Kata Sandi saat ini: <span className="font-mono text-amber-300 font-bold">{showCurrentPassword ? currentPasswordValue : '••••••••••••'}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditModalTab('password')}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 cursor-pointer transition-colors"
                  >
                    Buka Kelola Password →
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{savingEdit ? 'Menyimpan...' : 'Simpan Profil'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT 2: LIHAT & UBAH PASSWORD PENGGUNA */}
            {editModalTab === 'password' && (
              <div className="space-y-4 text-xs">
                {/* 1. LIHAT PASSWORD SAAT INI (SUPER ADMIN PRIVILEGE) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>1. Kata Sandi Akun Saat Ini</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Otoritas Penuh Super Admin
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Sebagai Super Admin, Anda dapat melihat kata sandi pengguna ini secara langsung untuk keperluan verifikasi atau asistensi teknis:
                  </p>

                  <div className="flex items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-mono text-sm font-bold text-amber-300 tracking-wider select-all break-all">
                        {showCurrentPassword ? currentPasswordValue : '••••••••••••••••'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle View Password */}
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                        title={showCurrentPassword ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{showCurrentPassword ? 'Sembunyikan' : 'Lihat'}</span>
                      </button>

                      {/* Copy Password Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(currentPasswordValue)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                        title="Salin Kata Sandi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPassword ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  {editingUser.passwordUpdatedAt && (
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Terakhir diperbarui: {new Date(editingUser.passwordUpdatedAt).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {/* 2. UBAH / GANTI KATA SANDI BARU */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs">
                      <KeyRound className="w-4 h-4 text-cyan-400" />
                      <span>2. Ubah / Ganti Kata Sandi Baru</span>
                    </div>

                    {/* Quick Generators */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleGenerateRandomPassword}
                        className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Buat kata sandi acak yang kuat"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Acak Sandi</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSetDefaultPassword}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Kembalikan ke sandi default akun"
                      >
                        <Dice5 className="w-3 h-3 text-slate-400" />
                        <span>Reset Default</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Password Baru */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Kata Sandi Baru (Min. 6 Karakter)</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPasswordInput}
                        onChange={(e) => {
                          setNewPasswordInput(e.target.value);
                          setPasswordChangeError(null);
                          setPasswordChangeSuccess(null);
                        }}
                        placeholder="Ketikkan kata sandi baru..."
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Input Konfirmasi Password Baru */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Konfirmasi Kata Sandi Baru</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => {
                          setConfirmPasswordInput(e.target.value);
                          setPasswordChangeError(null);
                          setPasswordChangeSuccess(null);
                        }}
                        placeholder="Ulangi kata sandi baru..."
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Realtime Match Indicator */}
                  {newPasswordInput && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {newPasswordInput.length < 6 ? (
                        <span className="text-amber-400 font-semibold">⚠️ Kata sandi minimal 6 karakter</span>
                      ) : newPasswordInput === confirmPasswordInput ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Konfirmasi kata sandi cocok dan siap disimpan!
                        </span>
                      ) : confirmPasswordInput.length > 0 ? (
                        <span className="text-rose-400 font-semibold">✕ Konfirmasi kata sandi belum sama</span>
                      ) : null}
                    </div>
                  )}

                  {/* Feedback alerts */}
                  {passwordChangeError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                      {passwordChangeError}
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      {passwordChangeSuccess}
                    </div>
                  )}

                  {/* Action Button: Save Password Only */}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                    >
                      Batal
                    </button>

                    <button
                      type="button"
                      disabled={updatingPassword || !newPasswordInput || newPasswordInput !== confirmPasswordInput || newPasswordInput.length < 6}
                      onClick={handleSavePasswordOnly}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {updatingPassword ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                          <span>Menyimpan Password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 stroke-[2.5]" />
                          <span>Simpan & Terapkan Password Baru</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BEKUKAN AKUN (FREEZE ACCOUNT)                                     */}
      {/* ========================================================================= */}
      {freezingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-white">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Snowflake className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Bekukan Akun Sementara</h4>
                <span className="text-[11px] text-amber-400">Suspend akses login pengguna</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anda akan membekukan akun <strong>{freezingUser.name}</strong> ({freezingUser.email}). Pengguna tidak akan dapat login ke dalam sistem hingga pembekuan dicabut oleh Super Admin.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-300">Alasan Pembekuan Akun *</label>
              <textarea
                rows={3}
                required
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="Tuliskan alasan pembekuan untuk audit trail..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFreezingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmFreeze}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer text-xs"
              >
                <Snowflake className="w-4 h-4" />
                <span>Bekukan Akun Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HAPUS AKUN SECARA AMAN (SAFE CONFIRMATION MODAL)                  */}
      {/* ========================================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-rose-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-white">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Konfirmasi Penghapusan Akun</h4>
                <span className="text-[11px] text-rose-400 font-mono">Tindakan tidak dapat dibatalkan</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{deletingUser.name}</strong> ({deletingUser.email}) dengan peran <strong>{ROLE_LABELS[deletingUser.role]?.title}</strong> secara permanen?
            </p>

            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-[11px] text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Peringatan Keamanan:</span>
              </div>
              <p>Seluruh riwayat kredensial dan izin akses akun ini akan dihapus dari sistem dan Firestore.</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: TAMBAH PENGGUNA BARU                                              */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-black">Tambah Pengguna / Staf / Warga Baru</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Nama Lengkap & Panggilan *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Tri Handoko / PB Warga Waru"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Alamat Email Login *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@bumdeswaskita.id"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Kata Sandi Awal *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Min. 6 Karakter"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Pilih Peran (Role) *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-semibold"
                  >
                    <option value="superadmin">Super Administrator</option>
                    <option value="direktur">Direktur BUMDes</option>
                    <option value="bendahara">Bendahara Kas</option>
                    <option value="karyawan">Karyawan / Kasir</option>
                    <option value="operator">Operator Lapangan</option>
                    <option value="pic_wilayah">PIC Wilayah (Dusun/RW)</option>
                    <option value="manajer_fasilitas">Manajer Aula Gedung</option>
                    <option value="editor">Editor & Publikasi</option>
                    <option value="auditor">Auditor / BPD</option>
                    <option value="pelanggan">Akun Warga / Pelanggan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Conditional Field: Wilayah Penugasan */}
              {newUserRole === 'pic_wilayah' && (
                <div className="space-y-1 p-3 bg-teal-950/40 border border-teal-800/70 rounded-xl">
                  <label className="font-black text-teal-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Penugasan Wilayah / Teritorial Dusun *</span>
                  </label>
                  <select
                    value={newUserZone}
                    onChange={(e) => setNewUserZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-teal-700 text-white focus:outline-none font-semibold text-xs"
                  >
                    <option value="Dusun I & Dusun II (Zona Sentral Lapangan)">Dusun I & Dusun II (Zona Sentral Lapangan)</option>
                    <option value="Dusun III (Kawasan Timur)">Dusun III (Kawasan Timur)</option>
                    <option value="Dusun IV (Kawasan Barat)">Dusun IV (Kawasan Barat)</option>
                    <option value="RW 01, RW 02, RW 03 (Area Pemukiman Utama)">RW 01, RW 02, RW 03 (Area Pemukiman Utama)</option>
                    <option value="Seluruh Wilayah Desa Waru">Seluruh Wilayah Desa Waru</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Catatan Khusus</label>
                <input
                  type="text"
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  placeholder="Catatan tambahan anggota..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{creating ? 'Menyimpan...' : 'Simpan Pengguna'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
