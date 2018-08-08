module.exports={
  wsProviderUrl:'ws://localhost:8545',
  wsEnabled:true,
  // providerUrl:'https://localhost:8545',
  gas:600000,
  network:'private',
  contracts:{
    mercy:'0xfae2015e6af0cded62463292d5d63835d265cc59',
    exchange:'0x2ab9c62abd4677f54d729f14561526d430db08a8',
    token:'0x31cc1c4c0b09e99fb36ed6e099219b9a546c7c94'
  }
};
//
// module.exports={
//   wsProviderUrl:'wss://rinkeby.infura.io/ws',
//   wsEnabled:false,
//   network:'rinkeby',
//   contracts:{
//     mercy:'0xedf5327862d042431639e556917fe4f99fbc5e32',
//     exchange:'0xdb041626b36953f8b834e671dab8782184b4d9d3',
//     token:'0x834609d964a0f902ad79d5dc51ce6b4cfa4f3b1b'
//   }
// };
/*
module.exports={
  providerUrl:'wss://rinkeby.infura.io/ws',
  network:'rinkeby'
};
*/