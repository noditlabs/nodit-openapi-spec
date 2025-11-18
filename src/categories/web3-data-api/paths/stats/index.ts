import { OpenAPIV3 } from "openapi-types";
import fs from "fs";
import { ApiSpec } from "../../../../types";
import { createPath } from "../../../../utils";
import { isEndpointSupported } from "../../../../constants";

function createPathsForchain(chain: string) {
  let paths: OpenAPIV3.PathsObject = {};
  const tagPage = __dirname.split("/").pop(); // get tag page title from directory name
  if (!tagPage) return;

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.ts") return; // 현재 파일은 무시

    const apiSpec: ApiSpec = require(`./${file}`).default;

    if (!apiSpec?.isPublic) return; // isPublic false인 경우, 해당 API를 문서에 노출하지 않음
    if (chain !== "web3" && !isEndpointSupported(chain, apiSpec.endpoint))
      return; // 해당 프로토h콜에서 지원하지 않는 endpoint는 문서에 노출하지 않음

    const newPath = createPath({ chain, tagPage, apiSpec });

    paths = {
      ...paths,
      ...newPath,
    };
  });

  return paths;
}

export default createPathsForchain;
