from typing import Tuple


from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By


class deckParser:
    BROWSER = Chrome(executable_path='D:/git_repos/commanderReporter/src/analyticSvc/parserMod/chromedriver.exe')
    
    # Link is temporary and used for debug
    @classmethod
    def get_decklist(cls, target_link: str = 'https://www.moxfield.com/decks/_Acjj_bd7EibE_Svr1MQzw', commanders: Tuple[str] = None) -> None:
        cls.BROWSER.maximize_window()
        cls.BROWSER.get(target_link)
        cls.BROWSER.find_element(By.CSS_SELECTOR, '#subheader-more > .d-none').click()
        cls.BROWSER.find_element(By.CSS_SELECTOR, '.dropdown-item:nth-child(1)').click()
        cls.BROWSER.find_element(By.CSS_SELECTOR, '.btn:nth-child(4) > .btn-ripple-container').click()
        