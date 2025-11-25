const Examples = {
  getBlockByHashOrNumber: {
    hash: "00000000000000000118ec71334b69d8f3a4820a3a8cf0ad90bbcc3834a7ccc5",
    height: 926553,
    version: 720543744,
    timestamp: 1764048476,
    nonce: 1253650902,
    bits: "180139da",
    difficulty: "896827403060.5153",
    merkleRoot:
      "d3498828159adb9e2ad36715e5c03c4cfad444cc0eefe1e3069f79fc3161cda3",
    transactionCount: 30,
    size: 46184,
    weight: 0,
    previousBlockHash:
      "0000000000000000011e9e7136cc93034f8d1431ab17843ead3a9b83d970e65c",
    nextBlockHash:
      "00000000000000000084eeed1b13372683cdb729cae0ec4de2c9b60d897cd656",
    medianTime: 1764044727,
    strippedSize: 0,
    transactions: [
      "815b12f1b748ae9e24cdb193e30e7ad18ed2804abdc24e10481f74654b00585d",
      "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
      "0886e2d821cc4ce5b8cd940ec762ca206096dc32cf6894bd3cfb25e0b68bb1d2",
      "155c480753729bde3b07db9ad8b5468157c211885197865627956b37ab03f5c5",
      "1d0bf4a300dd03e9e1f96769a75bf509fedc59ac9bbc85fbdec43dcbc7bac6e5",
      "20804bb5d9e2892382692acdc5849f4068c85e647970569fa057c2b36fd9886e",
      "22ace5d7a41268ac809da85fd9e3ff0b0b9472aae31d0a60734aacb4f64fab91",
      "22be82bb8bc6c7d97c2c0731150e4d0e1937a43c1eaaca709200e8dd76fafdfc",
      "25d2f24cfdd4f7f710a45ae6b7c843d3dd361e3b405e49e297cf62087988b2af",
      "32f88392e7a333558d2e95f3c895a7d14062cd2111a2bff90f07d8d7413f5ec6",
      "33c8c90d6b9a3c36b7d0c09db0c9e6a068b3a6f128bf7343af6c05ce72b44227",
      "4abd60d69210186edc9aac6450985e88a343ee81cf29c349ee9b01c5cf2aff46",
      "4ca63963b65e78dacf0768f911d0297980b6a363735f35bbddd509e4ff053cf4",
      "535d5b2dbe2914f1b8f9b3f36001b274f5a8acdb5c7f2cec7222e3a7746e7052",
      "5ef3c82752aae16ef63e211e321fcd82e30219f2e48d8d4df8d2ab8847b35ccf",
      "6da5d67faa9ab8aba148e364194e7f24bee8da5d84b17a4cedda3a1f3c25bffd",
      "74507f1ce9157f08e0bbee05a43c6f0d38ba9eab4b2a42bd3a59b3203266eb2f",
      "85ddf75797851bbb831990f49e18c1abc68d960864741581655074951256e2e7",
      "8a3dbf594eb265ccf558c2d96e58d5f2d583bb73eb3bebfea3e3e1be0a7f7a6e",
      "922c07ef4c9ea804ca01f6ceea1be6ac03fffe971af927a78791fc39cc347f40",
      "afab8c425b9587a492886e3faf238b664ae687c4c76a42f54a53aff0f4799129",
      "b3fe5632e1b679d01f7490b75bda1cac5c278726c31761b1175ee92c1eb56bdc",
      "b5eaf38fb02011249f52c56272e01703f91c8e956fa69310a2f30b482ecf716a",
      "b824723b1ae855f364655b74ea1269410008ef68519ce2d0476d03f6ae9d3f4b",
      "cd92c1b6dfa448ec9865a1ec0b275b583a75208724de58827666b4e6a9711d77",
      "cf067cde4cee622ce00370bf16663a039b585fa544782a4aef39ca906782129f",
      "d5ed86136b410f16a0f917d0d3e402fc62b03723395928595b6f0f903123f2a8",
      "d9f8ba5243575fcadd8985e0024e553782d0746c9ae5e9b00c0a2999358103b2",
      "dd4392136234f59590490802a26ebd719eec03ee09bb2b1a68c1967a3078917e",
      "e8fd571f9ea68938aa00bc0a3dabba514771568ebf55b8e0bcdfe8482a33c653",
    ],
    ablastate: {
      epsilon: 16000000,
      beta: 16000000,
      blockSize: 46184,
      blockSizeLimit: 32000000,
      nextBlockSizeLimit: 32000000,
    },
  },

  getTransactionByTransactionId: {
    id: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
    index: 1,
    hash: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
    version: 2,
    lockTime: 0,
    size: 2228,
    vsize: 0,
    weight: 0,
    fee: "0.00002229",
    vinCount: 15,
    voutCount: 2,
    blockHeight: 926553,
    blockHash:
      "00000000000000000118ec71334b69d8f3a4820a3a8cf0ad90bbcc3834a7ccc5",
    blockTimestamp: 1764048476,
    vin: [
      {
        index: 0,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "f84d36424653f169ba9ae9dd8e131607e322df37156f01f81d0efa4223db7b50",
        voutIndex: 3,
        scriptSig: {
          asm: "8e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe902501710[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "418e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe90250171041210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 1,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "53078a21a63322b14a2353d53341ac56c1bea796ea9e8b79145ec40e73e6a77a",
        voutIndex: 3,
        scriptSig: {
          asm: "93f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e67[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "4193f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e6741210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 2,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "668d54eaa7bc35ff116a26044bdcd30bcafe3307805a1b8ddc5d9e2d4617627f",
        voutIndex: 3,
        scriptSig: {
          asm: "97030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "4197030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 3,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "07865ee692e76e222656560555026f6b42b4c96dfb7354d10a3d7614d739b61c",
        voutIndex: 3,
        scriptSig: {
          asm: "ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 4,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "fb78b2b225ebd3338e9180dfed3c46b78ce92f375cffcfdd268ca1696f4c5bcb",
        voutIndex: 3,
        scriptSig: {
          asm: "a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 5,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "cf450cea5e166630b8ab28754219bc1dcf79282cc43b8c2d79bb24e25c52cf6c",
        voutIndex: 3,
        scriptSig: {
          asm: "89ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "4189ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 6,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "34857ac488965cff8cd5969e2924dce2fe6c02049bb49d0caf7c3202b5483481",
        voutIndex: 3,
        scriptSig: {
          asm: "f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 7,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "518476e8c694419e9c6ff9cc1d8d0670f9509042ae32d81c638c29ea50802ab1",
        voutIndex: 3,
        scriptSig: {
          asm: "c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 8,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "1089fb4745e829521fa14381ab1bad4ae2342dd296109aad17312fc79199ece3",
        voutIndex: 3,
        scriptSig: {
          asm: "8d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "418d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 9,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "ade18df170ad0dabdf4e4483cbafa352c7041a838d75a9d708bcc0211e11f858",
        voutIndex: 3,
        scriptSig: {
          asm: "181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 10,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "42692ccea87e46fe664377ab30e9ec2f237b340a51ee90d61b4a9b5a2b00de11",
        voutIndex: 3,
        scriptSig: {
          asm: "fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 11,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "bf1e3cf7e1cdae4edfa693f2d9623125115438da1cb4cbe67390c90cfee41f7b",
        voutIndex: 3,
        scriptSig: {
          asm: "367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a6133[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a613341210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 12,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "f303155501ecbb8fca58d74fa1a2544abbd8f2619cead73cf6896f7fd0ef828a",
        voutIndex: 3,
        scriptSig: {
          asm: "ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e86[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e8641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 13,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.000008",
        coinbase: null,
        voutTransactionId:
          "f5f73a668f0dfa79c62bbb589c020b36cf47e5c51c56467283b5fad27fee1673",
        voutIndex: 3,
        scriptSig: {
          asm: "faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb6[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "1",
      },
      {
        index: 14,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.00006224",
        coinbase: null,
        voutTransactionId:
          "f552736a37f1548be27d79c1414d5d00ab4dc9745f150c05bb9a743884818614",
        voutIndex: 2,
        scriptSig: {
          asm: "cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb19[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          hex: "41cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb1941210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
          type: "pubkeyhash",
        },
        sequence: 0,
        witness: [],
      },
    ],
    vout: [
      {
        index: 0,
        address: "qre48n77qyyclplgkfagstkpya68q9rg6uxg5njc4p",
        value: "0.00001",
        scriptPubKey: {
          asm: "OP_DUP OP_HASH160 f353cfde01098f87e8b27a882ec12774701468d7 OP_EQUALVERIFY OP_CHECKSIG",
          hex: "76a914f353cfde01098f87e8b27a882ec12774701468d788ac",
          type: "pubkeyhash",
        },
        tokenCategory:
          "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
        tokenAmount: "14",
      },
      {
        index: 1,
        address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
        value: "0.00014195",
        scriptPubKey: {
          asm: "OP_DUP OP_HASH160 84640233fd04f52017846ed7e9491dfea788b629 OP_EQUALVERIFY OP_CHECKSIG",
          hex: "76a91484640233fd04f52017846ed7e9491dfea788b62988ac",
          type: "pubkeyhash",
        },
      },
    ],
  },

  getTransactionsByAccount: {
    rpp: 1,
    page: 1,
    count: 1800,
    items: [
      {
        id: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
        index: 1,
        hash: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
        version: 2,
        lockTime: 0,
        size: 2228,
        vsize: 0,
        weight: 0,
        fee: "0.00002229",
        vinCount: 15,
        voutCount: 2,
        blockHeight: 926553,
        blockHash:
          "00000000000000000118ec71334b69d8f3a4820a3a8cf0ad90bbcc3834a7ccc5",
        blockTimestamp: 1764048476,
        vin: [
          {
            index: 0,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "f84d36424653f169ba9ae9dd8e131607e322df37156f01f81d0efa4223db7b50",
            voutIndex: 3,
            scriptSig: {
              asm: "8e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe902501710[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "418e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe90250171041210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 1,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "53078a21a63322b14a2353d53341ac56c1bea796ea9e8b79145ec40e73e6a77a",
            voutIndex: 3,
            scriptSig: {
              asm: "93f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e67[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "4193f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e6741210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 2,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "668d54eaa7bc35ff116a26044bdcd30bcafe3307805a1b8ddc5d9e2d4617627f",
            voutIndex: 3,
            scriptSig: {
              asm: "97030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "4197030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 3,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "07865ee692e76e222656560555026f6b42b4c96dfb7354d10a3d7614d739b61c",
            voutIndex: 3,
            scriptSig: {
              asm: "ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 4,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "fb78b2b225ebd3338e9180dfed3c46b78ce92f375cffcfdd268ca1696f4c5bcb",
            voutIndex: 3,
            scriptSig: {
              asm: "a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 5,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "cf450cea5e166630b8ab28754219bc1dcf79282cc43b8c2d79bb24e25c52cf6c",
            voutIndex: 3,
            scriptSig: {
              asm: "89ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "4189ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 6,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "34857ac488965cff8cd5969e2924dce2fe6c02049bb49d0caf7c3202b5483481",
            voutIndex: 3,
            scriptSig: {
              asm: "f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 7,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "518476e8c694419e9c6ff9cc1d8d0670f9509042ae32d81c638c29ea50802ab1",
            voutIndex: 3,
            scriptSig: {
              asm: "c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 8,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "1089fb4745e829521fa14381ab1bad4ae2342dd296109aad17312fc79199ece3",
            voutIndex: 3,
            scriptSig: {
              asm: "8d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "418d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 9,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "ade18df170ad0dabdf4e4483cbafa352c7041a838d75a9d708bcc0211e11f858",
            voutIndex: 3,
            scriptSig: {
              asm: "181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 10,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "42692ccea87e46fe664377ab30e9ec2f237b340a51ee90d61b4a9b5a2b00de11",
            voutIndex: 3,
            scriptSig: {
              asm: "fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 11,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "bf1e3cf7e1cdae4edfa693f2d9623125115438da1cb4cbe67390c90cfee41f7b",
            voutIndex: 3,
            scriptSig: {
              asm: "367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a6133[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a613341210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 12,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "f303155501ecbb8fca58d74fa1a2544abbd8f2619cead73cf6896f7fd0ef828a",
            voutIndex: 3,
            scriptSig: {
              asm: "ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e86[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e8641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 13,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.000008",
            coinbase: null,
            voutTransactionId:
              "f5f73a668f0dfa79c62bbb589c020b36cf47e5c51c56467283b5fad27fee1673",
            voutIndex: 3,
            scriptSig: {
              asm: "faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb6[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "1",
          },
          {
            index: 14,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.00006224",
            coinbase: null,
            voutTransactionId:
              "f552736a37f1548be27d79c1414d5d00ab4dc9745f150c05bb9a743884818614",
            voutIndex: 2,
            scriptSig: {
              asm: "cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb19[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              hex: "41cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb1941210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
              type: "pubkeyhash",
            },
            sequence: 0,
            witness: [],
          },
        ],
        vout: [
          {
            index: 0,
            address: "qre48n77qyyclplgkfagstkpya68q9rg6uxg5njc4p",
            value: "0.00001",
            scriptPubKey: {
              asm: "OP_DUP OP_HASH160 f353cfde01098f87e8b27a882ec12774701468d7 OP_EQUALVERIFY OP_CHECKSIG",
              hex: "76a914f353cfde01098f87e8b27a882ec12774701468d788ac",
              type: "pubkeyhash",
            },
            tokenCategory:
              "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
            tokenAmount: "14",
          },
          {
            index: 1,
            address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
            value: "0.00014195",
            scriptPubKey: {
              asm: "OP_DUP OP_HASH160 84640233fd04f52017846ed7e9491dfea788b629 OP_EQUALVERIFY OP_CHECKSIG",
              hex: "76a91484640233fd04f52017846ed7e9491dfea788b62988ac",
              type: "pubkeyhash",
            },
          },
        ],
      },
    ],
  },
  getTransactionsByTransactionIds: [
    {
      id: "01f8255cad4f0060170f5cca22a5e0ca99fa62b3d26b89a34ac3100d876d14a4",
      index: 0,
      hash: "01f8255cad4f0060170f5cca22a5e0ca99fa62b3d26b89a34ac3100d876d14a4",
      version: 1,
      lockTime: 0,
      size: 134,
      vsize: 0,
      weight: 0,
      fee: "0",
      vinCount: 1,
      voutCount: 1,
      blockHeight: 20000,
      blockHash:
        "00000000770ebe897270ca5f6d539d8afb4ea4f4e757761a34ca82e17207d886",
      blockTimestamp: 1248291739,
      vin: [
        {
          index: 0,
          address: "coinbase",
          value: "0",
          coinbase: "04ffff001d016b",
          voutTransactionId: null,
          voutIndex: null,
          scriptSig: {
            asm: "",
            hex: "",
            type: "coinbase",
          },
          sequence: 4294967295,
          witness: [],
        },
      ],
      vout: [
        {
          index: 0,
          address: "qzh9ywn80fuysj3qeymq770knzgdapdxmu0lhttcxx",
          value: "50",
          scriptPubKey: {
            asm: "04370295d27dc032142af46515c4251ac7053f947546ada27b530bb11ffc65ea9b81be8758d6218d24448d2f9293620e43cf6e8220da09819d52f85474bc29238a OP_CHECKSIG",
            hex: "4104370295d27dc032142af46515c4251ac7053f947546ada27b530bb11ffc65ea9b81be8758d6218d24448d2f9293620e43cf6e8220da09819d52f85474bc29238aac",
            type: "pubkey",
          },
        },
      ],
    },
    {
      id: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
      index: 1,
      hash: "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
      version: 2,
      lockTime: 0,
      size: 2228,
      vsize: 0,
      weight: 0,
      fee: "0.00002229",
      vinCount: 15,
      voutCount: 2,
      blockHeight: 926553,
      blockHash:
        "00000000000000000118ec71334b69d8f3a4820a3a8cf0ad90bbcc3834a7ccc5",
      blockTimestamp: 1764048476,
      vin: [
        {
          index: 0,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "f84d36424653f169ba9ae9dd8e131607e322df37156f01f81d0efa4223db7b50",
          voutIndex: 3,
          scriptSig: {
            asm: "8e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe902501710[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "418e66703b20e8838a4679f17e7a2b8f2ab16510d5d39950657f6b92834f06b70d548bb4904074a4c80285ac2ae87722b5ccd5da42706cddba7e431fe90250171041210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 1,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "53078a21a63322b14a2353d53341ac56c1bea796ea9e8b79145ec40e73e6a77a",
          voutIndex: 3,
          scriptSig: {
            asm: "93f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e67[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "4193f8ae66a250c04d7de97b2b9e0e55215db69ffd29836345621d863d5902af348cb69cbf77992fa6e3eb470daf5a4a7a1f4cd9451ef91922ae614f4a17583e6741210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 2,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "668d54eaa7bc35ff116a26044bdcd30bcafe3307805a1b8ddc5d9e2d4617627f",
          voutIndex: 3,
          scriptSig: {
            asm: "97030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "4197030bd798208d59b0d3ce286018aeb4521040b535fa522520d9a9bce90c9fe340e135fbe8d749235246326c003b5781e7e70918cad44f9efb570213a6038f5b41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 3,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "07865ee692e76e222656560555026f6b42b4c96dfb7354d10a3d7614d739b61c",
          voutIndex: 3,
          scriptSig: {
            asm: "ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41ba3010b20659ecd0ea24dfcdde19ae59b06c5d71ced8e1109536df23912b8c03c95173d1b9544705811e8974a24416f21a2f54aa93c8a3f33df7c0488ec395af41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 4,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "fb78b2b225ebd3338e9180dfed3c46b78ce92f375cffcfdd268ca1696f4c5bcb",
          voutIndex: 3,
          scriptSig: {
            asm: "a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41a2e6f5864d3f913793e1353f1fdb9bd4060b0baebbacff626df68831b19e9e8a183bcea61cf7c823efdbe0dd13d0c7d2ef6929c303f6ce875d3ef7a397c6384c41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 5,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "cf450cea5e166630b8ab28754219bc1dcf79282cc43b8c2d79bb24e25c52cf6c",
          voutIndex: 3,
          scriptSig: {
            asm: "89ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "4189ed3f43a4a6f01ab87ad6704419984fc63a9dd0f864286b64782c749eab7255c88287a0699f57555c97ee8e2ab8bc8f40561e275936c62003f917e3a0b029bd41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 6,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "34857ac488965cff8cd5969e2924dce2fe6c02049bb49d0caf7c3202b5483481",
          voutIndex: 3,
          scriptSig: {
            asm: "f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41f0e2d0f5703e16c6444092335c05bf8b1ca862fe914bf3378d1f6043c965b71e30d7f2d3e650313e60d5afaf13645216c82f2f8711865242c660412fb2bd702f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 7,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "518476e8c694419e9c6ff9cc1d8d0670f9509042ae32d81c638c29ea50802ab1",
          voutIndex: 3,
          scriptSig: {
            asm: "c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41c4550da938bc628b05a93bf02aacd828f361440befc0d367b190f4e26b2237e7db5fafec9719a43cc3c751818c73e7a522f232ca1459febbb047270fd125c20f41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 8,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "1089fb4745e829521fa14381ab1bad4ae2342dd296109aad17312fc79199ece3",
          voutIndex: 3,
          scriptSig: {
            asm: "8d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "418d5806a285c78202b3c9d4538d95b8b409e82e9bd13ce5ed56bde83306a73498b13aaaf2e5d83d65596371720e0db159dc83ccaa36c547bc85d4c045fb5a7faf41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 9,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "ade18df170ad0dabdf4e4483cbafa352c7041a838d75a9d708bcc0211e11f858",
          voutIndex: 3,
          scriptSig: {
            asm: "181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41181e0d17235f719ccab0eecf1c6269d1abc8b2e659b25e41b962e5d01b70444fa1d48cdc4057af944e390ecd41f3fff0da0756bf3fa228837a0d73e13d721edb41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 10,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "42692ccea87e46fe664377ab30e9ec2f237b340a51ee90d61b4a9b5a2b00de11",
          voutIndex: 3,
          scriptSig: {
            asm: "fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41fe00ab7892dbd878fe89f1e3609738792f7140da3240141bc521d0bfae941062dc38e26b04fdc11d94ad91d5cb9c84542355c6d747ffb5d38a21731e4f83990a41210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 11,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "bf1e3cf7e1cdae4edfa693f2d9623125115438da1cb4cbe67390c90cfee41f7b",
          voutIndex: 3,
          scriptSig: {
            asm: "367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a6133[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41367d2e9fdf46053ff0f083d4f078e13add50f934dffd060213586bae2057518ff9f7694ec1a5cb8779635ec62cca996496e40bf5959ad5f6f1e3e009380a613341210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 12,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "f303155501ecbb8fca58d74fa1a2544abbd8f2619cead73cf6896f7fd0ef828a",
          voutIndex: 3,
          scriptSig: {
            asm: "ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e86[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41ddbd9c38d6275d7b9bf0142e376813262be8c8caf5f1e2597d6a342cb12542e151f0211c518ff37bf301e1075e7bef6fddb10019eed1e94f0e2c2614eca99e8641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 13,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.000008",
          coinbase: null,
          voutTransactionId:
            "f5f73a668f0dfa79c62bbb589c020b36cf47e5c51c56467283b5fad27fee1673",
          voutIndex: 3,
          scriptSig: {
            asm: "faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb6[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41faf6026e9bcc3d1602e924b1b936f491f0fb04875b41702e8dbfc07f41729c13bbc9deaa91b99457524f21cb0e9f733f2f05b3be48b029f43318ad7c536a1cb641210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "1",
        },
        {
          index: 14,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.00006224",
          coinbase: null,
          voutTransactionId:
            "f552736a37f1548be27d79c1414d5d00ab4dc9745f150c05bb9a743884818614",
          voutIndex: 2,
          scriptSig: {
            asm: "cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb19[ALL|FORKID] 0364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            hex: "41cffa8bc23831808cbd8fcea6c367dd58c041640a52e26e39fb0d607f65f61b98b9eb1c41b3f122021234c7001f0d9bb81499f8fb2874dc8e520dad88d5f1fb1941210364d9fe9d409e4532bacb6a9aafd83a581a61f7c7ef1950adfd915dfc4b938bae",
            type: "pubkeyhash",
          },
          sequence: 0,
          witness: [],
        },
      ],
      vout: [
        {
          index: 0,
          address: "qre48n77qyyclplgkfagstkpya68q9rg6uxg5njc4p",
          value: "0.00001",
          scriptPubKey: {
            asm: "OP_DUP OP_HASH160 f353cfde01098f87e8b27a882ec12774701468d7 OP_EQUALVERIFY OP_CHECKSIG",
            hex: "76a914f353cfde01098f87e8b27a882ec12774701468d788ac",
            type: "pubkeyhash",
          },
          tokenCategory:
            "fc498597114f5b257b83ad66473b88a979602187c70eef49a08f306e3c659961",
          tokenAmount: "14",
        },
        {
          index: 1,
          address: "qzzxgq3nl5z02gqhs3hd062frhl20z9k9y2pfpp23m",
          value: "0.00014195",
          scriptPubKey: {
            asm: "OP_DUP OP_HASH160 84640233fd04f52017846ed7e9491dfea788b629 OP_EQUALVERIFY OP_CHECKSIG",
            hex: "76a91484640233fd04f52017846ed7e9491dfea788b62988ac",
            type: "pubkeyhash",
          },
        },
      ],
    },
  ],
};

export default Examples;
