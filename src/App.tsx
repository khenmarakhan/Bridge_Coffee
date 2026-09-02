import { useEffect, useMemo, useState } from 'react';
import {
  STORE_CONFIG,
  addonOptions,
  categories,
  formatMoney,
  iceOptions,
  products,
  sizeOptions,
  sugarOptions,
  type Language,
  type Product,
} from './data';
const BASE = import.meta.env.BASE_URL;
import { translate } from './i18n';

type PaymentMethod = 'cash' | 'card' | 'qr';

type CartItem = {
  lineId: string;
  productId: string;
  size: (typeof sizeOptions)[number]['id'];
  sugar: (typeof sugarOptions)[number]['id'];
  ice: (typeof iceOptions)[number]['id'];
  addons: string[];
  quantity: number;
  unitPrice: number;
};

type Customer = { name: string; phone: string; note: string };

type Totals = {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

type Order = {
  number: string;
  createdAt: string;
  customer: Customer;
  payment: PaymentMethod;
  items: CartItem[];
  totals: Totals;
};

const CART_KEY = 'coffeeBridgeCartV1';
const LANGUAGE_KEY = 'coffeeBridgeLanguage';
const LAST_ORDER_KEY = 'coffeeBridgeLastOrder';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

function getSize(sizeId: CartItem['size']) {
  return sizeOptions.find((size) => size.id === sizeId) ?? sizeOptions[1];
}

function getSugar(sugarId: CartItem['sugar']) {
  return sugarOptions.find((sugar) => sugar.id === sugarId) ?? sugarOptions[2];
}

function getIce(iceId: CartItem['ice']) {
  return iceOptions.find((ice) => ice.id === iceId) ?? iceOptions[2];
}

function itemCustomizations(item: CartItem, language: Language) {
  const details: string[] = [
    getSize(item.size).label[language],
    getSugar(item.sugar).label[language],
  ];
  const product = getProduct(item.productId);
  if (product?.category !== 'hot')
    details.push(getIce(item.ice).label[language]);
  item.addons.forEach((addonId) => {
    const addon = addonOptions.find((option) => option.id === addonId);
    if (addon) details.push(addon.label[language]);
  });
  return details.join(' · ');
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;',
      })[character] ?? character,
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l1.8 9.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20 7H6M9 20h.01M17 20h.01" />
    </svg>
  );
}

function CloseIcon() {
  return <span aria-hidden="true">×</span>;
}

