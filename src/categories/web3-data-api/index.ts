import { OpenAPIV3 } from "openapi-types";
import nftPaths from "./paths/nft";
import nativeTokenPaths from "./paths/native";
import tokenPaths from "./paths/token";
import blockchainPaths from "./paths/blockchain";
import statsPaths from "./paths/stats";
import ensPaths from "./paths/ens";
import assetPaths from "./paths/asset";
import { API_KEY, BASE_URL } from "../../constants";
import { OasParams, ReadmeExtension } from "../../types";

const apiTitle = "Web3 Data API";

function oasDocs({ version, chain = "web3" }: OasParams): OpenAPIV3.Document {
  return {
    openapi: "3.1.0",
    info: {
      title: chain === "web3" ? apiTitle : chain,
      version,
    },
    servers: [
      {
        url: BASE_URL.WEB3_DATA_API,
      },
    ],
    components: {
      securitySchemes: {
        api_key: {
          type: "apiKey",
          name: "X-API-KEY",
          in: "header",
          "x-default": API_KEY.NODIT_DOCS_DEMO,
          description:
            "The default value, `nodit-demo`, is only for use in the developer documentation. For real applications or services, use the API key obtained from the Nodit console.",
        } as ReadmeExtension.securitySchemes,
      },
    },
    paths: {
      ...nftPaths(chain),
      ...tokenPaths(chain),
      ...nativeTokenPaths(chain),
      ...blockchainPaths(chain),
      ...ensPaths(chain),
      ...statsPaths(chain),
      ...assetPaths(chain),
    },
  };
}

export default oasDocs;
