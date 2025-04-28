import { OpenAPIV3 } from "openapi-types";
import getEventsByCreationNumber from "./getEventsByCreationNumber";
import getEventsByEventHandle from "./getEventsByEventHandle";

const url = `/accounts`;

const paths: OpenAPIV3.PathsObject = {
	[`${url}/{address}/events/{creation_number}`]: getEventsByCreationNumber,
	[`${url}/{address}/events/{event_handle}/{field_name}`]: getEventsByEventHandle,
};

export default paths;
