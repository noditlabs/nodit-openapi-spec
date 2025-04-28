import { OpenAPIV3 } from "openapi-types";
import getTableItem from "./getTableItem";
import getRawTableItem from "./getRawTableItem";

const url = `/tables`;

const paths: OpenAPIV3.PathsObject = {
  [`/${url}/{table_handle}/item`]: getTableItem,
  [`/${url}/{table_handle}/raw_item`]: getRawTableItem,
};

export default paths;
