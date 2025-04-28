import { OpenAPIV3 } from "openapi-types";
import getBlocksByHeight from "./getBlocksByHeight";
import getBlocksByVersion from "./getBlocksByVersion";

const url = `/blocks`;

const paths: OpenAPIV3.PathsObject = {
	[`${url}/by_height/{block_height}`]: getBlocksByHeight,
	[`${url}/by_version/{version}`]: getBlocksByVersion,
};

export default paths;
