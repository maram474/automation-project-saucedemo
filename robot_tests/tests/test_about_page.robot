*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can Open About Page
    [Documentation]    Vérifie que l'utilisateur peut ouvrir la page About depuis le menu burger
    Open Application Browser
    Login With Standard User
    Open Burger Menu
    Click About And Verify Saucelabs Page
    Return To Application
