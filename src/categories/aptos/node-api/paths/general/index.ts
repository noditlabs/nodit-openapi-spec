import { OpenAPIV3 } from "openapi-types";
import getLedgerInfo from "./getLedgerInfo";

const paths: OpenAPIV3.PathsObject = {
	["/"]: getLedgerInfo,
};

export default paths;
