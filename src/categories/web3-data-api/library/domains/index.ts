import * as Common from "./common.domains";
import * as Ethereum from "./ethereum.domains";
import * as Tron from "./tron.domains";
import * as Bitcoin from "./bitcoin.domains";
import * as XRPL from "./xrpl.domains";
import * as Aptos from "./aptos.domains";

const Domains = {
  ...Common,
  Ethereum,
  Tron,
  Bitcoin,
  XRPL,
  Aptos,
};

export default Domains;
