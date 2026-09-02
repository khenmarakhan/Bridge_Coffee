export type Language = "en" | "kh";
const BASE = import.meta.env.BASE_URL;
export type CategoryId = "coffee" | "tea" | "juice" | "frappe" | "hot";

export type LocalizedText = Record<Language, string>;

export type Product = {
  id: string;
  category: CategoryId;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
};

export const STORE_CONFIG = {
  taxRate: 0.05,
  discountRate: 0,
  currency: "USD",
  prepTime: "10–15",
};

export const categories: Array<{ id: CategoryId; label: LocalizedText }> = [
  { id: "coffee", label: { en: "Coffee Expresso", kh: "ជម្រើសកាហ្វេ" } },
  { id: "tea", label: { en: "Tea ", kh: "ជម្រើសតែ" } },
  { id: "juice", label: { en: "Juice ", kh: "ជម្រើសទឹកផ្លែឈើ" } },
  { id: "frappe", label: { en: "Frappe ", kh: "ជម្រើសប្រភេទក្រឡុក" } },
  { id: "hot", label: { en: "Hot Beverages", kh: "ជម្រើសភេសជ្ជៈក្តៅ" } },
];

export const products: Product[] = [
  {
    id: "iced-24h-home",
    category: "coffee",
    name: { en: "Iced Coffee 24H Home", kh: "កាហ្វេទឹកកក 24H Home" },
    description: { en: 'The classic Cambodian "Cafe Toek Dos Ko".', kh: "កាហ្វេបែបខ្មែរ កាហ្វេទឹកដោះគោ បែបប្រពៃណី។" },
    price: 3.38,
    image: `${BASE}img/drink/24home.webp`,
  },
  {
    id: "iced-24h-night",
    category: "coffee",
    name: { en: "Iced Coffee 24H Night", kh: "កាហ្វេទឹកកក 24H Night" },
    description: { en: "Bold Americano style with 3 shots of espresso.", kh: "រសជាតិអាមេរិកាណូខ្លាំង ជាមួយអេសប្រេសសូ ៣ សត់។" },
    price: 3.38,
    image: `${BASE}img/drink/Americano.webp`,
  },
  {
    id: "ice-latte",
    category: "coffee",
    name: { en: "Ice Coffee Latte", kh: "កាហ្វេឡាតេទឹកកក" },
    description: { en: "Smooth espresso balanced with fresh milk.", kh: "អេសប្រេសសូទន់ល្មើយ ជាមួយទឹកដោះគោស្រស់។" },
    price: 3.38,
    image: `${BASE}img/drink/ice latte.webp`,
  },
  {
    id: "iced-americano",
    category: "coffee",
    name: { en: "Iced Americano", kh: "កាហ្វេខ្មៅទឹកកក" },
    description: { en: "Two shots of espresso, bold and smooth.", kh: "អេសប្រេសសូ ២ សត់ រសជាតិខ្លាំង និងទន់ល្មើយ។" },
    price: 3.38,
    image: `${BASE}img/drink/Americano.webp`,
  },
  {
    id: "iced-bridge-espresso",
    category: "coffee",
    name: { en: "Iced Bridge Espresso", kh: "អេសប្រេសសូប៊្រ៊ីជទឹកកក" },
    description: { en: "Four espresso shots for a strong kick.", kh: "អេសប្រេសសូ ៤ សត់ សម្រាប់អ្នកចូលចិត្តកាហ្វេខ្លាំង។" },
    price: 3.38,
    image: `${BASE}img/drink/Americano.webp`,
  },
  {
    id: "iced-cappuccino",
    category: "coffee",
    name: { en: "Iced Cappuccino", kh: "កាពូឈីណូទឹកកក" },
    description: { en: "Two espresso shots with frothed milk.", kh: "អេសប្រេសសូ ២ សត់ ជាមួយទឹកដោះគោហ្វូម។" },
    price: 3.38,
    image: `${BASE}img/drink/cappuccino.webp`,
  },
  {
    id: "iced-mocha",
    category: "coffee",
    name: { en: "Iced Mocha", kh: "កាហ្វេម៉ូកាទឹកកក" },
    description: { en: "Two espresso shots with premium chocolate.", kh: "អេសប្រេសសូ ២ សត់ ជាមួយសូកូឡាគុណភាពខ្ពស់។" },
    price: 3.38,
    image: `${BASE}img/drink/mocha.webp`,
  },
  {
    id: "iced-vanilla-latte",
    category: "coffee",
    name: { en: "Iced Vanilla Latte", kh: "វ៉ានីឡាឡាតេទឹកកក" },
    description: { en: "Espresso with fresh milk and vanilla.", kh: "អេសប្រេសសូជាមួយទឹកដោះគោស្រស់ និងវ៉ានីឡា។" },
    price: 3.38,
    image: `${BASE}img/drink/24home.webp`,
  },
  {
    id: "iced-caramel-macchiato",
    category: "coffee",
    name: { en: "Iced Caramel Macchiato", kh: "ខារ៉ាមែលម៉ាឈីតូទឹកកក" },
    description: { en: "Espresso with caramel-flavored milk.", kh: "អេសប្រេសសូជាមួយទឹកដោះគោក្លិនខារ៉ាមែល។" },
    price: 3.38,
    image: `${BASE}img/drink/caramel macchiato.webp`,
  },
  {
    id: "iced-mint-latte",
    category: "coffee",
    name: { en: "Mint Latte", kh: "មីនឡាតេទឹកកក" },
    description: { en: "Espresso, fresh milk, and a cool mint finish.", kh: "អេសប្រេសសូ ទឹកដោះគោស្រស់ និងក្លិនជីអង្កាម។" },
    price: 3.38,
    image: `${BASE}img/drink/mint latte.webp`,
  },
  {
    id: "iced-matcha",
    category: "tea",
    name: { en: "Iced Matcha Green Milk Tea", kh: "តែម៉ាត់ឆាទឹកដោះគោស្រស់" },
    description: { en: "Earthy matcha balanced with fresh milk.", kh: "តែម៉ាត់ឆាលាយជាមួយទឹកដោះគោស្រស់។" },
    price: 3.38,
    image: `${BASE}img/drink/matcha latte.webp`,
  },
  {
    id: "iced-lemon-tea",
    category: "tea",
    name: { en: "Iced Lemon Tea", kh: "តែក្រូចឆ្មាទឹកកក" },
    description: { en: "Tea with a bright balance of sweetness and lemon.", kh: "តែជាមួយក្រូចឆ្មា មានរសជាតិផ្អែម និងជូរអែម។" },
    price: 3.38,
    image: `${BASE}img/drink/lemon tea.webp`,
  },
  {
    id: "iced-mint-lemon",
    category: "tea",
    name: { en: "Iced Mint Lemon Tea", kh: "តែក្រូចឆ្មាជីអង្កាមទឹកកក" },
    description: { en: "Refreshing lemon tea with a cool mint finish.", kh: "តែក្រូចឆ្មាស្រស់ ជាមួយក្លិនជីអង្កាម។" },
    price: 3.38,
    image: `${BASE}img/drink/mint lemon.webp`,
  },
  {
    id: "iced-passion-soda",
    category: "tea",
    name: { en: "Iced Passion Soda", kh: "ផាសិនសូដាទឹកកក" },
    description: { en: "Fresh passion fruit and sparkling soda.", kh: "ផ្លែផាសិនស្រស់ លាយជាមួយទឹកសូដា។" },
    price: 3.38,
    image: `${BASE}img/drink/passion soda.webp`,
  },
  {
    id: "iced-passion-milk",
    category: "tea",
    name: { en: "Iced Passion Milk", kh: "ផាសិនទឹកដោះគោទឹកកក" },
    description: { en: "Tropical passion fruit softened with fresh milk.", kh: "ផ្លែផាសិនត្រូពិក ជាមួយទឹកដោះគោស្រស់។" },
    price: 3.38,
    image: `${BASE}img/drink/passion milk.webp`,
  },
  {
    id: "iced-fresh-milk",
    category: "tea",
    name: { en: "Iced Fresh Milk", kh: "ទឹកដោះគោស្រស់ទឹកកក" },
    description: { en: "A lightly sweet, cool and refreshing drink.", kh: "ភេសជ្ជៈទឹកដោះគោផ្អែមល្មម និងស្រស់ស្រាយ។" },
    price: 3.38,
    image: `${BASE}img/drink/fresh milk.webp`,
  },
  {
    id: "fresh-orange-juice",
    category: "juice",
    name: { en: "Fresh Orange Juice", kh: "ទឹកក្រូចស្រស់" },
    description: { en: "Bright, naturally sweet fresh orange juice.", kh: "ទឹកក្រូចស្រស់ ផ្អែមបែបធម្មជាតិ។" },
    price: 3.63,
    image: `${BASE}img/drink/green orange.webp`,
  },
  {
    id: "fresh-apple-juice",
    category: "juice",
    name: { en: "Fresh Apple Juice", kh: "ទឹកប៉ោមស្រស់" },
    description: { en: "Crisp apple juice, pressed fresh.", kh: "ទឹកប៉ោមស្រស់ រសជាតិឆ្ងាញ់។" },
    price: 3.63,
    image: `${BASE}img/drink/apple jucice.webp`,
  },
  {
    id: "fresh-carrot-juice",
    category: "juice",
    name: { en: "Fresh Carrot Juice", kh: "ទឹកការ៉ុតស្រស់" },
    description: { en: "Fresh carrot juice with natural sweetness.", kh: "ទឹកការ៉ុតស្រស់ ជាមួយភាពផ្អែមធម្មជាតិ។" },
    price: 3.63,
    image: `${BASE}img/drink/carrot juice.webp`,
  },
  {
    id: "fresh-pineapple-juice",
    category: "juice",
    name: { en: "Fresh Pineapple Juice", kh: "ទឹកម្នាស់ស្រស់" },
    description: { en: "Juicy pineapple, bright and tropical.", kh: "ទឹកម្នាស់ស្រស់ រសជាតិត្រូពិក។" },
    price: 3.63,
    image: `${BASE}img/drink/pineapple juice.webp`,
  },
  {
    id: "apple-carrot-juice",
    category: "juice",
    name: { en: "Fresh Apple & Carrot Juice", kh: "ទឹកប៉ោម និងការ៉ុតស្រស់" },
    description: { en: "A fresh, balanced blend of apple and carrot.", kh: "ការលាយបញ្ចូលគ្នានៃប៉ោម និងការ៉ុតស្រស់។" },
    price: 3.63,
    image: `${BASE}img/drink/apple with carrot.webp`,
  },
  {
    id: "apple-pineapple-juice",
    category: "juice",
    name: { en: "Fresh Apple & Pineapple Juice", kh: "ទឹកប៉ោម និងម្នាស់ស្រស់" },
    description: { en: "Crisp apple and tropical pineapple, pressed fresh.", kh: "ប៉ោម និងម្នាស់ស្រស់ លាយបញ្ចូលគ្នា។" },
    price: 3.63,
    image: `${BASE}img/drink/apple with pineapple.webp`,
  },
  {
    id: "carrot-pineapple-juice",
    category: "juice",
    name: { en: "Fresh Carrot & Pineapple Juice", kh: "ទឹកការ៉ុត និងម្នាស់ស្រស់" },
    description: { en: "Fresh carrot and pineapple with a tropical finish.", kh: "ការ៉ុត និងម្នាស់ស្រស់ រសជាតិត្រូពិក។" },
    price: 3.63,
    image: `${BASE}img/drink/carrot with pineapple.webp`,
  },
  {
    id: "strawberry-frappe",
    category: "frappe",
    name: { en: "Strawberry Frappe", kh: "ស្ត្របឺរីក្រឡុក" },
    description: { en: "Fresh strawberry blended with milk and ice.", kh: "ផ្លែស្ត្របឺរីស្រស់ ក្រឡុកជាមួយទឹកដោះគោ និងទឹកកក។" },
    price: 3.88,
    image: `${BASE}img/drink/strawberry.webp`,
  },
  {
    id: "vanilla-frappe",
    category: "frappe",
    name: { en: "Vanilla Frappe", kh: "វ៉ានីឡាក្រឡុក" },
    description: { en: "A thick vanilla milkshake with gentle sweetness.", kh: "វ៉ានីឡាក្រឡុកក្រាស់ ផ្អែមល្មម។" },
    price: 3.88,
    image: `${BASE}img/drink/Vanilla Frappe.webp`,
  },
  {
    id: "passion-frappe",
    category: "frappe",
    name: { en: "Passion Frappe", kh: "ផាសិនក្រឡុក" },
    description: { en: "A thick, tangy passion fruit milkshake.", kh: "ផាសិនក្រឡុកក្រាស់ រសជាតិជូរអែម។" },
    price: 3.88,
    image: `${BASE}img/drink/passion frappe.webp`,
  },
  {
    id: "chocolate-frappe",
    category: "frappe",
    name: { en: "Chocolate Frappe", kh: "សូកូឡាក្រឡុក" },
    description: { en: "Milk, chocolate and ice blended until creamy.", kh: "ទឹកដោះគោ សូកូឡា និងទឹកកក ក្រឡុកឱ្យម៉ត់។" },
    price: 3.88,
    image: `${BASE}img/drink/chocolate frappe.webp`,
  },
  {
    id: "caramel-macchiato-frappe",
    category: "frappe",
    name: { en: "Caramel Macchiato Frappe", kh: "ខារ៉ាមែលម៉ាឈីតូក្រឡុក" },
    description: { en: "Espresso, fresh milk and caramel blended smooth.", kh: "អេសប្រេសសូ ទឹកដោះគោស្រស់ និងខារ៉ាមែលក្រឡុក។" },
    price: 3.88,
    image: `${BASE}img/drink/Caramel Macchiato Frappe.webp`,
  },
  {
    id: "mocha-frappe",
    category: "frappe",
    name: { en: "Mocha Frappe", kh: "ម៉ូកាក្រឡុក" },
    description: { en: "Mocha and milk blended to a smooth finish.", kh: "ម៉ូកា និងទឹកដោះគោក្រឡុកឱ្យម៉ត់។" },
    price: 3.88,
    image: `${BASE}img/drink/mocha frappe.webp`,
  },
  {
    id: "cappuccino-frappe",
    category: "frappe",
    name: { en: "Cappuccino Frappe", kh: "កាពូឈីណូក្រឡុក" },
    description: { en: "Espresso and fresh milk blended with airy foam.", kh: "អេសប្រេសសូ និងទឹកដោះគោស្រស់ ក្រឡុកជាមួយហ្វូម។" },
    price: 3.88,
    image: `${BASE}img/drink/Cappuccino Frappe.webp`,
  },
  {
    id: "fresh-milk-frappe",
    category: "frappe",
    name: { en: "Fresh Milk Frappe", kh: "ទឹកដោះគោស្រស់ក្រឡុក" },
    description: { en: "Fresh milk blended into a smooth, cool treat.", kh: "ទឹកដោះគោស្រស់ក្រឡុក ទន់ម៉ត់ និងត្រជាក់។" },
    price: 3.88,
    image: `${BASE}img/drink/fresh milk frappe.webp`,
  },
  {
    id: "bridge-tiramisu",
    category: "frappe",
    name: { en: "Bridge Tiramisu", kh: "ប៊្រ៊ីជធីរ៉ាមីស៊ូ" },
    description: { en: "Fresh milk, espresso and tiramisu syrup blended smooth.", kh: "ទឹកដោះគោ អេសប្រេសសូ និងស៊ីរ៉ុបធីរ៉ាមីស៊ូក្រឡុក។" },
    price: 3.88,
    image: `${BASE}img/drink/tiramisu.webp`,
  },
  {
    id: "banana-smoothie",
    category: "frappe",
    name: { en: "Banana Smoothie", kh: "ផ្លែចេកក្រឡុក" },
    description: { en: "Ripe banana blended with fresh milk.", kh: "ចេកទុំក្រឡុកជាមួយទឹកដោះគោស្រស់។" },
    price: 3.88,
    image: `${BASE}img/drink/banana smoothie.webp`,
  },
  {
    id: "hot-cappuccino",
    category: "hot",
    name: { en: "Hot Cappuccino", kh: "កាពូឈីណូក្តៅ" },
    description: { en: "Espresso, steamed milk and airy foam in balance.", kh: "អេសប្រេសសូ ទឹកដោះគោក្តៅ និងហ្វូមសមតុល្យ។" },
    price: 3.38,
    image: `${BASE}img/drink/hot cappuccino.webp`,
  },
  {
    id: "hot-latte",
    category: "hot",
    name: { en: "Hot Coffee Latte", kh: "កាហ្វេឡាតេក្តៅ" },
    description: { en: "Coffee balanced with the gentle sweetness of milk.", kh: "កាហ្វេជាមួយភាពផ្អែមល្មមនៃទឹកដោះគោ។" },
    price: 3.38,
    image: `${BASE}img/drink/hot latte.webp`,
  },
  {
    id: "hot-americano",
    category: "hot",
    name: { en: "Hot Americano", kh: "អាមេរិកាណូក្តៅ" },
    description: { en: "Classic espresso flavor with a clean, bold finish.", kh: "រសជាតិអេសប្រេសសូបែបប្រពៃណី ខ្លាំង និងស្រស់។" },
    price: 3.38,
    image: `${BASE}img/drink/hot  americano.webp`,
  },
  {
    id: "hot-mocha",
    category: "hot",
    name: { en: "Hot Mocha", kh: "ម៉ូកាក្តៅ" },
    description: { en: "Espresso, steamed milk and rich chocolate.", kh: "អេសប្រេសសូ ទឹកដោះគោក្តៅ និងសូកូឡា។" },
    price: 3.38,
    image: `${BASE}img/drink/hot mocha.webp`,
  },
  {
    id: "hot-vanilla-latte",
    category: "hot",
    name: { en: "Hot Vanilla Latte", kh: "វ៉ានីឡាឡាតេក្តៅ" },
    description: { en: "Espresso and steamed milk with vanilla syrup.", kh: "អេសប្រេសសូ និងទឹកដោះគោក្តៅ ជាមួយស៊ីរ៉ុបវ៉ានីឡា។" },
    price: 3.38,
    image: `${BASE}img/drink/hot vanilla latte.webp`,
  },
  {
    id: "hot-caramel-macchiato",
    category: "hot",
    name: { en: "Hot Caramel Macchiato", kh: "ខារ៉ាមែលម៉ាឈីតូក្តៅ" },
    description: { en: "A mellow vanilla latte finished with caramel.", kh: "វ៉ានីឡាឡាតេផ្អែមល្មម ជាមួយខារ៉ាមែល។" },
    price: 3.38,
    image: `${BASE}img/drink/hot caramel macchiato.webp`,
  },
  {
    id: "hot-bridge-espresso",
    category: "hot",
    name: { en: "Hot Bridge Espresso", kh: "អេសប្រេសសូប៊្រ៊ីជក្តៅ" },
    description: { en: "Creamy espresso with a lingering roasted finish.", kh: "អេសប្រេសសូក្រអូប រលោង និងមានរសជាតិយូរ។" },
    price: 3.38,
    image: `${BASE}img/drink/hot espresso.webp`,
  },
  {
    id: "hot-chocolate",
    category: "hot",
    name: { en: "Hot Chocolate Milk", kh: "ទឹកដោះគោសូកូឡាក្តៅ" },
    description: { en: "Creamy milk chocolate, warm and comforting.", kh: "ទឹកដោះគោសូកូឡាក្តៅ រលោង និងផ្អែម។" },
    price: 3.38,
    image: `${BASE}img/drink/Hot Chocolate Milk.webp`,
  },
  {
    id: "hot-fresh-milk",
    category: "hot",
    name: { en: "Hot Fresh Milk", kh: "ទឹកដោះគោស្រស់ក្តៅ" },
    description: { en: "Warm fresh milk, simple and nourishing.", kh: "ទឹកដោះគោស្រស់ក្តៅ ងាយផឹក និងមានជីវជាតិ។" },
    price: 3.38,
    image: `${BASE}img/drink/hot fresh milk.webp`,
  },
  {
    id: "hot-matcha",
    category: "hot",
    name: { en: "Hot Matcha Green Tea", kh: "តែម៉ាត់ឆាក្តៅ" },
    description: { en: "Earthy matcha whisked with warm fresh milk.", kh: "តែម៉ាត់ឆាក្រអូប លាយជាមួយទឹកដោះគោក្តៅ។" },
    price: 3.38,
    image: `${BASE}img/drink/hot matcha.webp`,
  },
];

