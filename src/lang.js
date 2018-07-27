import i18next from 'i18next';

let lang = {
  en: {
    'test_inc_tab': 'Tokens',
    'test_game_tab': 'Game',
    'test_payout_tab': 'Payout',
    'test_wallet_not_available': 'Wallet not available',
    'test_price_label': 'Buy INC at',
    'test_balance_label': 'You have',
    'test_balance': '{{balance}} INC',
    'test_register': 'Register',
    'test_end': 'Ends in',
    'test_get_buy_price': 'Quote Buy',
    'test_buy': 'Buy',
    'test_sell': 'Sell',
    'test_pot': 'Pot',
    'test_restart': 'Restart game',
    'test_pot_size': '{{pot}} INC',
    'test_price': '{{buy}} ETH/{{sell}} ETH',
    'test_get_pot': 'Query Pot Size',
    'test_bid': 'Bid',
    'test_ended': 'Game Ended?',
    'test_win': 'Payout',
    'test_get_sell_price': 'Quote Sell',
    'test_approve': 'Approve',
    'test_get_end_time': 'Query end time',
    'test_get_balance': 'View INC Balance',

    'head_register': 'Register',
    'head_price': '{{price}}',
    'main_pot': 'The last standing contributor will have',
    'main_contribute': '',
    'main_price_error': '',
    'main_game_status_error': '',
    'main_thank': ''

  },
  zh: {
    'head_register': '登記',
    'head_not_started': '時辰未到',
    'head_balance': '{{balance}} 綫香',
    'head_price': '{{price}} ETH',
    'icon_eth': 'ETH',
    'icon_inc': '綫香',
    'icon_time': '剩餘時間',
    'icon_share': '分享',
    'main_pot_intro': '最後一名善信將得到',
    'main_contribute': '供奉',
    'main_pot': '{{pot}} ETH',
    'main_thank': '阿彌陀佛，福有尤歸',
    'main_price_error': '施主，有緣無份',
    'main_game_status_error': '施主，有緣無份'
  }
};


i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'zh', // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: lang.en,
      },
      zh: {
        translation: lang.zh,
      },
      es: {
        translation: {
          age: {label: 'Años',},
          home: {label: 'Casa',},
          name: {label: 'Nombre',},
        },
      },
    },
  });

export default i18next;
