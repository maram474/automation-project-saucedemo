import { expect } from '@playwright/test';

/**
 * ============================================================================
 * HELPERS D'ACHAT - Fonctions pour les tests E2E de parcours d'achat
 * ============================================================================
 */

/**
 * Vérifier qu'un produit affiche correctement toutes ses informations
 * @param {Page} page - Instance de la page Playwright
 * @param {Object} product - Objet contenant les données du produit
 */
export async function verifyProduct(page, product) {
  try {
    console.log(`🔍 Vérification du produit: ${product.name}`);

    const productCard = page.locator('.inventory_item').filter({ hasText: product.name });
    await expect(productCard).toBeVisible();

    await expect(productCard.locator('.inventory_item_name')).toHaveText(product.name);
    console.log(`  ✅ Nom du produit vérifié: ${product.name}`);

    const priceElement = productCard.locator('.inventory_item_price');
    await expect(priceElement).toHaveText(product.price);
    console.log(`  ✅ Prix vérifié: ${product.price}`);

    const imageElement = productCard.locator('.inventory_item_img img');
    await expect(imageElement).toBeVisible();
    const imageSrc = await imageElement.getAttribute('src');
    expect(imageSrc).toContain(product.image);
    console.log(`  ✅ Image vérifiée`);

    const addButton = productCard.locator('button[class*="btn_inventory"]');
    await expect(addButton).toBeVisible();
    console.log(`  ✅ Bouton "Add to cart" vérifié`);

    console.log(`✅ Produit "${product.name}" entièrement vérifié`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la vérification du produit: ${product.name}`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/verify-product-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Ajouter un produit au panier
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit à ajouter
 */
export async function addProductToCart(page, productName) {
  try {
    console.log(`🛒 Ajout du produit au panier: ${productName}`);

    const productCard = page.locator('.inventory_item').filter({ hasText: productName });
    const addButton = productCard.locator('button[class*="btn_inventory"]');

    const cartBadgeBefore = page.getByTestId('shopping-cart-badge');
    const initialCount = await cartBadgeBefore.count();

    await addButton.click();
    console.log(`  ✅ Clic sur le bouton "Add to cart"`);

    await expect(addButton).toHaveText('Remove');
    console.log(`  ✅ Le bouton est maintenant "Remove"`);

    if (initialCount === 0) {
      await expect(page.getByTestId('shopping-cart-badge')).toBeVisible();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    }
    console.log(`  ✅ Badge du panier mis à jour`);

    console.log(`✅ Produit "${productName}" ajouté au panier avec succès`);
  } catch (error) {
    console.error(`❌ ÉCHEC de l'ajout du produit au panier: ${productName}`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/add-to-cart-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Navigation vers la page du panier
 * @param {Page} page - Instance de la page Playwright
 */
export async function goToCart(page) {
  try {
    console.log(`🛒 Navigation vers le panier`);

    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByTestId('cart-contents-container')).toBeVisible();

    console.log(`✅ Page panier affichée`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la navigation vers le panier`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/go-to-cart-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Vérifier un article dans le panier
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit
 * @param {string} productPrice - Prix du produit
 */
export async function verifyCartItem(page, productName, productPrice) {
  try {
    console.log(`🔍 Vérification du produit dans le panier: ${productName}`);

    const cartItem = page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();

    await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);
    console.log(`  ✅ Nom du produit dans le panier vérifié`);

    await expect(cartItem.locator('.inventory_item_price')).toHaveText(productPrice);
    console.log(`  ✅ Prix du produit dans le panier vérifié`);

    const quantity = await cartItem.locator('.cart_quantity').textContent();
    expect(quantity).toBe('1');
    console.log(`  ✅ Quantité vérifiée: ${quantity}`);

    console.log(`✅ Article "${productName}" vérifié dans le panier`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la vérification de l'article dans le panier: ${productName}`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/verify-cart-item-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Procéder au checkout
 * @param {Page} page - Instance de la page Playwright
 */
export async function proceedToCheckout(page) {
  try {
    console.log(`➡️ Clic sur "Checkout"`);

    await page.getByTestId('checkout').click();
    await expect(page.getByTestId('checkout-info-container')).toBeVisible();

    console.log(`✅ Page de checkout affichée`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la navigation vers le checkout`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/proceed-to-checkout-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Remplir le formulaire de checkout
 * @param {Page} page - Instance de la page Playwright
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom
 * @param {string} zipCode - Code postal
 */
export async function fillCheckoutForm(page, firstName, lastName, zipCode) {
  try {
    console.log(`📝 Remplissage du formulaire de checkout`);

    await page.getByTestId('firstName').fill(firstName);
    console.log(`  ✅ Prénom rempli: ${firstName}`);

    await page.getByTestId('lastName').fill(lastName);
    console.log(`  ✅ Nom rempli: ${lastName}`);

    await page.getByTestId('postalCode').fill(zipCode);
    console.log(`  ✅ Code postal rempli: ${zipCode}`);

    await page.getByTestId('continue').click();
    await expect(page.getByTestId('checkout-summary-container')).toBeVisible();

    console.log(`✅ Formulaire soumis avec succès`);
  } catch (error) {
    console.error(`❌ ÉCHEC du remplissage du formulaire de checkout`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/fill-checkout-form-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Vérifier le récapitulatif de la commande
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit
 * @param {string} productPrice - Prix du produit
 */
export async function verifyCheckoutSummary(page, productName, productPrice) {
  try {
    console.log(`🔍 Vérification de la page de récapitulatif`);

    const summaryItem = page.locator('.cart_item').filter({ hasText: productName });
    await expect(summaryItem).toBeVisible();

    const quantity = await summaryItem.locator('.cart_quantity').textContent();
    expect(quantity).toBe('1');
    console.log(`  ✅ Quantité vérifiée: ${quantity}`);

    const priceText = productPrice.replace('$', '');
    const itemPrice = parseFloat(priceText);

    const taxText = await page.getByTestId('tax-label').textContent();
    const tax = parseFloat(taxText.replace('Tax: $', ''));
    console.log(`  💰 Taxe: $${tax}`);

    const totalText = await page.getByTestId('total-label').textContent();
    const total = parseFloat(totalText.replace('Total: $', ''));
    console.log(`  💰 Total: $${total}`);

    const expectedTotal = itemPrice + tax;
    expect(total).toBe(expectedTotal);
    console.log(`  ✅ Total vérifié: $${total} = $${itemPrice} + $${tax}`);

    console.log(`✅ Récapitulatif de commande vérifié`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la vérification du récapitulatif`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/verify-checkout-summary-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Finaliser la commande
 * @param {Page} page - Instance de la page Playwright
 */
export async function finishOrder(page) {
  try {
    console.log(`✅ Finalisation de la commande`);

    await page.getByTestId('finish').click();
    await expect(page.getByTestId('checkout-complete-container')).toBeVisible();

    console.log(`✅ Page de confirmation affichée`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la finalisation de la commande`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/finish-order-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Vérifier le message de confirmation
 * @param {Page} page - Instance de la page Playwright
 */
export async function verifyOrderConfirmation(page) {
  try {
    console.log(`🔍 Vérification du message de confirmation`);

    const confirmationMessage = page.getByTestId('complete-header');
    await expect(confirmationMessage).toBeVisible();
    await expect(confirmationMessage).toHaveText('Thank you for your order!');

    console.log(`✅ Message de confirmation vérifié: "Thank you for your order!"`);
  } catch (error) {
    console.error(`❌ ÉCHEC de la vérification du message de confirmation`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/verify-order-confirmation-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Vérifier que le badge du panier n'est plus visible
 * @param {Page} page - Instance de la page Playwright
 */
export async function verifyCartBadgeNotVisible(page) {
  try {
    console.log(`🔍 Vérification que le badge du panier n'est plus visible`);

    const cartBadge = page.getByTestId('shopping-cart-badge');
    await expect(cartBadge).not.toBeVisible();

    console.log(`✅ Badge du panier n'est plus visible`);
  } catch (error) {
    console.error(`❌ ÉCHEC: Le badge du panier est toujours visible`);
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/verify-cart-badge-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}
