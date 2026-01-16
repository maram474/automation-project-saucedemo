*** Settings ***
Documentation     Full Burger Menu Test - SauceDemo (Corrected & Robust)
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
Burger Menu - Full Corrected Scenario
    [Documentation]    Complete burger menu scenario with strong validations
    Open Application Browser
    Login With Standard User
    Open Burger Menu
    Verify Burger Menu Is Open
    Verify Burger Menu Options
    Click All Items And Stay On Products Page
    Click About And Verify Saucelabs Page
    Return To Application
    # Add Product To Cart
    Reset App State
    Verify Cart Is Empty
    Logout From Application
    Verify Login Page Is Displayed
