import { test, expect } from '@playwright/test';

const HOMEPAGE_GRIDS = {
  homepageGrids: [
    {
      id: 1,
      title: 'Test Grid Title',
      products: [
        {
          id: 101,
          title: 'Test Product 1',
          slug: 'test-product-1',
          price: 10.0,
          quantity: 10,
          images: ['https://via.placeholder.com/150'],
        },
      ],
    },
  ],
};

const CATEGORIES = [
  { id: 1, title: 'Test Category', slug: 'test-category', children: [] }
];

const PRODUCTS_PAGE = {
  content: [
    {
      id: 101,
      title: 'Test Product 1',
      slug: 'test-product-1',
      price: 10.0,
      quantity: 10,
      images: ['https://via.placeholder.com/150'],
    }
  ],
  totalPages: 1
};

const PRODUCT_DETAIL_IN_STOCK = {
  id: 101,
  title: 'Test Product 1',
  slug: 'test-product-1',
  price: 10.0,
  quantity: 10,
  images: ['https://via.placeholder.com/150'],
  description: 'Test Description',
  averageRating: 4.5,
};

const PRODUCT_DETAIL_OUT_OF_STOCK = {
  id: 102,
  title: 'Out of Stock Product',
  slug: 'out-of-stock-product',
  price: 20.0,
  quantity: 0,
  images: ['https://via.placeholder.com/150'],
  description: 'No stock',
};

const PRODUCT_2_DETAIL = {
    id: 103,
    title: 'Test Product 2',
    slug: 'test-product-2',
    price: 15.0,
    quantity: 5,
    images: ['https://via.placeholder.com/150'],
};

const REVIEWS = {
  content: [],
  totalPages: 0
};

const PRODUCTS_WITH_FACETS = {
  products: PRODUCTS_PAGE,
  filterParameters: [
    {
      id: 'brand',
      name: 'Značka',
      type: 'BRAND',
      values: [
        { id: 'brand-1', name: 'Test Brand', count: 1 }
      ]
    }
  ]
};

const CART_WITH_ITEM = {
  cartId: 'cart-123',
  products: [
    {
      id: 101,
      productId: 101,
      title: 'Test Product 1',
      slug: 'test-product-1',
      price: 10.0,
      quantity: 1,
      images: ['https://via.placeholder.com/150'],
    }
  ],
  totalProductPrice: 10.0,
  totalPrice: 15.0, // Product + Shipping
  carriers: [
    { id: 'carrier-1', name: 'Test Carrier', price: 5.0, type: 'standard' }
  ],
  payments: [
    { id: 'payment-1', name: 'Test Payment', price: 0.0 }
  ]
};

test.beforeEach(async ({ page }) => {
  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

  // Mock common endpoints
  await page.route('**/api/homepage-grids', async route => {
    await route.fulfill({ json: HOMEPAGE_GRIDS });
  });

  await page.route('**/api/categories', async route => {
    await route.fulfill({ json: CATEGORIES });
  });

  await page.route('**/api/products?*', async route => {
    await route.fulfill({ json: PRODUCTS_PAGE });
  });

  await page.route('**/api/products/search?*', async route => {
      await route.fulfill({ json: PRODUCTS_PAGE });
  });

  await page.route('**/api/products/category/*/search?*', async route => {
      await route.fulfill({ json: PRODUCTS_WITH_FACETS });
  });

  await page.route('**/api/blogs', async route => {
      await route.fulfill({ json: [] });
  });

  await page.route('**/api/customer/context*', async route => {
      await route.fulfill({ json: { cartDto: CART_WITH_ITEM } });
  });

  await page.route('**/api/cart', async route => {
      await route.fulfill({ json: CART_WITH_ITEM });
  });

  await page.route('**/api/cart/items', async route => {
      await route.fulfill({ json: CART_WITH_ITEM });
  });

  await page.route('**/api/orders/123/confirmation', async route => {
      await route.fulfill({ json: { id: 123, products: [] } });
  });
});

test('Homepage grids are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Test Grid Title')).toBeVisible();
  await expect(page.getByText('Test Product 1')).toBeVisible();
});

test('Category is visible and accessible with filters', async ({ page }) => {
  // Mock category specific products
  await page.route('**/api/products/category/test-category?*', async route => {
    await route.fulfill({ json: PRODUCTS_PAGE });
  });

  await page.route('**/api/products/category/test-category/search?*', async route => {
      await route.fulfill({ json: PRODUCTS_WITH_FACETS });
  });

  await page.goto('/kategoria/test-category');

  // Check that products are loaded
  await expect(page.getByText('Test Product 1')).toBeVisible();

  // Verify Filter
  const filterBtn = page.getByRole('button', { name: 'Značka' });
  await expect(filterBtn).toBeVisible();
  await filterBtn.click(); // Expand

  const checkbox = page.getByLabel('Test Brand');
  await expect(checkbox).toBeVisible();
  await checkbox.check();

  await expect(checkbox).toBeChecked();
});

