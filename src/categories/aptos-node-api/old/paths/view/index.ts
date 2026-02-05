import { OpenAPIV3 } from "openapi-types";
import executeViewFunctionOfAModule from "./executeViewFunctionOfAModule";

const url = `/view`;

const paths: OpenAPIV3.PathsObject = {
  [`${url}`]: executeViewFunctionOfAModule,
};

export default paths;