export function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved === 'kh' ? 'kh' : 'en';
  });
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(CART_KEY, []));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<CartItem['size']>('medium');
  const [sugar, setSugar] = useState<CartItem['sugar']>('50');
  const [ice, setIce] = useState<CartItem['ice']>('normal');
  const [addons, setAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    note: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [formError, setFormError] = useState('');
  const [lastOrder, setLastOrder] = useState<Order | null>(() =>
    readStorage<Order | null>(LAST_ORDER_KEY, null),
  );
  const [toast, setToast] = useState('');

  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const calculateSubtotal = (items = cart) =>
    items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  const calculateTotal = (items = cart): Totals => {
    const subtotal = calculateSubtotal(items);
    const discount = subtotal * STORE_CONFIG.discountRate;
    const tax = (subtotal - discount) * STORE_CONFIG.taxRate;
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  };

  const totals = useMemo(() => calculateTotal(), [cart]);

  const productUnitPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const addonPrice = addons.reduce((total, addonId) => {
      return (
        total +
        (addonOptions.find((option) => option.id === addonId)?.price ?? 0)
      );
    }, 0);
    return selectedProduct.price + getSize(size).adjustment + addonPrice;
  }, [selectedProduct, size, addons]);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  };

  const loadCart = () => setCart(readStorage(CART_KEY, []));

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    document.documentElement.lang = language === 'kh' ? 'km' : 'en';
    document.body.classList.toggle('khmer', language === 'kh');
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const hasOverlay = Boolean(
      selectedProduct || cartOpen || checkoutOpen || successOpen || receiptOpen,
    );
    document.body.classList.toggle('modal-open', hasOverlay);
    return () => document.body.classList.remove('modal-open');
  }, [selectedProduct, cartOpen, checkoutOpen, successOpen, receiptOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (receiptOpen) setReceiptOpen(false);
      else if (successOpen) setSuccessOpen(false);
      else if (checkoutOpen) setCheckoutOpen(false);
      else if (cartOpen) setCartOpen(false);
      else if (selectedProduct) setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProduct, cartOpen, checkoutOpen, successOpen, receiptOpen]);

  useEffect(() => {
    loadCart();
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    setMobileMenuOpen(false);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setSize('medium');
    setSugar('50');
    setIce(product.category === 'hot' ? 'none' : 'normal');
    setAddons([]);
    setQuantity(1);
  };

  const closeProductModal = () => setSelectedProduct(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const signature = [
      selectedProduct.id,
      size,
      sugar,
      ice,
      [...addons].sort().join('-'),
    ].join('|');
    setCart((current) => {
      const existing = current.find((item) => item.lineId === signature);
      if (existing) {
        return current.map((item) =>
          item.lineId === signature
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...current,
        {
          lineId: signature,
          productId: selectedProduct.id,
          size,
          sugar,
          ice,
          addons,
          quantity,
          unitPrice: productUnitPrice,
        },
      ];
    });
    closeProductModal();
    showToast(t('addedToCart'));
  };

  const removeFromCart = (lineId: string) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId));
  };

  const updateCart = (lineId: string, nextQuantity: number) => {
    if (nextQuantity < 1) {
      removeFromCart(lineId);
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.lineId === lineId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const updateCartBadge = () => cartCount;

  const openCheckout = () => {
    if (!cart.length) return;
    setCartOpen(false);
    setFormError('');
    setCheckoutOpen(true);
  };

  const selectPaymentMethod = (method: PaymentMethod) => setPayment(method);

  const generateOrderNumber = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const counterKey = `coffeeBridgeOrderSequence-${datePart}`;
    const nextSequence = Number(localStorage.getItem(counterKey) ?? 0) + 1;
    localStorage.setItem(counterKey, String(nextSequence));
    return `COF-${datePart}-${String(nextSequence).padStart(3, '0')}`;
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  const placeOrder = () => {
    if (!cart.length) {
      setFormError(t('cartEmptyError'));
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim()) {
      setFormError(t('requiredFields'));
      return;
    }
    if (!/^[+()\d\s-]{7,20}$/.test(customer.phone.trim())) {
      setFormError(t('invalidPhone'));
      return;
    }
    const order: Order = {
      number: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        note: customer.note.trim(),
      },
      payment,
      items: cart.map((item) => ({ ...item, addons: [...item.addons] })),
      totals: calculateTotal(cart),
    };
    setLastOrder(order);
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    clearCart();
    setCheckoutOpen(false);
    setSuccessOpen(true);
    setFormError('');
  };

  const generateReceipt = (order: Order) => {
    const rows = order.items
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return '';
        return `<tr><td><strong>${escapeHtml(product.name[language])}</strong><small>${escapeHtml(itemCustomizations(item, language))}</small></td><td>${item.quantity}</td><td>${formatMoney(item.unitPrice * item.quantity)}</td></tr>`;
      })
      .join('');
    const paymentLabel = t(order.payment);
    return `<!doctype html><html lang="${language === 'kh' ? 'km' : 'en'}"><head><meta charset="utf-8"><title>${escapeHtml(order.number)}</title><style>body{font-family:Arial,sans-serif;color:#2d241e;max-width:720px;margin:40px auto;padding:24px}h1{text-align:center;color:#6f4e37}p{line-height:1.6}.meta{border-block:1px dashed #c9b7a8;padding:16px 0}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;padding:12px 4px;border-bottom:1px solid #eadfd4}th:nth-child(2),td:nth-child(2){text-align:center}th:last-child,td:last-child{text-align:right}small{display:block;color:#78685c;margin-top:4px}.totals{margin-left:auto;width:min(320px,100%)}.totals p{display:flex;justify-content:space-between;margin:6px 0}.total{font-size:1.15rem;font-weight:700}.thanks{text-align:center;margin-top:36px}</style></head><body><h1>BRIDGE COFFEE</h1><div class="meta"><p><strong>${t('orderNumber')}:</strong> ${escapeHtml(order.number)}<br><strong>${t('dateTime')}:</strong> ${escapeHtml(new Date(order.createdAt).toLocaleString(language === 'kh' ? 'km-KH' : 'en-US'))}<br><strong>${t('customer')}:</strong> ${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.phone)}</p></div><table><thead><tr><th>${t('item')}</th><th>${t('qty')}</th><th>${t('price')}</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><p><span>${t('subtotal')}</span><strong>${formatMoney(order.totals.subtotal)}</strong></p><p><span>${t('tax')}</span><strong>${formatMoney(order.totals.tax)}</strong></p><p class="total"><span>${t('total')}</span><strong>${formatMoney(order.totals.total)}</strong></p></div><p><strong>${t('paymentMethod')}:</strong> ${paymentLabel}</p><p class="thanks">${t('receiptThanks')}</p></body></html>`;
  };

  const printReceipt = () => window.print();

  const downloadReceipt = () => {
    if (!lastOrder) return;
    const blob = new Blob([generateReceipt(lastOrder)], {
      type: 'text/html;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${lastOrder.number}-receipt.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const startNewOrder = () => {
    setSuccessOpen(false);
    setReceiptOpen(false);
    setCustomer({ name: '', phone: '', note: '' });
    setPayment('cash');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAddon = (addonId: string) => {
    setAddons((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId],
    );
  };

  const closeFromBackdrop = (
    event: React.MouseEvent<HTMLDivElement>,
    close: () => void,
  ) => {
    if (event.target === event.currentTarget) close();
  };

  const renderTotals = (values: Totals, compact = false) => (
    <div className={`totals ${compact ? 'totals--compact' : ''}`}>
      <div>
        <span>{t('subtotal')}</span>
        <strong>{formatMoney(values.subtotal)}</strong>
      </div>
      {STORE_CONFIG.discountRate > 0 && (
        <div>
          <span>{t('discount')}</span>
          <strong>−{formatMoney(values.discount)}</strong>
        </div>
      )}
      <div>
        <span>
          {t('tax')} ({STORE_CONFIG.taxRate * 100}%)
        </span>
        <strong>{formatMoney(values.tax)}</strong>
      </div>
      <div className="totals__grand">
        <span>{t('total')}</span>
        <strong>{formatMoney(values.total)}</strong>
      </div>
    </div>
  );

  const paymentOptions: Array<{
    id: PaymentMethod;
    icon: string;
    title: string;
    note: string;
  }> = [
    { id: 'cash', icon: '៛', title: t('cash'), note: t('cashNote') },
    { id: 'card', icon: '▣', title: t('card'), note: t('cardNote') },
    { id: 'qr', icon: '⌗', title: t('qr'), note: t('qrNote') },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Coffee Bridge home">
          <img src={`${BASE}img/logo.png`} alt="Coffee Bridge" />
          <span>
            <b>BRIDGE</b> COFFEE
          </span>
        </a>
        <button
          className="mobile-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>
            {t('home')}
          </a>
          <a href="#menu" onClick={() => setMobileMenuOpen(false)}>
            {t('menu')}
          </a>
          <a href="#celebrations" onClick={() => setMobileMenuOpen(false)}>
            {t('celebrations')}
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
            {t('contact')}
          </a>
        </nav>
        <div className="header-actions">
          <div className="language-switcher" aria-label="Language">
            <button
              className={language === 'en' ? 'is-active' : ''}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
            >
              <span>🇺🇸</span> EN
            </button>
            <button
              className={language === 'kh' ? 'is-active' : ''}
              onClick={() => setLanguage('kh')}
              aria-pressed={language === 'kh'}
            >
              <span>🇰🇭</span> ខ្មែរ
            </button>
          </div>
          <button
            className="cart-trigger"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${t('cart')}: ${updateCartBadge()}`}
          >
            <CartIcon />
            <span className="cart-trigger__label">{t('cart')}</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero__shade" />
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">{t('established')}</span>
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroBody')}</p>
            <div className="hero__actions">
              <a href="#menu" className="button button--primary">
                {t('viewMenu')}
              </a>
              <a href={`${BASE}about.html`} className="button button--ghost">
                {t('aboutUs')}
              </a>
            </div>
          </div>
          <div className="hero__open-mark" aria-hidden="true">
            <strong>24H</strong>
            <span>PHNOM PENH</span>
          </div>
        </section>

        <section className="photo-ribbon" aria-label="Coffee Bridge atmosphere">
          <div className="photo-ribbon__track">
            {[
              `${BASE}img/cafe bridge.webp`,
              `${BASE}img/cover-Coffee-Bridge-24H-20220514105718.webp`,
              `${BASE}img/cafe bridge.webp`,
              `${BASE}img/cover-Coffee-Bridge-24H-20220514105718.webp`,
            ].map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt="Coffee Bridge café"
              />
            ))}
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <span className="eyebrow">{t('menuEyebrow')}</span>
            <h2>{t('menuTitle')}</h2>
            <p>{t('menuIntro')}</p>
          </div>
          <div className="category-jump" aria-label="Menu categories">
            {categories.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.label[language]}
              </a>
            ))}
          </div>
          {categories.map((category) => (
            <section
              className="menu-category"
              id={category.id}
              key={category.id}
            >
              <div className="category-heading">
                <span>
                  {String(categories.indexOf(category) + 1).padStart(2, '0')}
                </span>
                <h3>{category.label[language]}</h3>
                <div />
              </div>
              <div className="menu-grid">
                {products
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                    <button
                      className="menu-card"
                      type="button"
                      key={product.id}
                      onClick={() => openProductModal(product)}
                    >
                      <div className="menu-card__image">
                        <img
                          src={product.image}
                          alt={product.name[language]}
                          loading="lazy"
                        />
                        <span>
                          {t('customize')} <b>+</b>
                        </span>
                      </div>
                      <div className="menu-card__body">
                        <h4>{product.name[language]}</h4>
                        <p>{product.description[language]}</p>
                        <div className="menu-card__price">
                          <small>{t('from')}</small>
                          {formatMoney(product.price)}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </section>

        <section className="events-section" id="celebrations">
          <div className="section-heading section-heading--light">
            <span className="eyebrow">{t('eventsEyebrow')}</span>
            <h2>{t('eventsTitle')}</h2>
            <p>{t('eventsBody')}</p>
          </div>
          <div className="events-grid">
            {[
              [`${BASE}img/birthday.webp`, t('birthday'), t('birthdayText')],
              [`${BASE}img/Private Catering.webp`, t('catering'), t('cateringText')],
              [`${BASE}img/Weddings.webp`, t('weddings'), t('weddingsText')],
              [`${BASE}img/Gift Vouchers.webp`, t('vouchers'), t('vouchersText')],
            ].map(([image, title, body]) => (
              <article className="event-card" key={title}>
                <img src={image} alt={title} loading="lazy" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <a href="#contact">{t('enquire')} →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-heading">
            <h2>{t('reviewsTitle')}</h2>
          </div>
          <div className="reviews-grid">
            {[
              [
                language === 'en'
                  ? 'Best iced latte in Phnom Penh, and the Wi-Fi is genuinely fast. I come here to work almost every day.'
                  : 'កាហ្វេឡាតេទឹកកកឆ្ងាញ់ ហើយ Wi-Fi លឿនមែន។ ខ្ញុំមកធ្វើការនៅទីនេះស្ទើរតែរាល់ថ្ងៃ។',
                'Sokha P.',
              ],
              [
                language === 'en'
                  ? "Booked them for my daughter's birthday and the team made everything easy."
                  : 'ខ្ញុំបានកក់កម្មវិធីខួបកូនស្រី ហើយក្រុមការងាររៀបចំបានយ៉ាងងាយស្រួល។',
                'Dara K.',
              ],
              [
                language === 'en'
                  ? 'Open 24 hours and the quality never drops, even at 3am.'
                  : 'បើក ២៤ ម៉ោង ហើយគុណភាពនៅតែល្អ សូម្បីតែម៉ោង ៣ ព្រឹក។',
                'Vanna T.',
              ],
            ].map(([quote, name]) => (
              <blockquote key={name}>
                <div>★★★★★</div>
                <p>“{quote}”</p>
                <cite>— {name}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="footer__grid">
          <div>
            <a className="brand brand--footer" href="#home">
              <span>
                <b>BRIDGE</b> COFFEE
              </span>
            </a>
            <p>{t('footerText')}</p>
            <div className="socials">
              <a
                href="https://web.facebook.com/cafe24hour/"
                target="_blank"
                rel="noreferrer"
              >
                f
              </a>
              <a
                href="https://www.tiktok.com/@cambodia1819"
                target="_blank"
                rel="noreferrer"
              >
                ▶
              </a>
            </div>
          </div>
          <div>
            <h3>{t('ourMenu')}</h3>
            {categories.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.label[language]}
              </a>
            ))}
          </div>
          <div>
            <h3>{t('events')}</h3>
            <a href="#celebrations">{t('birthday')}</a>
            <a href="#celebrations">{t('catering')}</a>
            <a href="#celebrations">{t('weddings')}</a>
          </div>
          <div>
            <h3>{t('contactInfo')}</h3>
            <p>Phnom Penh, Cambodia</p>
            <p>+855 123 456 789</p>
            <p>coffeebridgecambodia@coffeebridge.com</p>
            <p className="open-hours">{t('openDaily')}</p>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{t('allRights')}</span>
          <div>
            <a href={`${BASE}privacy.html`}>{t('privacy')}</a>
            <a href={`${BASE}terms.html`}>{t('terms')}</a>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => closeFromBackdrop(event, closeProductModal)}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <button
              className="icon-button modal-close"
              type="button"
              onClick={closeProductModal}
              aria-label={t('close')}
            >
              <CloseIcon />
            </button>
            <div className="product-modal__media">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name[language]}
              />
              <span>
                {
                  categories.find(
                    (category) => category.id === selectedProduct.category,
                  )?.label[language]
                }
              </span>
            </div>
            <div className="product-modal__content">
              <span className="eyebrow">{t('customize')}</span>
              <h2 id="product-modal-title">{selectedProduct.name[language]}</h2>
              <p className="product-description">
                {selectedProduct.description[language]}
              </p>
              <fieldset>
                <legend>{t('size')}</legend>
                <div className="choice-row">
                  {sizeOptions.map((option) => (
                    <label
                      className={
                        size === option.id ? 'choice is-selected' : 'choice'
                      }
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name="size"
                        checked={size === option.id}
                        onChange={() => setSize(option.id)}
                      />
                      <span>{option.label[language]}</span>
                      <small>
                        {option.adjustment === 0
                          ? formatMoney(selectedProduct.price)
                          : `${option.adjustment > 0 ? '+' : '−'}${formatMoney(Math.abs(option.adjustment))}`}
                      </small>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>{t('sugar')}</legend>
                <div className="choice-row choice-row--compact">
                  {sugarOptions.map((option) => (
                    <label
                      className={
                        sugar === option.id ? 'choice is-selected' : 'choice'
                      }
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name="sugar"
                        checked={sugar === option.id}
                        onChange={() => setSugar(option.id)}
                      />
                      <span>{option.label[language]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {selectedProduct.category !== 'hot' && (
                <fieldset>
                  <legend>{t('ice')}</legend>
                  <div className="choice-row choice-row--compact">
                    {iceOptions.map((option) => (
                      <label
                        className={
                          ice === option.id ? 'choice is-selected' : 'choice'
                        }
                        key={option.id}
                      >
                        <input
                          type="radio"
                          name="ice"
                          checked={ice === option.id}
                          onChange={() => setIce(option.id)}
                        />
                        <span>{option.label[language]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <fieldset>
                <legend>{t('addons')}</legend>
                <div className="addon-grid">
                  {addonOptions.map((option) => (
                    <label
                      className={
                        addons.includes(option.id)
                          ? 'addon is-selected'
                          : 'addon'
                      }
                      key={option.id}
                    >
                      <input
                        type="checkbox"
                        checked={addons.includes(option.id)}
                        onChange={() => toggleAddon(option.id)}
                      />
                      <span>{option.label[language]}</span>
                      <small>+{formatMoney(option.price)}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="product-modal__footer">
                <div className="quantity-control" aria-label={t('quantity')}>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  className="button button--primary add-button"
                  type="button"
                  onClick={addToCart}
                >
                  <span>{t('addToCart')}</span>
                  <strong>{formatMoney(productUnitPrice * quantity)}</strong>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <div
        className={cartOpen ? 'drawer-backdrop is-open' : 'drawer-backdrop'}
        onMouseDown={(event) =>
          closeFromBackdrop(event, () => setCartOpen(false))
        }
        aria-hidden={!cartOpen}
      >
        <aside
          className="cart-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
        >
          <div className="drawer-header">
            <div>
              <span className="eyebrow">Coffee Bridge</span>
              <h2 id="cart-title">{t('yourOrder')}</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => setCartOpen(false)}
              aria-label={t('close')}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="cart-items">
            {!cart.length ? (
              <div className="empty-cart">
                <div>☕</div>
                <p>{t('emptyCart')}</p>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => setCartOpen(false)}
                >
                  {t('browseMenu')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <article className="cart-item" key={item.lineId}>
                    <img src={product.image} alt={product.name[language]} />
                    <div className="cart-item__info">
                      <h3>{product.name[language]}</h3>
                      <p>{itemCustomizations(item, language)}</p>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => removeFromCart(item.lineId)}
                      >
                        {t('remove')}
                      </button>
                    </div>
                    <div className="cart-item__end">
                      <strong>
                        {formatMoney(item.unitPrice * item.quantity)}
                      </strong>
                      <div className="quantity-control quantity-control--small">
                        <button
                          type="button"
                          onClick={() =>
                            updateCart(item.lineId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCart(item.lineId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
          {cart.length > 0 && (
            <div className="drawer-footer">
              {renderTotals(totals)}
              <button
                className="button button--primary button--wide"
                type="button"
                onClick={openCheckout}
              >
                {t('checkout')} · {formatMoney(totals.total)}
              </button>
              <button
                className="text-button text-button--center"
                type="button"
                onClick={() => setCartOpen(false)}
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </aside>
      </div>

      {checkoutOpen && (
        <div
          className="modal-backdrop modal-backdrop--checkout"
          onMouseDown={(event) =>
            closeFromBackdrop(event, () => setCheckoutOpen(false))
          }
        >
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <div className="checkout-header">
              <div>
                <span className="eyebrow">Coffee Bridge · Checkout</span>
                <h2 id="checkout-title">{t('checkoutTitle')}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label={t('close')}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="checkout-grid">
              <div className="checkout-form">
                <section>
                  <h3>
                    <span>01</span>
                    {t('customerInfo')}
                  </h3>
                  <label>
                    {t('customerName')}
                    <input
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer({ ...customer, name: event.target.value })
                      }
                      placeholder={t('namePlaceholder')}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    {t('phone')}
                    <input
                      value={customer.phone}
                      onChange={(event) =>
                        setCustomer({ ...customer, phone: event.target.value })
                      }
                      placeholder={t('phonePlaceholder')}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </label>
                  <label>
                    {t('note')}
                    <textarea
                      value={customer.note}
                      onChange={(event) =>
                        setCustomer({ ...customer, note: event.target.value })
                      }
                      placeholder={t('notePlaceholder')}
                      rows={3}
                    />
                  </label>
                </section>
                <section>
                  <h3>
                    <span>02</span>
                    {t('payment')}
                  </h3>
                  <div className="payment-grid">
                    {paymentOptions.map((option) => (
                      <button
                        className={
                          payment === option.id
                            ? 'payment-option is-selected'
                            : 'payment-option'
                        }
                        type="button"
                        key={option.id}
                        onClick={() => selectPaymentMethod(option.id)}
                      >
                        <i>{option.icon}</i>
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.note}</small>
                        </span>
                        <b aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  {payment === 'qr' && (
                    <div className="qr-panel">
                      <img src={`${BASE}img/aba.jpg`} alt={t('qrPlaceholder')} />
                      <div>
                        <strong>{t('qr')}</strong>
                        <p>{t('qrPlaceholder')}</p>
                      </div>
                    </div>
                  )}
                  <p className="demo-note">ⓘ {t('paymentDemo')}</p>
                </section>
              </div>
              <aside className="checkout-summary">
                <h3>{t('orderSummary')}</h3>
                <div className="summary-items">
                  {cart.map((item) => {
                    const product = getProduct(item.productId);
                    return product ? (
                      <div key={item.lineId}>
                        <span>
                          <b>{item.quantity}×</b> {product.name[language]}
                          <small>{itemCustomizations(item, language)}</small>
                        </span>
                        <strong>
                          {formatMoney(item.unitPrice * item.quantity)}
                        </strong>
                      </div>
                    ) : null;
                  })}
                </div>
                {renderTotals(totals, true)}
                {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
                <button
                  className="button button--primary button--wide place-order"
                  type="button"
                  onClick={placeOrder}
                >
                  {t('placeOrder')} · {formatMoney(totals.total)}
                </button>
                <button
                  className="text-button text-button--center"
                  type="button"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setCartOpen(true);
                  }}
                >
                  {t('backToCart')}
                </button>
              </aside>
            </div>
          </section>
        </div>
      )}

      {successOpen && lastOrder && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            closeFromBackdrop(event, () => setSuccessOpen(false))
          }
        >
          <section
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <div className="success-mark">✓</div>
            <span className="eyebrow">Coffee Bridge</span>
            <h2 id="success-title">{t('successTitle')}</h2>
            <strong className="order-number">{lastOrder.number}</strong>
            <p>{t('successThanks')}</p>
            <p>{t('prepTime')}</p>
            <div className="success-actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => {
                  setSuccessOpen(false);
                  setReceiptOpen(true);
                }}
              >
                {t('viewReceipt')}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={startNewOrder}
              >
                {t('newOrder')}
              </button>
            </div>
          </section>
        </div>
      )}

      {receiptOpen && lastOrder && (
        <div
          className="modal-backdrop receipt-overlay"
          onMouseDown={(event) =>
            closeFromBackdrop(event, () => setReceiptOpen(false))
          }
        >
          <section
            className="receipt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-title"
          >
            <button
              className="icon-button receipt-close"
              type="button"
              onClick={() => setReceiptOpen(false)}
              aria-label={t('close')}
            >
              <CloseIcon />
            </button>
            <div className="receipt-paper">
              <div className="receipt-brand">
                <img src={`${BASE}img/logo.png`} alt="" />
                <h2 id="receipt-title">BRIDGE COFFEE</h2>
                <p>{t('receipt')}</p>
              </div>
              <div className="receipt-meta">
                <p>
                  <span>{t('orderNumber')}</span>
                  <strong>{lastOrder.number}</strong>
                </p>
                <p>
                  <span>{t('dateTime')}</span>
                  <strong>
                    {new Date(lastOrder.createdAt).toLocaleString(
                      language === 'kh' ? 'km-KH' : 'en-US',
                    )}
                  </strong>
                </p>
                <p>
                  <span>{t('customer')}</span>
                  <strong>
                    {lastOrder.customer.name}
                    <small>{lastOrder.customer.phone}</small>
                  </strong>
                </p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>{t('item')}</th>
                    <th>{t('qty')}</th>
                    <th>{t('price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOrder.items.map((item) => {
                    const product = getProduct(item.productId);
                    return product ? (
                      <tr key={item.lineId}>
                        <td>
                          <strong>{product.name[language]}</strong>
                          <small>{itemCustomizations(item, language)}</small>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatMoney(item.unitPrice * item.quantity)}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
              {renderTotals(lastOrder.totals, true)}
              <p className="receipt-payment">
                <span>{t('paymentMethod')}</span>
                <strong>{t(lastOrder.payment)}</strong>
              </p>
              {lastOrder.customer.note && (
                <p className="receipt-note">“{lastOrder.customer.note}”</p>
              )}
              <p className="receipt-thanks">{t('receiptThanks')}</p>
            </div>
            <div className="receipt-actions">
              <button
                className="button button--primary"
                type="button"
                onClick={printReceipt}
              >
                {t('printReceipt')}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={downloadReceipt}
              >
                {t('downloadReceipt')}
              </button>
              <button
                className="text-button"
                type="button"
                onClick={startNewOrder}
              >
                {t('newOrder')}
              </button>
            </div>
          </section>
        </div>
      )}

      <div className={toast ? 'toast is-visible' : 'toast'} role="status">
        ✓ {toast}
      </div>
    </div>
  );
}