test('Add multiple distinct products to cart', async ({ page }) => {
   // Mock Product 1
   await page.route('**/api/products/slug/test-product-1', async route => {
       await route.fulfill({ json: PRODUCT_DETAIL_IN_STOCK });
   });
   // Mock Product 2
   await page.route('**/api/products/slug/test-product-2', async route => {
       await route.fulfill({ json: PRODUCT_2_DETAIL });
   });

   // Mock Reviews for any product
   await page.route('**/api/reviews/product/*?*', async route => {
       await route.fulfill({ json: { reviews: REVIEWS, averageRating: 0, reviewsCount: 0 } });
   });

   // Mock Related for any product
   await page.route('**/api/products/*/related', async route => {
       await route.fulfill({ json: [] });
   });

   // Mock Cart with 2 items
   const CART_2_ITEMS = {
       ...CART_WITH_ITEM,
       products: [
           ...CART_WITH_ITEM.products,
           { ...PRODUCT_2_DETAIL, productId: 103, id: 103 }
       ]
   };

   await page.route('**/api/cart', async route => {
        await route.fulfill({ json: CART_2_ITEMS });
   });

   await page.route('**/api/customer/context*', async route => {
        await route.fulfill({ json: { cartDto: CART_2_ITEMS } });
   });

   await page.goto('/produkt/test-product-1');
   await page.getByRole('button', { name: 'Do košíka' }).click();

   await page.goto('/produkt/test-product-2');
   await page.getByRole('button', { name: 'Do košíka' }).click();

   await page.goto('/cart');
   await expect(page.getByText('Test Product 1').first()).toBeVisible();
   await expect(page.getByText('Test Product 2').first()).toBeVisible();
});


test('Product detail: Add to cart (single and multiple)', async ({ page }) => {
  await page.route('**/api/products/slug/test-product-1', async route => {
    await route.fulfill({ json: PRODUCT_DETAIL_IN_STOCK });
  });
  await page.route('**/api/reviews/product/101?*', async route => {
    await route.fulfill({ json: { reviews: REVIEWS, averageRating: 4.5, reviewsCount: 1 } });
  });

  await page.route('**/api/cart/items', async route => {
      await route.fulfill({ json: { success: true } });
  });

  // Mock related products
  await page.route('**/api/products/101/related', async route => {
      await route.fulfill({ json: [] });
  });

  await page.goto('/produkt/test-product-1');

  await expect(page.getByRole('heading', { name: 'Test Product 1' })).toBeVisible();

  // Reviews visible - The component might use star rating which is usually visible
  // Or a "Reviews" tab/section.
  // Checking for generic review text or elements.
  // Based on `ProductCard.jsx`, there is `StarRating`.
  // `ProductDetail.jsx` probably has a review section.

  // Add to cart
  const addToCartBtn = page.getByRole('button', { name: 'Do košíka' });
  await expect(addToCartBtn).toBeVisible();
  await expect(addToCartBtn).toBeEnabled();

  await addToCartBtn.click();

  // Add multiple quantity
  const quantityInput = page.locator('input[type="number"]');
  if (await quantityInput.isVisible()) {
      await quantityInput.fill('3');
      await addToCartBtn.click();
  }
});

test('Product out of stock', async ({ page }) => {
  await page.route('**/api/products/slug/out-of-stock-product', async route => {
    await route.fulfill({ json: PRODUCT_DETAIL_OUT_OF_STOCK });
  });
  await page.route('**/api/reviews/product/102?*', async route => {
      await route.fulfill({ json: { reviews: REVIEWS, averageRating: 0, reviewsCount: 0 } });
  });
  await page.route('**/api/products/102/related', async route => {
      await route.fulfill({ json: [] });
  });

  await page.goto('/produkt/out-of-stock-product');

  await expect(page.getByText('Vypredané')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Do košíka' })).not.toBeVisible();
  await expect(page.getByText('Strážiť dostupnosť')).toBeVisible();
});

test('Cart and Checkout flow', async ({ page }) => {
  // Override cart mock for this test
  await page.route('**/api/cart', async route => {
      if (route.request().method() === 'PUT') {
           await route.fulfill({ json: { ...CART_WITH_ITEM, discountForNewsletter: false } });
           return;
      }
      await route.fulfill({ json: CART_WITH_ITEM });
  });

  await page.goto('/cart');
  await expect(page.getByText('Test Product 1').first()).toBeVisible();

  // Proceed to checkout
  await page.getByRole('link', { name: 'Pokračovať v objednávke' }).click();

  await expect(page).toHaveURL(/.*\/order/);

  // Fill form
  await page.fill('input[name="firstname"]', 'Janko');
  await page.fill('input[name="lastname"]', 'Hrasko');
  await page.fill('input[name="email"]', 'janko@example.com');
  await page.fill('input[name="phone"]', '+421944123456');

  await page.fill('input[name="street"]', 'Hlavna 1');
  await page.fill('input[name="city"]', 'Bratislava');
  await page.fill('input[name="zip"]', '81101');

  // Select carrier
  await page.click('input[name="carrier"][value="carrier-1"]');

  // Select payment
  await page.click('input[name="payment"][value="payment-1"]');

  // Mock order creation
  await page.route('**/api/orders', async route => {
      await route.fulfill({ json: { id: 123 } });
  });

  // Submit
  await page.getByRole('button', { name: 'Objednať s povinnosťou platby' }).click();

  await expect(page).toHaveURL(/.*\/order\/confirmation\/123/);
});
