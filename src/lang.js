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
    'head_balance': '{{balance}} 壇香',
    'head_price': '{{price}} ETH',
    'head_game_ended':'燈滅',
    'head_referrals':'{{referrals}} 有緣人',
    'head_bonus':'{{bonus}} 善緣',
    'icon_eth': 'ETH',
    'icon_inc': '壇香',
    'icon_time': '剩餘時間',
    'icon_referrals':'有緣人',
    'icon_bonus':'善緣',
    'icon_share': '分享',
    'share_link':'http://buddhacoin.today/{{username}}',
    'sect_greed':'貪',
    'sect_anger':'嗔',
    'sect_obsession':'癡',
    'main_transaction_cancel':'施主何苦',
    'main_explain_bonus':'施主廣結善緣，可換取壇香禮佛',
    'main_explain_referrals':'施主與佛有緣，陪同其他有緣人到訪，所添香油，亦是施主功德',
    'main_register_sect':'請選擇門派',
    'main_pot_intro': '燈滅剎那 觀音借庫',
    'main_contribute': '誠心上香供奉',
    'main_allow_approve':'施主請添香油',
    'main_allow_bid':'施主請上香',
    'main_processing':'施主請稍等',
    'main_buy_price':'每注壇香 {{buy}} ETH',
    'main_sorry':'請施主三思',
    'main_bidder':'予 {{bidder}}',
    'main_pot': '{{pot}} ETH',
    'main_explain_time':'殿中長明燈皆由善信香油資火，燈滅剎那觀音借庫予有緣人',
    'main_explain_price':'施主若要壇香，可向貧僧購買，每支 {{buy}} ETH；貧僧亦可回購壇香手上壇香，每支 {{sell}} ETH',
    'main_dialogue_image':'',
    'main_network_wrong':'施主，請移玉步，遠離主網',
    'main_thank': '阿彌陀佛，功德無量，福有攸歸',
    'main_price_error': '施主，有緣無份',
    'main_game_status_error': '施主，有緣無份',
    'main_register_username':'法號',
    'main_register_cta':'敢問施主尊姓大名',
    'main_register_empty_username':'',
    'main_buy_quantity':'數量',
    'main_buy_cta':'我不入佛幣，誰入佛幣？',
    'main_quantity_error':'本來無一物，何處買佛幣？',
    'main_buy_cost':'以 {{cost}} ETH 購買',
    'main_buy':'購買',
    'main_register_success':'歡迎施主光臨',
    'main_register_refer':'善緣人',
    'main_page_title':'觀音借庫',
    'main_register':'登記'
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
