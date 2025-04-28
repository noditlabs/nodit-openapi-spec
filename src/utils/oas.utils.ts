import { OpenAPIV3 } from "openapi-types";
import { ApiSpec } from "../types";

export function createPath({
  protocol,
  tagPage,
  apiSpec,
}: {
  protocol?: string;
  tagPage: string;
  apiSpec: ApiSpec;
}): OpenAPIV3.PathsObject {
  const path = {
    [`/{protocol}/{network}/${tagPage}/${apiSpec.endpoint}`]:
      apiSpec.info(protocol),
  };

  return path;
}
