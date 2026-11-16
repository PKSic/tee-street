import React, { useState } from 'react';
import {
  X,
  Mail,
  User as UserIcon,
  Shield,
  Sparkles,
  Package,
  RotateCcw,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Search,
  Copy,
  Check,
  Store,
  CreditCard,
  QrCode,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { User, Locale, Order } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (u: User) => void;
  onLogout: () => void;
  locale: Locale;
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  orders,
  onUpdateOrder,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'auth'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Форма авторизации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  // Форма редактирования профиля
  const [editName, setEditName] = useState(currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : 'Владислав Озеров');
  const [editBirthDate, setEditBirthDate] = useState(currentUser?.birth_date || '1998-07-24');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+7 (999) 420-20-26');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'vlad@cyberdrop.ru');
  const [editAddress, setEditAddress] = useState(currentUser?.address || 'г. Москва, Пресненская наб., д. 12, оф. 45');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Фильтр заказов
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered' | 'returned'>('all');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedTrack, setCopiedTrack] = useState<string | null>(null);

  // Модалка оформления возврата
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Не подошел размер (слишком большой оверсайз)');
  const [returnMethod, setReturnMethod] = useState<'pvz' | 'courier'>('pvz');
  const [returnPhone, setReturnPhone] = useState(currentUser?.phone || '+7 (999) 420-20-26');
  const [returnComment, setReturnComment] = useState('');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleDemoAdmin = () => {
    onLogin({
      id: 'usr-admin-0001',
      email: 'admin@test-tee.ru',
      first_name: 'Александр',
      last_name: 'Шеф',
      role: 'admin',
      phone: '+7 (495) 000-42-42',
      birth_date: '1990-01-15',
      address: 'г. Москва, ул. Дизайнеров, 42',
    });
  };

  const handleDemoUser = () => {
    onLogin({
      id: 'usr-client-0003',
      email: 'vlad@cyberdrop.ru',
      first_name: 'Владислав',
      last_name: 'Озеров',
      role: 'user',
      phone: '+7 (999) 420-20-26',
      birth_date: '1998-07-24',
      address: 'г. Москва, Пресненская наб., д. 12, оф. 45',
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = editName.trim().split(' ');
    const updated: User = {
      id: currentUser ? currentUser.id : `usr-${Math.random().toString(36).substring(2, 9)}`,
      first_name: parts[0] || 'Владислав',
      last_name: parts.slice(1).join(' ') || '',
      email: editEmail,
      phone: editPhone,
      birth_date: editBirthDate,
      address: editAddress,
      role: currentUser ? currentUser.role : 'user',
    };
    if (onUpdateUser) onUpdateUser(updated);
    onLogin(updated);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = firstName.trim().split(' ');
    onLogin({
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      email: email || 'vlad@cyberdrop.ru',
      first_name: parts[0] || 'Владислав',
      last_name: parts.slice(1).join(' ') || 'Озеров',
      phone: phone || '+7 (999) 420-20-26',
      role: 'user',
    });
    setActiveTab('orders');
  };

  const handleCopyTrack = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedTrack(num);
    setTimeout(() => setCopiedTrack(null), 2000);
  };

  // Отправка заявки на возврат товара
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningOrder) return;

    const updated: Order = {
      ...returningOrder,
      status: 'return_requested',
      return_status: 'requested',
      return_reason: returnReason,
      return_comment: returnComment,
      return_requested_at: new Date().toISOString(),
      refund_amount: returningOrder.grand_total,
    };

    onUpdateOrder(updated);
    setReturnSuccessMsg(true);

    setTimeout(() => {
      setReturnSuccessMsg(false);
      setReturningOrder(null);
    }, 1800);
  };

  // Эмуляция завершения возврата (выплата средств)
  const handleSimulateRefundComplete = (order: Order) => {
    const updated: Order = {
      ...order,
      status: 'returned',
      return_status: 'refunded',
      current_location: 'Возврат принят складом. Средства выплачены получателю через СБП.',
    };
    onUpdateOrder(updated);
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter((o) => {
    if (searchOrderNumber.trim()) {
      const q = searchOrderNumber.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        (o.tracking_number && o.tracking_number.toLowerCase().includes(q))
      );
    }
    if (orderFilter === 'active') {
      return ['pending_payment', 'paid', 'confirmed', 'processing', 'shipped', 'ready_for_pickup'].includes(o.status);
    }
    if (orderFilter === 'delivered') {
      return o.status === 'delivered' || o.status === 'completed';
    }
    if (orderFilter === 'returned') {
      return o.status === 'return_requested' || o.status === 'returned';
    }
    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Ожидает оплаты
          </span>
        );
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#00E6FF]/15 border border-[#00E6FF]/30 text-[#00E6FF] text-[11px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(0,230,255,0.2)]">
            <CheckCircle className="w-3 h-3" />
            Оплачен (СБП)
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1">
            <Package className="w-3 h-3" />
            В сборке на складе
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#00E6FF]/20 border border-[#00E6FF]/40 text-[#00E6FF] text-[11px] font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(0,230,255,0.3)] animate-pulse">
            <Truck className="w-3 h-3" />
            В пути / СДЭК
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#9BD746]/15 border border-[#9BD746]/30 text-[#9BD746] text-[11px] font-bold flex items-center gap-1">
            <Store className="w-3 h-3" />
            Готов к выдаче в ПВЗ
          </span>
        );
      case 'delivered':
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#9BD746]/20 border border-[#9BD746]/40 text-[#9BD746] text-[11px] font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(155,215,70,0.3)]">
            <CheckCircle className="w-3 h-3" />
            Доставлен
          </span>
        );
      case 'return_requested':
        return (
          <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-bold flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Запрошен возврат
          </span>
        );
      case 'returned':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#FF286E]/20 border border-[#FF286E]/40 text-[#FF286E] text-[11px] font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Возврат завершен
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-500/15 border border-slate-500/30 text-slate-300 text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  const getTrackingProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment':
        return 10;
      case 'paid':
      case 'confirmed':
        return 30;
      case 'processing':
        return 50;
      case 'shipped':
        return 75;
      case 'ready_for_pickup':
        return 90;
      case 'delivered':
      case 'completed':
        return 100;
      case 'return_requested':
      case 'returned':
        return 100;
      default:
        return 20;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-[#130724] border border-[#00E6FF]/30 text-white shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden z-10 max-h-[94vh] flex flex-col">
        {/* Верхняя шапка профиля */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#00E6FF]/40 shadow-[0_0_20px_rgba(0,230,255,0.4)] shrink-0 bg-[#0B0314] flex items-center justify-center">
              {currentUser ? (
                <div className="w-full h-full bg-gradient-to-br from-[#00E6FF] via-[#7B2CBF] to-[#FF286E] flex items-center justify-center text-[#0B0314] font-black text-lg">
                  {currentUser.first_name[0]}
                </div>
              ) : (
                <img src="/logo.png" alt="TEE STREET" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl text-white">
                  {currentUser ? `${currentUser.first_name} ${currentUser.last_name || ''}` : 'Личный кабинет'}
                </h2>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-[#00E6FF]/15 border border-[#00E6FF]/30 text-[10px] font-mono text-[#00E6FF]">
                    {currentUser.role === 'admin' ? 'Администратор' : 'Cyber Club'}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                {currentUser ? currentUser.email : 'Управление заказами, трекинг и возвраты'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentUser && (
              <button
                onClick={() => {
                  onLogout();
                  setActiveTab('auth');
                }}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 hover:bg-red-500/20 text-xs font-semibold cursor-pointer transition-colors"
              >
                Выйти
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Навигационные вкладки */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Мои заказы</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'orders' ? 'bg-[#0B0314] text-[#00E6FF]' : 'bg-white/10 text-slate-300'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Данные профиля</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'auth'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Аккаунты & Демо</span>
          </button>
        </div>

        {/* Тело модалки со скроллом */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 no-scrollbar space-y-4">
          {/* ================= ВКЛАДКА: МОИ ЗАКАЗЫ ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Фильтры и быстрый поиск по номеру заказа */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      orderFilter === 'all'
                        ? 'bg-[#00E6FF]/20 border border-[#00E6FF] text-[#00E6FF]'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Все ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      orderFilter === 'active'
                        ? 'bg-[#00E6FF]/20 border border-[#00E6FF] text-[#00E6FF]'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    В пути
                  </button>
                  <button
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      orderFilter === 'delivered'
                        ? 'bg-[#00E6FF]/20 border border-[#00E6FF] text-[#00E6FF]'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Доставленные
                  </button>
                  <button
                    onClick={() => setOrderFilter('returned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      orderFilter === 'returned'
                        ? 'bg-[#00E6FF]/20 border border-[#00E6FF] text-[#00E6FF]'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Возвраты
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchOrderNumber}
                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                    placeholder="Поиск по номеру заказа..."
                    className="w-full sm:w-60 px-3 py-1.5 pl-8 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E6FF]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Список заказов */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5">
                  <Package className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                  <div className="text-sm font-bold text-slate-300">Заказы не найдены</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Оформите свой первый оверсайз-дроп в каталоге, и он появится здесь с трекингом!
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const canReturn =
                      order.status === 'delivered' ||
                      order.status === 'completed' ||
                      order.status === 'shipped' ||
                      order.status === 'paid';
                    const hasReturn = order.return_status === 'requested' || order.status === 'return_requested';
                    const isRefunded = order.return_status === 'refunded' || order.status === 'returned';

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-[#1B0B33]/80 border border-white/10 hover:border-[#00E6FF]/30 transition-all overflow-hidden p-4 sm:p-5 space-y-4"
                      >
                        {/* Верхняя полоса заказа */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#00E6FF]/10 border border-[#00E6FF]/30 flex items-center justify-center text-[#00E6FF] shrink-0 font-mono font-bold text-xs">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-white">
                                  #{order.order_number}
                                </span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Дата: {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="text-right">
                              <div className="text-xs text-slate-400">Сумма заказа</div>
                              <div className="font-mono font-black text-base text-[#00E6FF]">
                                {order.grand_total.toLocaleString()} ₽
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                              title="Развернуть детали"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* ТРЕКИНГ: «ГДЕ ТОВАР СЕЙЧАС» И «КОГДА ПРИДЕТ» */}
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                          {/* Визуальная шкала доставки */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-[#00E6FF]" />
                                Статус доставки:
                              </span>
                              <span className="font-mono text-[11px] text-[#00E6FF]">
                                {order.current_location || 'В обработке логистического хаба'}
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-[#00E6FF] via-[#7B2CBF] to-[#9BD746] transition-all duration-500"
                                style={{ width: `${getTrackingProgress(order.status)}%` }}
                              />
                            </div>

                            <div className="grid grid-cols-4 text-[10px] text-slate-400 pt-1.5 font-medium">
                              <span>1. Оформлен</span>
                              <span className="text-center">2. Сборка</span>
                              <span className="text-center">3. В пути</span>
                              <span className="text-right text-[#9BD746]">4. Доставлен</span>
                            </div>
                          </div>

                          {/* Блок «Когда придет» и гео-локация */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-[#9BD746] shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold text-white">Когда придет:</div>
                                <div className="text-slate-300 text-[11px]">
                                  {order.estimated_delivery || '18 ноября 2026, 12:00 - 18:00'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-[#00E6FF] shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <div className="font-bold text-white">
                                  {order.delivery_type === 'pickup' ? 'Где забрать (ПВЗ / Шоурум):' : 'Адрес доставки:'}
                                </div>
                                <div className="text-slate-300 text-[11px] truncate" title={order.delivery_address || order.pickup_point_info}>
                                  {order.delivery_address || order.pickup_point_info || 'г. Москва, Пресненская наб., д. 12'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Трек-номер */}
                          {order.tracking_number && (
                            <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                              <span>Трек-номер курьера / СДЭК:</span>
                              <button
                                onClick={() => handleCopyTrack(order.tracking_number!)}
                                className="inline-flex items-center gap-1.5 font-mono text-[#00E6FF] hover:underline cursor-pointer"
                              >
                                {order.tracking_number}
                                {copiedTrack === order.tracking_number ? (
                                  <Check className="w-3.5 h-3.5 text-[#9BD746]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ТОВАРЫ В ЗАКАЗЕ */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-400">Товары в заказе:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {order.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                              >
                                <div className="w-12 h-12 rounded-lg bg-[#2D0F4B]/50 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                  {it.image_url ? (
                                    <img
                                      src={it.image_url}
                                      alt={it.product_name_snapshot}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-[#00E6FF]" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs text-white truncate">
                                    {it.product_name_snapshot}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    <span>Размер: <strong className="text-white">{it.size_snapshot}</strong></span>
                                    <span>•</span>
                                    <span>{it.quantity} шт.</span>
                                  </div>
                                  <div className="font-mono text-xs text-[#00E6FF] font-bold">
                                    {it.line_total.toLocaleString()} ₽
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* БЛОК ВОЗВРАТА ТОВАРА */}
                        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {hasReturn ? (
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-200 flex-1 flex items-start gap-2.5">
                              <RotateCcw className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <div className="font-bold text-white">Заявка на возврат зарегистрирована!</div>
                                <div className="text-[11px] text-slate-300">
                                  Причина: {order.return_reason || 'Не подошел размер'}. Сумма {order.grand_total} ₽ будет возвращена по СБП в течение 1-3 рабочих дней после проверки на складе.
                                </div>
                                <button
                                  onClick={() => handleSimulateRefundComplete(order)}
                                  className="mt-1 text-[11px] text-[#00E6FF] hover:underline font-bold"
                                >
                                  [Тест]: Завершить возврат и выплатить средства
                                </button>
                              </div>
                            </div>
                          ) : isRefunded ? (
                            <div className="p-3 rounded-xl bg-[#9BD746]/10 border border-[#9BD746]/30 text-xs text-[#9BD746] flex-1 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#9BD746]" />
                              <span>Возврат завершен. Денежные средства ({order.grand_total} ₽) переведены получателю через СБП.</span>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#00E6FF]" />
                              <span>14 дней на примерку и легкий возврат без бумаг</span>
                            </div>
                          )}

                          {canReturn && !hasReturn && !isRefunded && (
                            <button
                              onClick={() => setReturningOrder(order)}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#FF286E]/20 hover:border-[#FF286E]/40 border border-white/15 text-xs font-bold text-slate-200 hover:text-[#FF286E] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Сделать возврат товара
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= ВКЛАДКА: ДАННЫЕ ПРОФИЛЯ ================= */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[#00E6FF]/10 border border-[#00E6FF]/25 text-xs text-[#00E6FF] flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#00E6FF] shrink-0" />
                <span>Данные автоматически подставляются при оформлении заказа и возвратах.</span>
              </div>

              {profileSavedMsg && (
                <div className="p-3.5 rounded-xl bg-[#9BD746]/20 border border-[#9BD746]/40 text-[#9BD746] text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Данные профиля успешно сохранены!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ФИО получателя
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00E6FF]" />
                      Дата рождения
                    </label>
                    <input
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#00E6FF]" />
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#00E6FF]" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00E6FF]" />
                    Адрес доставки по умолчанию
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="г. Москва, Пресненская наб., д. 12, оф. 45"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer transition-all"
                >
                  Сохранить изменения
                </button>
              </form>
            </div>
          )}

          {/* ================= ВКЛАДКА: АККАУНТЫ & ДЕМО ================= */}
          {activeTab === 'auth' && (
            <div className="max-w-md mx-auto space-y-5">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-[#00E6FF] text-[#0B0314]' : 'text-slate-400'
                  }`}
                >
                  Вход
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'register' ? 'bg-[#00E6FF] text-[#0B0314]' : 'text-slate-400'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">ФИО</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Владислав Озеров"
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vlad@cyberdrop.ru"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Пароль</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110"
                >
                  {authMode === 'login' ? 'Войти в профиль' : 'Зарегистрироваться'}
                </button>
              </form>

              {/* Быстрый демо-вход */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[11px] text-slate-400 uppercase font-mono text-center">
                  Быстрый демо-вход:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDemoUser}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200"
                  >
                    Покупатель
                  </button>
                  <button
                    onClick={handleDemoAdmin}
                    className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold text-purple-300"
                  >
                    Администратор
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= МОДАЛЬНОЕ ОКНО ОФОРМЛЕНИЯ ВОЗВРАТА ТОВАРА ================= */}
      {returningOrder && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#15072B] border border-[#FF286E]/40 p-4 sm:p-7 shadow-2xl text-white space-y-4 relative max-h-[94vh] overflow-y-auto">
            <button
              onClick={() => setReturningOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF286E]/20 border border-[#FF286E]/40 flex items-center justify-center text-[#FF286E]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  Оформление возврата #{returningOrder.order_number}
                </h3>
                <div className="text-xs text-slate-400">
                  Сумма к возврату: <strong className="text-[#00E6FF] font-mono">{returningOrder.grand_total} ₽</strong>
                </div>
              </div>
            </div>

            {returnSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#9BD746]/20 border border-[#9BD746]/40 flex items-center justify-center text-[#9BD746] mx-auto shadow-[0_0_20px_rgba(155,215,70,0.4)]">
                  <Check className="w-7 h-7" />
                </div>
                <div className="font-display font-black text-lg text-white">Заявка на возврат принята!</div>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Код возврата отправлен по СМС. Вы можете сдать товар в любой ПВЗ СДЭК без коробки и чека.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Причина возврата товара:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E0C38] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF286E]"
                  >
                    <option value="Не подошел размер (слишком большой оверсайз)">
                      Не подошел размер (слишком большой оверсайз)
                    </option>
                    <option value="Не подошел размер (маломерит)">
                      Не подошел размер (маломерит)
                    </option>
                    <option value="Производственный брак / дефект ткани или принта">
                      Производственный брак / дефект ткани или принта
                    </option>
                    <option value="Не понравился фасон или цвет вживую">
                      Не понравился фасон или цвет вживую
                    </option>
                    <option value="Ошибочный заказ">
                      Ошибочный заказ
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Удобный способ возврата:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReturnMethod('pvz')}
                      className={`p-3 rounded-xl text-left border text-xs cursor-pointer ${
                        returnMethod === 'pvz'
                          ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">Пункт СДЭК (Бесплатно)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">В любом из 5000+ ПВЗ по коду</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnMethod('courier')}
                      className={`p-3 rounded-xl text-left border text-xs cursor-pointer ${
                        returnMethod === 'courier'
                          ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">Вызов курьера</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Курьер заберет от двери</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Номер телефона для возврата средств по СБП:
                  </label>
                  <input
                    type="tel"
                    required
                    value={returnPhone}
                    onChange={(e) => setReturnPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF286E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Комментарий (необязательно):
                  </label>
                  <textarea
                    rows={2}
                    value={returnComment}
                    onChange={(e) => setReturnComment(e.target.value)}
                    placeholder="Опишите подробнее причину возврата..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF286E]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-white">Правила возврата:</div>
                  <div>• Товар должен сохранить первоначальный товарный вид и бирки.</div>
                  <div>• Деньги возвращаются в течение 1-3 рабочих дней после поступления товара на склад.</div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturningOrder(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF286E] to-[#7B2CBF] text-white font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Подтвердить возврат
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
