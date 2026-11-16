import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Calendar,
  Phone,
  User as UserIcon,
  Store,
  Check,
  Building,
} from 'lucide-react';
import type { CartItem, PromoCode, ShippingMethod, PickupPoint, Locale, Order } from '../types';
import { translations } from '../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: PromoCode | null;
  shippingMethods: ShippingMethod[];
  pickupPoints: PickupPoint[];
  onOrderSuccess: (orderData: Order) => void;
  locale: Locale;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  shippingMethods,
  pickupPoints,
  onOrderSuccess,
  locale,
}) => {
  const t = translations[locale].checkout;
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Шаг 1: Контактные данные получателя
  const [fullName, setFullName] = useState('Владислав Озеров');
  const [birthDate, setBirthDate] = useState('1998-07-24');
  const [phone, setPhone] = useState('+7 (999) 420-20-26');
  const [email, setEmail] = useState('vlad@cyberdrop.ru');

  // Шаг 2: Доставка или самовывоз
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(shippingMethods[0]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint>(pickupPoints[0]);

  // Адрес для курьерской доставки
  const [city, setCity] = useState('Москва');
  const [streetAddress, setStreetAddress] = useState('Пресненская наб., д. 12');
  const [apartment, setApartment] = useState('оф. 45');
  const [intercom, setIntercom] = useState('код 45K');
  const [comment, setComment] = useState('Позвонить за 30 минут');

  // Шаг 3: Оплата
  const [paymentMethod, setPaymentMethod] = useState<'online_card' | 'sbp' | 'cash_on_delivery'>('sbp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // СБП модалка
  const [showSbpModal, setShowSbpModal] = useState(false);
  const [checkingSbp, setCheckingSbp] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);

  let discountAmount = 0;
  if (appliedPromo && subtotal >= appliedPromo.min_order_amount) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
      if (appliedPromo.max_discount && discountAmount > appliedPromo.max_discount) {
        discountAmount = appliedPromo.max_discount;
      }
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const isFreeShipping = subtotal - discountAmount >= (shippingMethod.free_from_amount || 5000);
  const shippingCost = isFreeShipping ? 0 : shippingMethod.base_price;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const isPickup = shippingMethod.type === 'pickup';
  const fullDeliveryAddress = isPickup
    ? `${selectedPickupPoint.name} (${selectedPickupPoint.address.city}, ${selectedPickupPoint.address.street}, ${selectedPickupPoint.address.building})`
    : `г. ${city}, ${streetAddress}${apartment ? `, кв./оф. ${apartment}` : ''}${intercom ? ` (домофон: ${intercom})` : ''}`;

  const createOrderObject = (finalStatus: Order['status'], finalPayment: 'online_card' | 'sbp' | 'cash_on_delivery'): Order => {
    const orderNumber = pendingOrderNumber || `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomTrack = `CDEK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    return {
      id: `ord-${Math.random().toString(36).substring(2, 9)}`,
      order_number: orderNumber,
      guest_access_token: `gst_${Math.random().toString(36).substring(2, 15)}`,
      status: finalStatus,
      subtotal,
      discount_total: discountAmount,
      shipping_total: shippingCost,
      grand_total: grandTotal,
      created_at: new Date().toISOString(),
      recipient_name: fullName,
      recipient_birth_date: birthDate,
      guest_email: email,
      guest_phone: phone,
      payment_method: finalPayment,
      shipping_method_name: shippingMethod.name,
      delivery_type: isPickup ? 'pickup' : 'delivery',
      delivery_address: isPickup ? undefined : fullDeliveryAddress,
      pickup_point_info: isPickup ? fullDeliveryAddress : undefined,
      pickup_point_id: isPickup ? selectedPickupPoint.id : undefined,
      tracking_number: randomTrack,
      current_location: isPickup
        ? `Ожидает поступления в ${selectedPickupPoint.name}`
        : 'Сортировочный центр СДЭК Москва-Юг (в обработке)',
      estimated_delivery: isPickup
        ? 'Готов к выдаче через 1-2 дня'
        : 'Ориентировочно через 2 дня, 12:00 - 18:00',
      return_status: 'none',
      items: items.map((i) => ({
        product_name_snapshot: i.product.name,
        sku_snapshot: `${i.product.model_sku}-${i.size.code}`,
        size_snapshot: i.size.code,
        color_snapshot: i.color.name,
        unit_price: i.unit_price,
        quantity: i.quantity,
        line_total: i.line_total,
        image_url: (i.product.images_by_color && i.product.images_by_color[i.color.code]) || i.product.image_url,
      })),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Если выбрана оплата через СБП — открываем модалку с реальным QR-кодом СБП
    if (paymentMethod === 'sbp') {
      const num = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
      setPendingOrderNumber(num);
      setShowSbpModal(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderData = createOrderObject(
        paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'paid',
        paymentMethod
      );
      setIsSubmitting(false);
      onOrderSuccess(orderData);
    }, 600);
  };

  const handleConfirmSbp = () => {
    if (checkingSbp) return;
    setCheckingSbp(true);

    setTimeout(() => {
      setCheckingSbp(false);
      setShowSbpModal(false);
      const orderData = createOrderObject('paid', 'sbp');
      onOrderSuccess(orderData);
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-4">
        <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

        <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#140726] border border-[#00E6FF]/30 text-white shadow-2xl p-4 sm:p-7 md:p-8 overflow-hidden z-10 max-h-[94vh] flex flex-col">
          {/* Шапка модалки */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E6FF] to-[#7B2CBF] flex items-center justify-center text-[#0B0314] font-black shadow-[0_0_15px_rgba(0,230,255,0.4)]">
                <CheckCircle className="w-5 h-5 text-[#0B0314]" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-wide">
                  Оформление заказа
                </h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  {items.length} поз. на сумму {grandTotal.toLocaleString()} ₽
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Индикатор шагов */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 sm:py-4 shrink-0 text-[11px] sm:text-xs font-bold text-center border-b border-white/5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                step === 1
                  ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden min-[380px]:inline">1. Получатель</span>
              <span className="min-[380px]:hidden">1. Данные</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                step === 2
                  ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden min-[380px]:inline">2. Доставка</span>
              <span className="min-[380px]:hidden">2. Адрес</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                step === 3
                  ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>3. Оплата</span>
            </button>
          </div>

          {/* Тело формы со скроллом */}
          <div className="flex-1 overflow-y-auto py-5 pr-1 no-scrollbar">
            <form id="checkout-form" onSubmit={handleSubmit}>
              {/* ШАГ 1: ДАННЫЕ ПОЛУЧАТЕЛЯ */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#00E6FF]/10 border border-[#00E6FF]/25 text-xs text-[#00E6FF] flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 text-[#00E6FF]" />
                    <span>Укажите актуальные данные получателя для выдачи посылки и трекинга.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-[#00E6FF]" />
                      ФИО получателя *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Иванов Владислав Сергеевич"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00E6FF]" />
                        Дата рождения *
                      </label>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#00E6FF]" />
                        Номер телефона *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (999) 000-00-00"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Email для чека *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vlad@cyberdrop.ru"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00E6FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName.trim() || !phone.trim() || !birthDate || !email.trim()) {
                          alert('Пожалуйста, заполните все поля получателя (ФИО, дата рождения, номер телефона, email).');
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer transition-all"
                    >
                      Далее к способу доставки
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ШАГ 2: ДОСТАВКА ИЛИ САМОВЫВОЗ */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Выберите способ получения:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {shippingMethods.map((sm) => {
                        const isSelected = shippingMethod.id === sm.id;
                        const isSmFree = subtotal - discountAmount >= sm.free_from_amount;
                        return (
                          <button
                            key={sm.id}
                            type="button"
                            onClick={() => setShippingMethod(sm)}
                            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-[0_0_15px_rgba(0,230,255,0.2)]'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-xs mb-1">
                              <span className="flex items-center gap-1.5">
                                {sm.type === 'pickup' ? (
                                  <Store className="w-3.5 h-3.5 text-[#00E6FF]" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5 text-[#9BD746]" />
                                )}
                                {sm.name}
                              </span>
                              <span className="font-mono text-[#00E6FF]">
                                {isSmFree ? 'Бесплатно' : `${sm.base_price} ₽`}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {sm.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ЕСЛИ САМОВЫВОЗ: ИНТЕРАКТИВНЫЙ ВЫБОР ПУНКТА ГДЕ ЗАБРАТЬ */}
                  {isPickup ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-[#00E6FF]" />
                          Выберите пункт самовывоза (где забрать заказ):
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {pickupPoints.length} доступных пунктов
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pickupPoints.map((pp) => {
                          const isSelectedPoint = selectedPickupPoint.id === pp.id;
                          return (
                            <div
                              key={pp.id}
                              onClick={() => setSelectedPickupPoint(pp)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelectedPoint
                                  ? 'bg-[#00E6FF]/15 border-[#00E6FF] shadow-[0_0_20px_rgba(0,230,255,0.25)] text-white'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="font-bold text-xs text-white">
                                    {pp.name}
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                      isSelectedPoint
                                        ? 'bg-[#00E6FF] border-[#00E6FF] text-[#0B0314]'
                                        : 'border-white/20 text-transparent'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                                <div className="text-[11px] text-slate-300 flex items-center gap-1 mb-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#00E6FF] shrink-0" />
                                  <span>
                                    {pp.address.city}, {pp.address.street}, д. {pp.address.building}
                                    {pp.address.metro ? ` (${pp.address.metro})` : ''}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                                  {pp.instructions}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {pp.opening_hours.daily}
                                </span>
                                <span className="text-[#9BD746] font-bold">Готов через 1-2 дня</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* ЕСЛИ ДОСТАВКА КУРЬЕРОМ: ВВОД АДРЕСА ДОСТАВКИ */
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <MapPin className="w-4 h-4 text-[#00E6FF]" />
                        Адрес доставки (до двери):
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Город доставки *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Москва"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E6FF]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Улица, дом, корпус/строение *
                          </label>
                          <input
                            type="text"
                            required
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="Пресненская наб., д. 12"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E6FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Квартира / офис
                          </label>
                          <input
                            type="text"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            placeholder="оф. 45"
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E6FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Домофон / подъезд
                          </label>
                          <input
                            type="text"
                            value={intercom}
                            onChange={(e) => setIntercom(e.target.value)}
                            placeholder="код 45K, 2 подъезд"
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E6FF]"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Срок доставки
                          </label>
                          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-[#00E6FF] font-mono">
                            1-2 рабочих дня
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPickup && (!city.trim() || !streetAddress.trim())) {
                          alert('Пожалуйста, укажите город и улицу с номером дома для курьерской доставки.');
                          return;
                        }
                        setStep(3);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer transition-all"
                    >
                      Далее к оплате
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ШАГ 3: ВЫБОР ОПЛАТЫ И ИТОГИ */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Способ оплаты заказа:
                    </label>
                    <div className="space-y-2.5">
                      {/* ОПЛАТА СБП */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('sbp')}
                        className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === 'sbp'
                            ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-[0_0_20px_rgba(0,230,255,0.25)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0297DE] to-[#FC734D] flex items-center justify-center text-white shrink-0 shadow-md">
                            <QrCode className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-xs flex items-center gap-2">
                              <span>Оплата через СБП (Система Быстрых Платежей)</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#0297DE]/30 border border-[#0297DE]/50 text-[10px] text-[#7DD3FC] font-semibold">
                                Рекомендуем
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Оплата по QR-коду в приложении Т-Банк, Сбер, Альфа, ВТБ и др. без комиссии
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#00E6FF] font-bold shrink-0">
                          0% комиссии
                        </span>
                      </button>

                      {/* КАРТА */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('online_card')}
                        className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === 'online_card'
                            ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-[0_0_20px_rgba(0,230,255,0.25)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs">Банковская карта (МИР, Visa, Mastercard)</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Безопасный 3D-Secure эквайринг
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-purple-400 font-bold shrink-0">
                          Онлайн
                        </span>
                      </button>

                      {/* ПРИ ПОЛУЧЕНИИ */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash_on_delivery')}
                        className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === 'cash_on_delivery'
                            ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-white shadow-[0_0_20px_rgba(0,230,255,0.25)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#9BD746]/20 border border-[#9BD746]/40 flex items-center justify-center text-[#9BD746] shrink-0">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs">При получении (наличные или карта)</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Оплата курьеру или в ПВЗ после примерки
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#9BD746] font-bold shrink-0">
                          После примерки
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Комментарий к заказу
                    </label>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Позвонить за 30 минут, оставить у консьержа..."
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E6FF]"
                    />
                  </div>

                  {/* Итоговая сводка заказа */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Получатель:</span>
                      <span className="text-white font-medium">{fullName} ({phone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Способ получения:</span>
                      <span className="text-white font-medium">{shippingMethod.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Куда:</span>
                      <span className="text-[#00E6FF] max-w-xs text-right truncate">
                        {fullDeliveryAddress}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between">
                      <span>Сумма товаров ({items.length} шт.):</span>
                      <span className="font-mono text-white">{subtotal.toLocaleString()} ₽</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#00E6FF]">
                        <span>Скидка по промокоду {appliedPromo?.code}:</span>
                        <span className="font-mono">-{discountAmount.toLocaleString()} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Доставка:</span>
                      <span className="font-mono text-white">
                        {shippingCost === 0 ? 'Бесплатно' : `${shippingCost} ₽`}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-white/10 flex justify-between items-baseline text-white">
                      <span className="font-display font-bold text-sm">Итого к оплате:</span>
                      <span className="font-display font-black text-2xl text-[#00E6FF] shadow-sm">
                        {grandTotal.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-2xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(0,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Оформление заказа...
                        </>
                      ) : paymentMethod === 'sbp' ? (
                        <>
                          <QrCode className="w-4 h-4" />
                          Оплатить через СБП ({grandTotal.toLocaleString()} ₽)
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Подтвердить заказ ({grandTotal.toLocaleString()} ₽)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ================= МОДАЛЬНОЕ ОКНО ОПЛАТЫ ЧЕРЕЗ СБП (КАК В ПРЕДЫДУЩЕМ ПРОЕКТЕ) ================= */}
      {showSbpModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-3xl bg-[#120722] p-5 sm:p-7 shadow-2xl text-white space-y-4 sm:space-y-5 relative max-h-[92vh] overflow-y-auto"
            style={{
              border: '1.5px solid rgba(0, 230, 255, 0.45)',
              boxShadow: '0 0 50px rgba(0, 230, 255, 0.25), 0 0 80px rgba(123, 44, 191, 0.2)',
            }}
          >
            <button
              disabled={checkingSbp}
              onClick={() => setShowSbpModal(false)}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Логотип и бейдж СБП */}
            <div className="flex items-center justify-between pr-8 sm:pr-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00E6FF]/40 shadow-sm shrink-0 bg-[#0B0314]">
                  <img src="/logo.png" alt="TEE STREET" className="w-full h-full object-cover" />
                </div>
                <div className="font-display font-black text-base text-white tracking-wider">
                  TEE STREET<span className="text-[#00E6FF]">.</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#0297DE]/20 border border-[#0297DE]/40 text-[11px] font-semibold text-[#7DD3FC]">
                СБП • 0% комиссия
              </span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg sm:text-xl font-bold font-display">
                Оплата заказа #{pendingOrderNumber}
              </h3>
              <p className="text-sm text-slate-400">
                Сумма к оплате:{' '}
                <span className="text-[#00E6FF] font-black text-xl ml-1 font-mono">
                  {grandTotal.toLocaleString('ru-RU')} ₽
                </span>
              </p>
            </div>

            {/* QR-контейнер с градиентной рамкой */}
            <div
              className="mx-auto w-fit p-[3px] rounded-2xl shadow-[0_0_25px_rgba(0,230,255,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00E6FF, #7B2CBF, #FF286E)' }}
            >
              <div className="bg-white rounded-[14px] p-2.5 sm:p-3.5 flex items-center justify-center">
                <img
                  src="/qr-sbp.png"
                  alt="QR СБП"
                  className="w-40 h-40 min-[380px]:w-48 min-[380px]:h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 text-center leading-relaxed max-w-xs mx-auto">
              Наведите камеру телефона или отсканируйте QR-код в приложении вашего банка, затем
              нажмите кнопку ниже.
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>Т-Банк</span>
              <span>•</span>
              <span>Сбер</span>
              <span>•</span>
              <span>Альфа</span>
              <span>•</span>
              <span>ВТБ</span>
              <span>•</span>
              <span>Все банки РФ</span>
            </div>

            <button
              type="button"
              disabled={checkingSbp}
              onClick={handleConfirmSbp}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] disabled:opacity-50 text-[#0B0314] font-black text-[15px] inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,230,255,0.4)] hover:brightness-110 active:scale-95"
            >
              {checkingSbp && <Loader2 className="w-5 h-5 animate-spin" />}
              {checkingSbp ? 'Проверка оплаты в СБП...' : 'Я оплатил'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
