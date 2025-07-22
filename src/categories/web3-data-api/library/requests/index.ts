import * as Common from "./common.requests";
import * as Ethereum from "./ethereum.requests";
import * as Bitcoin from "./bitcoin.requests";
import * as Kaia from "./kaia.requests";
import * as Tron from "./tron.requests";
import * as XRPL from "./xrpl.requests";
import * as Aptos from "./aptos.requests";

const requests = {
  ...Common,
  Ethereum,
  Bitcoin,
  Kaia,
  Tron,
  XRPL,
  Aptos,
};

export default requests;
