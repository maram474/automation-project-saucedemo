const { expect } = require('@playwright/test');

/**
 * Connecte un utilisateur au site SauceDemo
 * @param {Page} page - Instance de la page Playwright
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @throws {Error} Si la connexion échoue
 */
async function login(page, username, password) {
  try {
    console.log(`🔐 Connexion avec l'utilisateur: ${username}`);

    // Navigation vers la page d'accueil
    await page.goto('/');

    // Remplissage du formulaire de connexion
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-button').click();

    // Vérification que la page des produits est affichée
    await expect(page.getByTestId('inventory-container')).toBeVisible();

    console.log('✅ Connexion réussie');
  } catch (error) {
    console.error('❌ ÉCHEC de la connexion');
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({ path: `screenshots/login-fail-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}

/**
 * Vérifie qu'un produit affiche correctement toutes ses informations
 * @param {Page} page - Instance de la page Playwright
 * @param {Object} product - Objet contenant les données du produit (name, price, image, button)
 * @throws {Error} Si une vérification échoue
 */
async function verifyProduct(page, product) {
  try {
    console.log(`🔍 Vérification du produit: ${product.name}`);

    // Localisation de la carte produit
    const productCard = page.locator('.inventory_item').filter({ hasText: product.name });
    await expect(productCard).toBeVisible();

    // Vérification du nom du produit
    await expect(productCard.locator('.inventory_item_name')).toHaveText(product.name);
    console.log(`  ✅ Nom du produit vérifié: ${product.name}`);

    // Vérification du prix
    const priceElement = productCard.locator('.inventory_item_price');
    await expect(priceElement).toHaveText(product.price);
    console.log(`  ✅ Prix vérifié: ${product.price}`);

    // Vérification de l'image
    const imageElement = productCard.locator('.inventory_item_img img');
    await expect(imageElement).toBeVisible();
    const imageSrc = await imageElement.getAttribute('src');
    expect(imageSrc).toContain(product.image);
    console.log(`  ✅ Image vérifiée`);

    // Vérification du bouton "Add to cart"
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
 * Ajoute un produit au panier et vérifie les changements d'état
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit à ajouter
 * @throws {Error} Si l'ajout au panier échoue
 */
async function addProductToCart(page, productName) {
  try {
    console.log(`🛒 Ajout du produit au panier: ${productName}`);

    // Localisation de la carte produit et du bouton
    const productCard = page.locator('.inventory_item').filter({ hasText: productName });
    const addButton = productCard.locator('button[class*="btn_inventory"]');

    // Récupération du nombre d'articles dans le panier avant l'ajout
    const cartBadgeBefore = page.getByTestId('shopping-cart-badge');
    const initialCount = await cartBadgeBefore.count();

    // Clic sur le bouton "Add to cart"
    await addButton.click();
    console.log(`  ✅ Clic sur le bouton "Add to cart"`);

    // Vérification que le bouton devient "Remove"
    await expect(addButton).toHaveText('Remove');
    console.log(`  ✅ Le bouton est maintenant "Remove"`);

    // Vérification de la mise à jour du badge du panier
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
 * @throws {Error} Si la navigation échoue
 */
async function goToCart(page) {
  try {
    console.log(`🛒 Navigation vers le panier`);

    // Clic sur l'icône du panier
    await page.getByTestId('shopping-cart-link').click();

    // Vérification de l'affichage de la page panier
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
 * Vérifie qu'un article dans le panier affiche les bonnes informations
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit à vérifier
 * @param {string} productPrice - Prix attendu du produit
 * @throws {Error} Si une vérification échoue
 */
async function verifyCartItem(page, productName, productPrice) {
  try {
    console.log(`🔍 Vérification du produit dans le panier: ${productName}`);

    // Localisation de l'article dans le panier
    const cartItem = page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();

    // Vérification du nom
    await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);
    console.log(`  ✅ Nom du produit dans le panier vérifié`);

    // Vérification du prix
    await expect(cartItem.locator('.inventory_item_price')).toHaveText(productPrice);
    console.log(`  ✅ Prix du produit dans le panier vérifié`);

    // Vérification de la quantité
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
 * Procède au checkout depuis la page panier
 * @param {Page} page - Instance de la page Playwright
 * @throws {Error} Si la navigation vers le checkout échoue
 */
async function proceedToCheckout(page) {
  try {
    console.log(`➡️ Clic sur "Checkout"`);

    // Clic sur le bouton Checkout
    await page.getByTestId('checkout').click();

    // Vérification de l'affichage du formulaire de checkout
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
 * Remplit le formulaire d'informations de livraison
 * @param {Page} page - Instance de la page Playwright
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom de famille
 * @param {string} zipCode - Code postal
 * @throws {Error} Si le remplissage du formulaire échoue
 */
async function fillCheckoutForm(page, firstName, lastName, zipCode) {
  try {
    console.log(`📝 Remplissage du formulaire de checkout`);

    // Remplissage du prénom
    await page.getByTestId('firstName').fill(firstName);
    console.log(`  ✅ Prénom rempli: ${firstName}`);

    // Remplissage du nom
    await page.getByTestId('lastName').fill(lastName);
    console.log(`  ✅ Nom rempli: ${lastName}`);

    // Remplissage du code postal
    await page.getByTestId('postalCode').fill(zipCode);
    console.log(`  ✅ Code postal rempli: ${zipCode}`);

    // Clic sur le bouton Continue
    await page.getByTestId('continue').click();

    // Vérification de l'affichage de la page récapitulatif
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
 * Vérifie le récapitulatif de la commande (quantité, prix, taxes, total)
 * @param {Page} page - Instance de la page Playwright
 * @param {string} productName - Nom du produit
 * @param {string} productPrice - Prix du produit (format: $XX.XX)
 * @throws {Error} Si une vérification échoue
 */
async function verifyCheckoutSummary(page, productName, productPrice) {
  try {
    console.log(`🔍 Vérification de la page de récapitulatif`);

    // Localisation de l'article dans le récapitulatif
    const summaryItem = page.locator('.cart_item').filter({ hasText: productName });
    await expect(summaryItem).toBeVisible();

    // Vérification de la quantité
    const quantity = await summaryItem.locator('.cart_quantity').textContent();
    expect(quantity).toBe('1');
    console.log(`  ✅ Quantité vérifiée: ${quantity}`);

    // Extraction et conversion des prix
    const priceText = productPrice.replace('$', '');
    const itemPrice = parseFloat(priceText);

    // Récupération de la taxe
    const taxText = await page.getByTestId('tax-label').textContent();
    const tax = parseFloat(taxText.replace('Tax: $', ''));
    console.log(`  💰 Taxe: $${tax}`);

    // Récupération du total
    const totalText = await page.getByTestId('total-label').textContent();
    const total = parseFloat(totalText.replace('Total: $', ''));
    console.log(`  💰 Total: $${total}`);

    // Vérification du calcul: Total = Prix + Taxe
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
 * Finalise la commande en cliquant sur le bouton Finish
 * @param {Page} page - Instance de la page Playwright
 * @throws {Error} Si la finalisation échoue
 */
async function finishOrder(page) {
  try {
    console.log(`✅ Finalisation de la commande`);

    // Clic sur le bouton Finish
    await page.getByTestId('finish').click();

    // Vérification de l'affichage de la page de confirmation
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
 * Vérifie que le message de confirmation de commande est affiché
 * @param {Page} page - Instance de la page Playwright
 * @throws {Error} Si le message n'est pas trouvé
 */
async function verifyOrderConfirmation(page) {
  try {
    console.log(`🔍 Vérification du message de confirmation`);

    // Localisation et vérification du message de confirmation
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
 * Vérifie que le badge du panier n'est plus visible après la commande
 * @param {Page} page - Instance de la page Playwright
 * @throws {Error} Si le badge est toujours visible
 */
async function verifyCartBadgeNotVisible(page) {
  try {
    console.log(`🔍 Vérification que le badge du panier n'est plus visible`);

    // Vérification que le badge n'est pas affiché
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

module.exports = {
  login,
  verifyProduct,
  addProductToCart,
  goToCart,
  verifyCartItem,
  proceedToCheckout,
  fillCheckoutForm,
  verifyCheckoutSummary,
  finishOrder,
  verifyOrderConfirmation,
  verifyCartBadgeNotVisible
};
