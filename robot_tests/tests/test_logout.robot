*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can Logout Successfully
    [Documentation]    Vérifie que l'utilisateur peut se déconnecter correctement
    Open Application Browser
    Login With Standard User
    Logout From Application
    Verify Login Page Is Displayed