export const sizeOptions = [
  { id: "small", adjustment: -0.25, label: { en: "Small", kh: "តូច" } },
  { id: "medium", adjustment: 0, label: { en: "Medium", kh: "មធ្យម" } },
  { id: "large", adjustment: 0.5, label: { en: "Large", kh: "ធំ" } },
] as const;

export const sugarOptions = [
  { id: "0", label: { en: "No sugar", kh: "មិនដាក់ស្ករ" } },
  { id: "25", label: { en: "25%", kh: "២៥%" } },
  { id: "50", label: { en: "50%", kh: "៥០%" } },
  { id: "75", label: { en: "75%", kh: "៧៥%" } },
  { id: "100", label: { en: "100%", kh: "១០០%" } },
] as const;

export const iceOptions = [
  { id: "none", label: { en: "No ice", kh: "មិនដាក់ទឹកកក" } },
  { id: "less", label: { en: "Less ice", kh: "ទឹកកកតិច" } },
  { id: "normal", label: { en: "Normal ice", kh: "ទឹកកកធម្មតា" } },
  { id: "extra", label: { en: "Extra ice", kh: "ទឹកកកច្រើន" } },
] as const;

export const addonOptions = [
  { id: "extra-shot", price: 0.5, label: { en: "Extra shot", kh: "បន្ថែមអេសប្រេសសូ" } },
  { id: "oat-milk", price: 0.45, label: { en: "Oat milk", kh: "ទឹកដោះគោអូត" } },
  { id: "whipped-cream", price: 0.35, label: { en: "Whipped cream", kh: "ក្រែម" } },
  { id: "caramel-drizzle", price: 0.35, label: { en: "Caramel drizzle", kh: "ទឹកខារ៉ាមែល" } },
] as const;

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: STORE_CONFIG.currency,
  }).format(value);
}
