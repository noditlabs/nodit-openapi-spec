import { OpenAPIV3 } from "openapi-types";

declare interface ApiDefinition {
  title: string;
  id: string;
}

declare interface ApiInfo extends ApiDefinition {
  oasDocs: OpenAPIV3.Document;
}

declare interface ApiSpec {
  summary: string;
  endpoint: string;
  isPublic?: boolean;
  info: (protocol?: string) => OpenAPIV3.PathItemObject;
}

declare interface OasParams {
  version: string;
  protocol: string;
}

declare interface EvmDocsInfo {
  id: string | null;
  title: string;
  version: string;
  filePath?: string;
}

// Readme
declare interface CodeSample {
  language: string;
  code: string;
  name?: string;
  install?: string;
  corresponding?: string;
}

declare interface XReadmeObject {
  "explorer-enabled"?: boolean;
  "proxy-enabled"?: boolean;
  "samples-languages"?: string[];
  "code-samples"?: CodeSample[];
  "parameter-ordering"?: string[];
  headers?: { key: string; value: string }[];
}

declare interface XenumDescriptions {
  [key: string]: string;
}

declare namespace ReadmeExtension {
  interface securitySchemes extends OpenAPIV3.ApiKeySecurityScheme {
    "x-default": string;
  }
}

declare interface ReadmeDocOption {
  title?: string;
  type?: "basic" | "error" | "link";
  body?: string;
  category?: string;
  hidden?: boolean;
  order?: number;
  parentDoc?: string;
  error?: {
    code: string;
  };
  categorySlug?: string;
  parentDocSlug?: string;
  [other: string]: any;
}

declare namespace ReadmeDocResponse {
  interface Metadata {
    image: any[];
    title: string;
    description: string;
    keywords: string;
    robots: string;
  }

  interface Api {
    method: string;
    url: string;
    auth: string;
    params: any[];
    apiSetting: string;
  }

  interface Next {
    description: string;
    pages: any[];
  }

  interface Algolia {
    recordCount: number;
    publishPending: boolean;
    translationFailure: boolean;
    updatedAt: string;
  }

  interface RootObject {
    metadata: Metadata;
    api: Api;
    next: Next;
    algolia: Algolia;
    title: string;
    icon: string;
    updates: any[];
    type: string;
    slug: string;
    excerpt: string;
    body: string;
    order: number;
    isReference: boolean;
    deprecated: boolean;
    hidden: boolean;
    sync_unique: string;
    link_url: string;
    link_external: boolean;
    reusableContent: any[];
    previousSlug: string;
    slugUpdatedAt: string;
    revision: number;
    _id: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    lastUpdatedHash: string;
    __v: number;
    isApi: boolean;
    id: string;
  }
}

declare interface ReadmeVersionData {
  version: string;
  version_clean: string;
  codename: string;
  is_stable: boolean;
  is_beta: boolean;
  is_hidden: boolean;
  is_deprecated: boolean;
  _id: string;
  createdAt: string;
  forked_from: string;
}

declare interface ReadmeConfig {
  version: string;
  apiDefinitions: ApiDefinition[];
}

declare interface ReadmeApiSpecResponse {
  _id: string;
  title: string;
}

declare interface ReadmeApiSpec {
  title: string;
  source: string;
  _id: string;
  version: string;
  lastSynced: string;
  type: string;
  id: string;
  category: {
    title: string;
    slug: string;
    order: number;
    _id: string;
    type: string;
    id: string;
  };
}

declare interface ForkedFrom {
  version: string;
  _id: string;
}

declare interface Category {
  title: string;
  slug: string;
  order: number;
  reference: boolean;
  _id: string;
  project: string;
  version: string;
  createdAt: string;
  __v: number;
  type: string;
  id: string;
  supportsMyRequests?: boolean;
  categoryType?: string;
}

declare interface Version {
  version: string;
  version_clean: string;
  codename: string;
  is_stable: boolean;
  is_beta: boolean;
  is_hidden: boolean;
  is_deprecated: boolean;
  categories: Category[];
  _id: string;
  project: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  forked_from: ForkedFrom;
}

declare interface Document {
  title: string;
  slug: string;
  order: number;
  reference: boolean;
  _id: string;
  project: string;
  version: Version;
  createdAt: string;
  __v: number;
  type: string;
  id: string;
}

declare interface DocInfo {
  _id: string;
  title: string;
  slug: string;
  order: number;
  hidden: boolean;
  children: DocInfo[];
}
