import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  User, 
  Users,
  RefreshCw, 
  ExternalLink, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Coins,
  ArrowRight,
  Shield,
  Loader2,
  Mail,
  Calendar,
  Lock,
  Award,
  Sparkles,
  UserCheck,
  Package,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialPlatform, BoostActionType, UserProfile } from '../types';

export const AdminPanelModal: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    isAdminPanelOpen, 
    setIsAdminPanelOpen,
    campaigns,
    registeredUsers,
    refreshUsersList,
    dispatchAdminCustomerOrder,
    refreshLiveCampaignStatus,
    isSyncingOrders,
    addToast
  } = useApp();

  // Tab State: 'dispatcher' | 'orders' | 'users'
  const [activeAdminTab, setActiveAdminTab] = useState<'dispatcher' | 'orders' | 'users'>('dispatcher');

  // Peakerr Balance State
  const [balance, setBalance] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Customer Order Form State
  const [platform, setPlatform] = useState<SocialPlatform>('tiktok');
  const [actionType, setActionType] = useState<BoostActionType>('follow');
  const [targetUrl, setTargetUrl] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [amountChargedNgn, setAmountChargedNgn] = useState<number | ''>(1500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastDispatchedOrder, setLastDispatchedOrder] = useState<{ id: string | number; name: string } | null>(null);

  // Orders Tab States
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'running' | 'completed'>('all');

  // TikTok Live Checker Tool
  const [checkUsername, setCheckUsername] = useState('');
  const [checkingFollowers, setCheckingFollowers] = useState(false);
  const [checkedFollowerCount, setCheckedFollowerCount] = useState<number | null>(null);

  // Users Tab States
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch live balance
  const fetchBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const res = await fetch('/api/smm/balance');
      const data = await res.json();
      if (data.success && data.data) {
        setBalance(data.data.balance || '0.00');
        setCurrency(data.data.currency || 'USD');
      }
    } catch (e) {
      console.warn('Could not fetch balance:', e);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (isAdminPanelOpen && isAdmin) {
      fetchBalance();
    }
  }, [isAdminPanelOpen, isAdmin]);

  if (!isAdminPanelOpen || !isAdmin) return null;

  // Handle Order Submit
  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUrl.trim()) {
      addToast('error', 'Link ko Username', 'Da fatan za a saka link ko username na TikTok ko Instagram.');
      return;
    }

    if (quantity < 10) {
      addToast('error', 'Adadi Ya Yi Kadan', 'Mafi karancin adadi shine 10.');
      return;
    }

    // Auto extract username from link
    const cleanTarget = targetUrl.trim();
    const extractedUser = cleanTarget
      .replace(/^https?:\/\/(www\.)?(tiktok\.com|instagram\.com|facebook\.com)\/@?/i, '')
      .split(/[\/?#]/)[0] || 'Client';
    const friendlyName = extractedUser.startsWith('@') ? extractedUser : `@${extractedUser}`;

    setIsSubmitting(true);
    try {
      const res = await dispatchAdminCustomerOrder({
        customerName: friendlyName,
        platform,
        actionType,
        targetUrl: cleanTarget,
        quantity,
        amountChargedNgn: typeof amountChargedNgn === 'number' ? amountChargedNgn : 0,
        notes: `Quick Admin Order for ${friendlyName}`,
      });

      if (res.success && res.peakerrOrder) {
        setLastDispatchedOrder({ id: res.peakerrOrder, name: friendlyName });
        setTargetUrl('');
        setQuantity(100);
        // Refresh balance after placing order
        fetchBalance();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inspect TikTok profile live
  const handleCheckTikTokFollowers = async () => {
    if (!checkUsername.trim()) return;
    setCheckingFollowers(true);
    setCheckedFollowerCount(null);

    const cleanUser = checkUsername.replace(/^@/, '').trim();
    try {
      const res = await fetch(`/api/smm/live-profile?url=https://www.tiktok.com/@${cleanUser}`);
      const data = await res.json();
      if (data.success && typeof data.count === 'number') {
        setCheckedFollowerCount(data.count);
        addToast('success', 'Followers An Gano!', `@${cleanUser} yana da ${data.count.toLocaleString()} followers a halin yanzu.`);
      } else {
        addToast('info', 'Bayanin TikTok', `Ba a samu adadin followers ba ko kuma asusun a kulle yake (Private).`);
      }
    } catch (err) {
      addToast('error', 'Kuskure', 'An samu matsala wajen binciken shafin TikTok.');
    } finally {
      setCheckingFollowers(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'An Yi Kwafi', `An kwafi: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter admin orders from campaigns
  const adminDispatchedOrders = campaigns.filter(c => 
    Boolean(c.peakerrOrderId) || c.title?.includes('[Admin Order]') || c.orderRef?.startsWith('ADM-')
  );

  // Approximate cost calculations
  const estimatedPeakerrCostUsd = platform === 'tiktok' && actionType === 'follow' 
    ? (quantity / 1000) * 1.18 
    : (quantity / 1000) * 0.90;
  const estimatedPeakerrCostNgn = Math.round(estimatedPeakerrCostUsd * 1600);
  const numericCharged = typeof amountChargedNgn === 'number' ? amountChargedNgn : 0;
  const estimatedProfitNgn = Math.max(0, numericCharged - estimatedPeakerrCostNgn);

  // Filtered Users List
  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = 
      (u.displayName && u.displayName.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (u.uid && u.uid.toLowerCase().includes(userSearchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (userRoleFilter === 'admin') return u.role === 'admin';
    if (userRoleFilter === 'user') return u.role !== 'admin';
    return true;
  });

  const adminsCount = registeredUsers.filter(u => u.role === 'admin').length;
  const membersCount = registeredUsers.filter(u => u.role !== 'admin').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-4 sm:p-6 shrink-0 border-b border-indigo-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                    Dandalin Admin (Admin Control Center)
                  </h2>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin Only
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Asusun Admin: <span className="text-white font-mono font-semibold">{user?.email || 'msngapps@gmail.com'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs Bar inside Admin Header */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
            <button
              id="admin-tab-dispatcher"
              onClick={() => setActiveAdminTab('dispatcher')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'dispatcher'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-indigo-100 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ Tura Odoji (Dispatcher)</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveAdminTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'orders'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-indigo-100 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>📦 Ododin Kasuwa (Orders)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                activeAdminTab === 'orders' ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
              }`}>
                {campaigns.length}
              </span>
            </button>

            <button
              id="admin-tab-users"
              onClick={() => setActiveAdminTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'users'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-indigo-100 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>👥 Users (Masu Amfani)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                activeAdminTab === 'users' ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
              }`}>
                {registeredUsers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body: Conditional by activeAdminTab */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: DISPATCHER */}
          {activeAdminTab === 'dispatcher' && (
            <>
              {/* Top Row: Peakerr Balance & Quick Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Peakerr Balance Card */}
                <div className="sm:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Asusun Peakerr (Live Wallet)</span>
                        <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          API Connected
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={fetchBalance}
                      disabled={isLoadingBalance}
                      className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/15 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Sabunta Kudin Peakerr"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                      <span>{isLoadingBalance ? 'Ana Dubawa...' : 'Sabunta'}</span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">
                      {balance !== null ? `$${balance}` : '$...'}
                    </span>
                    <span className="text-xs text-indigo-200 font-semibold">{currency}</span>
                  </div>
                  <p className="text-[11px] text-indigo-200 mt-1">
                    Wannan kudin zai riƙa raguwa ta atomatik duk lokacin da ka tura oda ga abokin ciniki.
                  </p>
                </div>

                {/* Total Orders Dispatched Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Odojin da Ka Tura</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {adminDispatchedOrders.length}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5 font-medium">Oda</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>An haɗa kai tsaye da sabar Peakerr</span>
                  </div>
                </div>

              </div>

              {/* Alert if an order was just dispatched */}
              {lastDispatchedOrder && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        Odar {lastDispatchedOrder.name} Ta Tafi Cikin Nasara! 🚀
                      </h4>
                      <p className="text-xs text-emerald-700 font-mono mt-0.5">
                        Peakerr Order ID: <span className="font-bold">#{lastDispatchedOrder.id}</span> (Ana tura followers ɗin a hankali)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLastDispatchedOrder(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition"
                  >
                    Rufe
                  </button>
                </div>
              )}

              {/* Two-Column Workspace: Left = Dispatch Form, Right = TikTok Checker & Profit Tool */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (7 cols): Direct Customer Order Dispatcher */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Tura Sabuwar Odar Abokin Ciniki (Dispatch Order)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Saka link ko username na mutumin da ya turo maka kudi ka tura masa nan take
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleDispatchOrder} className="space-y-4">
                    
                    {/* Platform & Action Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dandalin Sada Zumunta
                        </label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:border-indigo-600 outline-none"
                        >
                          <option value="tiktok">TikTok 🎵</option>
                          <option value="instagram">Instagram 📸</option>
                          <option value="facebook">Facebook 👍</option>
                          <option value="youtube">YouTube 📺</option>
                          <option value="twitter">Twitter / X 🐦</option>
                          <option value="website">Website Traffic 🌐</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nau'in Aiki (Service)
                        </label>
                        <select
                          value={actionType}
                          onChange={(e) => setActionType(e.target.value as BoostActionType)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:border-indigo-600 outline-none"
                        >
                          <option value="follow">Followers (Mabiya)</option>
                          <option value="like">Likes (Soyayya / Sha'awa)</option>
                          <option value="view">Views (Kallo)</option>
                          <option value="comment">Comments (Sharhi)</option>
                          <option value="share">Shares (Raba Bidiyo)</option>
                          <option value="subscribe">Subscribers (YouTube)</option>
                        </select>
                      </div>
                    </div>

                    {/* Target URL or Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Link ko Username na Abokin Ciniki <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://www.tiktok.com/@sunansa ko kuma @sunansa"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Misali: https://www.tiktok.com/@sulaimanapps2 ko https://instagram.com/sunansa
                      </p>
                    </div>

                    {/* Quantity & Amount Charged */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Adadin da Ya Nema (Quantity)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="10"
                            step="10"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value, 10) || 10))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none"
                          />
                        </div>
                        {/* Quick quantity chips */}
                        <div className="flex items-center gap-1 mt-1.5">
                          {[100, 250, 500, 1000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setQuantity(amt);
                                setAmountChargedNgn(amt === 100 ? 1500 : amt === 500 ? 3500 : amt === 1000 ? 6000 : 2500);
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                                quantity === amt 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {amt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kudin da Ya Biya Ka a Hannu (₦ Naira) <span className="text-slate-400 font-normal">(Na Zaɓi / Optional)</span>
                        </label>
                        <input
                          type="number"
                          step="50"
                          value={amountChargedNgn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAmountChargedNgn(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none"
                          placeholder="Misali: ₦1,500 (ko bar shi ba komai)"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Na zaɓi ne: idan kana son lissafin ribar da ka samu a aljihunka
                        </p>
                      </div>
                    </div>

                    {/* Profit Summary Banner */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                          Lissafin Ribarka a Wannan Aikin
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-700 mt-0.5">
                          <span>Peakerr zai caje ka: <strong className="text-slate-900 font-mono">${estimatedPeakerrCostUsd.toFixed(3)}</strong> (~₦{estimatedPeakerrCostNgn})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-700 font-bold block">Ribarka a Aljihu:</span>
                        <span className="text-base font-black text-emerald-600 font-mono">
                          +₦{estimatedProfitNgn.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Dispatch Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 active:scale-98 text-white font-extrabold text-sm py-3 px-4 rounded-2xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Ana Tura Oda Zuwa Peakerr...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                          <span>⚡ Tura Wannan Oda Nan Take (Dispatch to Peakerr)</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>

                {/* Right Column (5 cols): TikTok Live Checker & Tools */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Tool 1: Real-time TikTok Profile Follower Checker */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                        TT
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          Binciken Followers na TikTok (Live Checker)
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Duba adadin da mutum yake da shi a TikTok kafin ko bayan tura oda
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                          <input
                            type="text"
                            placeholder="sulaimanapps2"
                            value={checkUsername}
                            onChange={(e) => setCheckUsername(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-600 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleCheckTikTokFollowers}
                          disabled={checkingFollowers || !checkUsername}
                          className="bg-black hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {checkingFollowers ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                          <span>Duba</span>
                        </button>
                      </div>

                      {checkedFollowerCount !== null && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between animate-fadeIn">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Adadin Followers a Yanzu:</span>
                            <div className="text-xl font-black text-slate-900 font-mono">
                              {checkedFollowerCount.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setTargetUrl(`https://www.tiktok.com/@${checkUsername.replace(/^@/, '')}`);
                              addToast('info', 'An Saka a Fom', 'An saka wannan link din a fom din oda.');
                            }}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-xl transition"
                          >
                            Saka a Fom 👉
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tool 2: Admin Quick Tips */}
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span>Yadda Ake Amfani da Admin Panel</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
                      <li>
                        <strong>Idan mutum ya biya ka a WhatsApp ko banki:</strong> Karɓi link ɗinsa kawai, ka saka link ɗin da adadi, sannan ka danna <em>"Tura Wannan Oda"</em>.
                      </li>
                      <li>
                        <strong>Kada ka canja komai:</strong> Tsarin zai tura wa Peakerr kai tsaye, ya caje ka 'yan cents (₦150 - ₦200), kai kuma kana da ribarka ta Naira a aljihunka!
                      </li>
                      <li>
                        <strong>Bin diddigin aiki:</strong> Kowane aiki zai fito a kasan wannan allon tare da nuna yadda followers ke karuwa.
                      </li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* Bottom Section: Recent Admin Dispatched Orders */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Dukkan Odojin da Aka Tura (Dispatched Orders Log)
                    </h3>
                  </div>

                  <button
                    onClick={() => refreshLiveCampaignStatus(true)}
                    disabled={isSyncingOrders}
                    className="text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 active:scale-95 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin' : ''}`} />
                    <span>{isSyncingOrders ? 'Ana Sabuntawa...' : 'Sabunta Duka (Sync)'}</span>
                  </button>
                </div>

                {adminDispatchedOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-xs">Ba ka tura wata oda ta abokin ciniki ba tukunna.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminDispatchedOrders.map((ord) => {
                      const percent = ord.requiredCount > 0 
                        ? Math.min(100, Math.round((ord.deliveredCount / ord.requiredCount) * 100))
                        : 0;

                      return (
                        <div 
                          key={ord.id}
                          className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-indigo-300 transition"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {ord.platform}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                {ord.actionType}
                              </span>
                              {ord.peakerrOrderId && (
                                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  ⚡ Peakerr #{ord.peakerrOrderId}
                                </span>
                              )}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ord.status === 'completed' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-blue-100 text-blue-800 animate-pulse'
                              }`}>
                                {ord.providerStatus || (ord.status === 'completed' ? 'Completed' : 'In progress')}
                              </span>
                            </div>

                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {ord.title}
                            </h4>

                            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                              <a 
                                href={ord.targetUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:underline flex items-center gap-1 truncate max-w-[240px]"
                              >
                                <span>{ord.targetUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              {ord.amountPaidNgn && (
                                <span className="text-emerald-700 font-bold font-sans">
                                  (₦{ord.amountPaidNgn.toLocaleString()} Paid)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar & Numbers */}
                          <div className="sm:text-right shrink-0 min-w-[140px]">
                            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-900 mb-1">
                              <span className="font-mono text-indigo-600 font-extrabold">{ord.deliveredCount}</span>
                              <span className="text-slate-400">/</span>
                              <span className="font-mono">{ord.requiredCount}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({percent}%)</span>
                            </div>
                            <div className="w-full sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: ORDERS (ODODIN MASU SAYE DA PAYSTACK) */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Orders Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Jimillar Ododi</span>
                    <Package className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {campaigns.length}
                    </span>
                    <span className="text-xs text-indigo-300 font-medium">Orders a shafi</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kuɗin Paystack</span>
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                      ₦{campaigns.reduce((sum, c) => sum + (c.amountPaidNgn || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Followers & Likes Da Aka Tura</span>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      {campaigns.reduce((sum, c) => sum + (c.deliveredCount || 0), 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      / {campaigns.reduce((sum, c) => sum + (c.requiredCount || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search, Filter, & Live Refresh Controls */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Bincika oda da Link, Suna, Email, ko Ref (misali: tiktok.com, TB-TI-500874)..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition font-medium"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        orderStatusFilter === 'all'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Duka ({campaigns.length})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('running')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        orderStatusFilter === 'running'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Masu Aiki ({campaigns.filter(c => c.status !== 'completed' && c.deliveredCount < c.requiredCount).length})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        orderStatusFilter === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Kammalallu ({campaigns.filter(c => c.status === 'completed' || c.deliveredCount >= c.requiredCount).length})
                    </button>

                    <button
                      onClick={() => refreshLiveCampaignStatus(true)}
                      disabled={isSyncingOrders}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Sabunta Dukkan Ododi Daga Sabar & Peakerr"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Sabunta Live</span>
                    </button>
                  </div>
                </div>

                {/* Orders List Cards */}
                <div className="space-y-3 pt-2">
                  {campaigns
                    .filter((c) => {
                      const term = orderSearchTerm.toLowerCase().trim();
                      const matches = !term ||
                        c.title?.toLowerCase().includes(term) ||
                        c.targetUrl?.toLowerCase().includes(term) ||
                        c.orderRef?.toLowerCase().includes(term) ||
                        c.ownerEmail?.toLowerCase().includes(term) ||
                        c.ownerName?.toLowerCase().includes(term) ||
                        c.platform?.toLowerCase().includes(term);

                      const isDone = c.status === 'completed' || c.deliveredCount >= c.requiredCount;
                      if (orderStatusFilter === 'running') return matches && !isDone;
                      if (orderStatusFilter === 'completed') return matches && isDone;
                      return matches;
                    })
                    .map((camp, idx) => {
                      const progress = Math.min(100, Math.round(((camp.deliveredCount || 0) / (camp.requiredCount || 1)) * 100));
                      const isDone = camp.status === 'completed' || camp.deliveredCount >= camp.requiredCount;

                      return (
                        <div
                          key={camp.id || camp.orderRef || idx}
                          className="bg-slate-50/70 hover:bg-white border border-slate-200 rounded-2xl p-4 transition-all space-y-3 shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            
                            {/* Badges & Title */}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase">
                                  {camp.platform}
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                                  {camp.actionType}
                                </span>
                                {camp.orderRef && (
                                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                    {camp.orderRef}
                                  </span>
                                )}
                                {camp.peakerrOrderId && (
                                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                                    ⚡ Peakerr #{camp.peakerrOrderId}
                                  </span>
                                )}
                                {camp.amountPaidNgn ? (
                                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ₦{camp.amountPaidNgn.toLocaleString()} Paid (Paystack)
                                  </span>
                                ) : null}
                                {isDone ? (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                    Kammalallu ✅
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Yana Aiki (In Progress) ⚡
                                  </span>
                                )}
                              </div>

                              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                {camp.title}
                              </h4>

                              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                {camp.ownerName && (
                                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Mai Oda: {camp.ownerName} ({camp.ownerEmail || 'Paystack'})</span>
                                  </span>
                                )}
                                <a
                                  href={camp.targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1 font-mono"
                                >
                                  <span>{camp.targetUrl}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => refreshLiveCampaignStatus(true)}
                                disabled={isSyncingOrders}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Sabunta ci gaban wannan odar"
                              >
                                <RefreshCw className={`w-3 h-3 ${isSyncingOrders ? 'animate-spin' : ''}`} />
                                <span>Duba Ci Gaba</span>
                              </button>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1 pt-1.5 border-t border-slate-200/60">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                              <span>
                                An Tura: <strong className="text-emerald-700 font-bold">{camp.deliveredCount || 0}</strong> / {camp.requiredCount} ({camp.actionType})
                              </span>
                              <span className="font-bold text-indigo-700 font-mono">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USERS (MASU AMFANI) */}
          {activeAdminTab === 'users' && (
            <div className="space-y-6">
              
              {/* Users Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Jimillar Masu Amfani</span>
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {registeredUsers.length}
                    </span>
                    <span className="text-xs text-indigo-300">Registered Users</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dukkan mutanen da suka yi rajista a shafin</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Masu Matsayin Admin</span>
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {adminsCount}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">Masu Iko</span>
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium">
                    msngapps@gmail.com & malaminzaure2
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Membobin Shafi</span>
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {membersCount}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">Abokan Ciniki</span>
                  </div>
                  <div className="text-[11px] text-indigo-600 font-medium">
                    Suna amfani da sabis na TrendBoost
                  </div>
                </div>

              </div>

              {/* Search, Filter, & Refresh Tools */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Bincika mai amfani da suna ko email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition font-medium"
                    />
                  </div>

                  {/* Filter Pills & Sync Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setUserRoleFilter('all')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          userRoleFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Duka ({registeredUsers.length})
                      </button>
                      <button
                        onClick={() => setUserRoleFilter('admin')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          userRoleFilter === 'admin' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Admins ({adminsCount})
                      </button>
                      <button
                        onClick={() => setUserRoleFilter('user')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          userRoleFilter === 'user' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Members ({membersCount})
                      </button>
                    </div>

                    <button
                      onClick={async () => {
                        setIsSyncingUsers(true);
                        await refreshUsersList();
                        setIsSyncingUsers(false);
                      }}
                      disabled={isSyncingUsers}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Sabunta Jerin Masu Amfani"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingUsers ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Sabunta</span>
                    </button>
                  </div>

                </div>

                {/* Users List Cards */}
                <div className="space-y-3 pt-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500">Ba a sami wani mai amfani da ya dace da bincikenka ba.</p>
                      <button
                        onClick={() => { setUserSearchTerm(''); setUserRoleFilter('all'); }}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Duba Dukkan Masu Amfani
                      </button>
                    </div>
                  ) : (
                    filteredUsers.map((u, idx) => {
                      const isUserAdminRole = u.role === 'admin' || u.email.toLowerCase().includes('msngapps') || u.email.toLowerCase().includes('malaminzaure');
                      const avatarUrl = u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid || u.email}`;
                      const formattedDate = u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('ha-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Kwanan nan';

                      return (
                        <div
                          key={u.uid || u.email || idx}
                          className="bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
                        >
                          {/* User Avatar & Info */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={avatarUrl}
                                alt={u.displayName}
                                className="w-11 h-11 rounded-2xl object-cover bg-indigo-100 border border-slate-200 shadow-2xs"
                              />
                              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                  {u.displayName || 'Bako Mai Amfani'}
                                </h4>

                                {isUserAdminRole ? (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                    👑 Super Admin
                                  </span>
                                ) : (
                                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-indigo-600" />
                                    {u.boosterTier || 'Active Member'}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 font-medium flex-wrap">
                                <span className="flex items-center gap-1 text-slate-700 font-mono">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{u.email}</span>
                                </span>
                                
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar className="w-3 h-3" />
                                  <span>Shiga: {formattedDate}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                            
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Coins Balance:</span>
                              <span className="font-black text-xs text-amber-600 font-mono flex items-center gap-1 sm:justify-end">
                                <Coins className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {(u.credits || 0).toLocaleString()} Coins
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Copy Email Button */}
                              <button
                                onClick={() => copyToClipboard(u.email, `email-${idx}`)}
                                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 transition cursor-pointer text-xs font-semibold"
                                title="Kwafi Email"
                              >
                                {copiedId === `email-${idx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Dispatch Order to this User Shortcut */}
                              <button
                                onClick={() => {
                                  setActiveAdminTab('dispatcher');
                                  setTargetUrl(`@${u.displayName.replace(/\s+/g, '').toLowerCase()}`);
                                  addToast('info', 'An Zaɓi Mai Amfani', `An saka @${u.displayName} a allon tura oda.`);
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                                <span>Tura Masa Oda</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kariyar Tsaron Admin tana aiki. Kai kaɗai ne ke ganin wannan allon.</span>
          </div>
          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Rufe Allon Admin
          </button>
        </div>

      </div>
    </div>
  );
};
