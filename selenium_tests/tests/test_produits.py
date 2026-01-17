import json
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.chrome.options import Options


# -----------------------------
# Charger les produits depuis le JSON
# -----------------------------
with open("data.json", "r") as f:
    data = json.load(f)

products = data["products"]


# -----------------------------
# Fixture pytest pour le driver
# -----------------------------
@pytest.fixture
def driver():
    chrome_options = Options()

    # Headless (compatible CI/CD)
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    # Options originales
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--no-default-browser-check")

    prefs = {
        "profile.password_manager_enabled": False,
        "credentials_enable_service": False
    }
    chrome_options.add_experimental_option("prefs", prefs)

    # ✅ Selenium gère automatiquement ChromeDriver
    driver = webdriver.Chrome(options=chrome_options)

    yield driver
    driver.quit()


# -----------------------------
# Fonctions utilitaires
# -----------------------------
def login(driver, login_data=data["login"], url=data["url"]):
    driver.get(url)
    driver.find_element(By.ID, "user-name").send_keys(login_data["username"])
    driver.find_element(By.ID, "password").send_keys(login_data["password"])
    driver.find_element(By.ID, "login-button").click()
    time.sleep(2)

def verify_all_products_present(driver, products):
    product_elements = driver.find_elements(By.CLASS_NAME, "inventory_item_name")
    product_names = [p.text for p in product_elements]
    for product in products:
        assert product["name"] in product_names, f"Produit manquant: {product['name']}"

def verify_image_visible(driver, product):
    img_elem = driver.find_element(By.CSS_SELECTOR, product["img_selector"])
    assert img_elem.is_displayed(), f"L'image pour {product['name']} n'est pas visible"

def verify_add_to_cart_button(driver, product):
    button_elem = driver.find_element(By.CSS_SELECTOR, product["button_selector"])
    assert button_elem.is_displayed(), f"Le bouton 'Add to cart' pour {product['name']} n'est pas visible"

def verify_product_name_clickable(driver, product):
    name_elem = driver.find_element(By.CSS_SELECTOR, product["name_selector"])
    assert name_elem.is_displayed(), f"Le nom du produit {product['name']} n'est pas cliquable"

def return_to_products(driver):
    driver.find_element(By.ID, "back-to-products").click()
    time.sleep(1)

def verify_total_products(driver, expected_count):
    all_items = driver.find_elements(By.CLASS_NAME, "inventory_item")
    assert len(all_items) == expected_count, f"Nombre de produits incorrect: {len(all_items)}"

# -----------------------------
# Tests pytest
# -----------------------------
def test_all_products_present(driver):
    login(driver)
    verify_all_products_present(driver, products)

@pytest.mark.parametrize("product", products)
def test_product_elements(driver, product):
    login(driver)
    verify_image_visible(driver, product)
    verify_add_to_cart_button(driver, product)
    verify_product_name_clickable(driver, product)

def test_total_products(driver):
    login(driver)
    verify_total_products(driver, len(products))
