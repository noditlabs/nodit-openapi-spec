import { OpenAPIV3 } from "openapi-types";
import { ApiSpec } from "../types";

export function createPath({
  chain,
  tagPage,
  apiSpec,
}: {
  chain?: string;
  tagPage: string;
  apiSpec: ApiSpec;
}): OpenAPIV3.PathsObject {
  const path = {
    [`/{chain}/{network}/${tagPage}/${apiSpec.endpoint}`]: apiSpec.info(chain),
  };

  return path;
}
