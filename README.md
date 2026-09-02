# Coffee Bridge ordering website

This project keeps the supplied Coffee Bridge visual identity and adds a complete bilingual drink ordering flow. It runs entirely in the browser; no backend, database, or real payment service is used.

## Included ordering flow

1. Select any drink card.
2. Choose size, sugar, ice, add-ons, and quantity.
3. Add the configured drink to the persistent cart.
4. Review subtotal, discount, tax, and total.
5. Enter customer information and choose cash, card demo, or QR payment.
6. Place the order to generate an order number and digital receipt.
7. Print or download the receipt.

Cart contents, language preference, sequence counters, and the last receipt are stored in `localStorage`.

## Change the payment QR image

Replace `public/img/payment-qr.svg` with the shop's real payment QR image. Keep the same filename, or change the image path in `src/App.tsx` where the QR panel uses `/img/payment-qr.svg`.

## Change drink prices

Open `src/data.ts` and edit the `price` value on a product. Prices use US dollars as decimal numbers, for example:

```ts
price: 3.38,
```

Size and add-on price adjustments are at the bottom of the same file in `sizeOptions` and `addonOptions`.

## Add a new drink

1. Put the drink image in `public/img/drink/`.
2. Add a new object to the `products` array in `src/data.ts`.
3. Give it a unique `id`, one existing `category`, English and Khmer names/descriptions, a price, and its image path.

```ts
{
  id: "new-drink",
  category: "coffee",
  name: { en: "New Drink", kh: "ឈ្មោះភេសជ្ជៈ" },
  description: { en: "Description", kh: "ការពិពណ៌នា" },
  price: 3.5,
  image: "/img/drink/new-drink.webp",
},
```

The drink automatically appears in its category and uses the full ordering flow.

## Change tax or discount

Edit `STORE_CONFIG` near the top of `src/data.ts`:

```ts
export const STORE_CONFIG = {
  taxRate: 0.05,
  discountRate: 0,
  currency: "USD",
  prepTime: "10–15",
};
```

Use decimal rates: `0.05` means 5%, and `0.10` means 10%.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm test
```

`npm test` creates the production build in `dist/` and validates the static output.
