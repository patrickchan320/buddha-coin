import i18next from 'i18next';

let lang={
  en:{
    'test_inc_tab':'Tokens',
    'test_game_tab':'Game',
    'test_payout_tab':'Payout',
    'test_wallet_not_available':'Wallet not available',
    'test_price_label':'Buy INC at',
    'test_balance_label':'You have',
    'test_balance':'{{balance}} INC',
    'test_register':'Register',
    'test_end':'Ends in',
    'test_get_buy_price':'Quote price',
    'test_buy':'Buy',
    'test_pot':'Pot',
    'test_restart':'Restart game',
    'test_pot_size':'{{pot}} INC',
    'test_price':'{{price}} ETH',
    'test_get_pot':'Query Pot Size',
    'test_bid':'Bid',
    'test_ended':'Game Ended?',
    'test_win':'Payout',
    'test_approve':'Approve',
    'test_get_end_time':'Query end time',
    'test_get_balance':'View INC Balance'
  }
};


i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en', // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: lang.en,
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
