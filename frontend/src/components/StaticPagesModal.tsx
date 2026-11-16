import React from 'react';
import { X, BookOpen, Truck, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';
import type { Locale } from '../types';

interface StaticPagesModalProps {
  slug: string | null;
  onClose: () => void;
  locale: Locale;
}

export const StaticPagesModal: React.FC<StaticPagesModalProps> = ({ slug, onClose, locale }) => {
  if (!slug) return null;

  const contentMap: Record<
    string,
    { title: string; icon: React.ReactNode; body: React.ReactNode }
  > = {
    about: {
      title: 'О бренде «TEE STREET»',
      icon: <BookOpen className="w-5 h-5 text-[#00E6FF]" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>
            <strong>«TEE STREET»</strong> — это независимый концептуальный стритвир-бренд оверсайз-футболок и мерча нового поколения.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-white text-sm">Наши производственные стандарты:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ткань:</strong> 100% гребенной хлопок пенье наивысшего качества, плотность 240–260 г/м².</li>
              <li><strong>Крой:</strong> Пропорциональный Boxy Fit со спущенной линией плеча.</li>
              <li><strong>Печать:</strong> Вытравная шелкография с УФ-активными пигментами (выдерживает 50+ стирок).</li>
              <li><strong>Ворот:</strong> Усиленный воротник 3 см с эластаном — не растягивается и держит форму.</li>
            </ul>
          </div>
          <p>
            Каждая вещь создается ограниченным тиражом в соответствии с принципами экологичного производства и честного отношения к покупателю.
          </p>
        </div>
      ),
    },
    'delivery-and-payment': {
      title: 'Доставка и оплата',
      icon: <Truck className="w-5 h-5 text-[#9BD746]" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Способы доставки:</h4>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-[#00E6FF]">1. Курьерская экспресс-доставка до двери</div>
              <p>Москва и Санкт-Петербург: 1-2 дня. Доступна примерка 15 минут перед оплатой.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-[#00E6FF]">2. Доставка СДЭК и Boxberry по всей России</div>
              <p>Более 5000 постаматов и пунктов самовывоза. Срок 2-5 рабочих дней.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-[#9BD746]">3. Бесплатная доставка от 5 000 ₽</div>
              <p>При заказе на сумму от 5000 ₽ стоимость доставки автоматически обнуляется в корзине!</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="font-bold text-white text-sm">Способы оплаты:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Банковские карты онлайн (МИР, Visa, Mastercard) без комиссии.</li>
              <li>Система быстрых платежей (СБП) — мгновенная оплата по QR-коду из приложения банка.</li>
              <li>Оплата при получении — курьеру картой/наличными после примерки или в пункте выдачи.</li>
            </ul>
          </div>
        </div>
      ),
    },
    'returns-and-warranty': {
      title: 'Возврат и обмен',
      icon: <RefreshCw className="w-5 h-5 text-[#FF286E]" />,
      body: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Если вещь не подошла по размеру или фасону, вы можете вернуть или обменять её в течение <strong>14 дней</strong> с момента получения заказа.
          </p>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-white">Условия возврата:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Вещь не была в носке и стирке;</li>
              <li>Сохранены оригинальные бирки, ярлыки и фирменная упаковка;</li>
              <li>Имеется чек или номер заказа (TEST-XXXXXX).</li>
            </ul>
          </div>
          <p>
            Возврат денежных средств осуществляется тем же способом, которым производилась оплата, в течение 1–3 рабочих дней.
          </p>
        </div>
      ),
    },
    faq: {
      title: 'Часто задаваемые вопросы (FAQ)',
      icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
      body: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-white">Какой размер выбрать на мой рост?</div>
            <p>Все футболки имеют свободный оверсайз-крой. Рекомендуем выбирать ваш стандартный размер (M на 175-182 см) для правильного объемного силуэта. Для гипер-оверсайза берите на размер больше.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-white">Как правильно стирать футболку?</div>
            <p>Стирайте наизнанку при температуре не выше 30°C на деликатном режиме. Не используйте отбеливатели. Гладить с изнаночной стороны.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-white">Садится ли ткань после стирки?</div>
            <p>Нет. Полотно проходит предварительную фабричную декатировку и усадку, поэтому параметры футболки сохраняются неизменными.</p>
          </div>
        </div>
      ),
    },
    'privacy-policy': {
      title: 'Политика конфиденциальности',
      icon: <ShieldCheck className="w-5 h-5 text-[#00E6FF]" />,
      body: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Интернет-магазин «TEE STREET» со всей ответственностью относится к защите персональных данных покупателей в соответствии с Федеральным законом № 152-ФЗ.
          </p>
          <p>
            Все платежные данные обрабатываются по защищенному протоколу TLS/HTTPS с шифрованием AES-256. Данные банковских карт не хранятся на наших серверах.
          </p>
        </div>
      ),
    },
  };

  const current = contentMap[slug] || contentMap['about'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-xl rounded-2xl bg-[#160A29] border border-[#00E6FF]/30 text-white shadow-2xl p-4 sm:p-7 md:p-8 overflow-hidden z-10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              {current.icon}
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg">{current.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">{current.body}</div>
      </div>
    </div>
  );
};
