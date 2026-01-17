import json
import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# -----------------------------
# Charger les données depuis JSON
# -----------------------------
data_path = os.path.join(os.path.dirname(__file__), "..", "data.json")
with open(data_path, "r") as f:
    data = json.load(f)


# -----------------------------
# Fixture pytest pour le driver
# -----------------------------
@pytest.fixture
def driver():
    chrome_options = Options()

    # Headless moderne (recommandé)
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
def login(driver, login_data, url):
    driver.get(url)
    driver.find_element(By.ID, "user-name").clear()
    driver.find_element(By.ID, "password").clear()
    driver.find_element(By.ID, "user-name").send_keys(login_data["username"])
    driver.find_element(By.ID, "password").send_keys(login_data["password"])
    driver.find_element(By.ID, "login-button").click()

def get_error_message(driver):
    error_elem = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h3[data-test='error']"))
    )
    return error_elem.text

def close_error(driver):
    driver.find_element(By.CLASS_NAME, "error-button").click()
    time.sleep(1)

# -----------------------------
# Tests pytest
# -----------------------------
def test_invalid_user(driver):
    login(driver, data["login_invalid"], data["url"])
    assert get_error_message(driver) == data["error_messages"]["invalid"]
    close_error(driver)

def test_no_username(driver):
    login(driver, data["login_no_username"], data["url"])
    assert get_error_message(driver) == data["error_messages"]["username_required"]
    close_error(driver)

def test_no_password(driver):
    login(driver, data["login_no_password"], data["url"])
    assert get_error_message(driver) == data["error_messages"]["password_required"]
    close_error(driver)
