import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import {
  Category,
  DocInfo,
  ReadmeApiSpec,
  ReadmeApiSpecResponse,
  ReadmeDocResponse,
  ReadmeDocOption,
  ReadmeVersionData,
} from "../types";
import FormData from "form-data";
import fs from "fs";
dotenv.config();

const baseUrl = "https://api.readme.com/v2";
const readmeApiKey = process.env.README_API_KEY;

// Helper function to normalize version for URL path
function getVersionPath(version: string): string {
  // "stable" or version number handling
  if (version === "main" || version === "stable") {
    return "stable";
  }
  // Remove 'v' prefix if present, but keep the version as-is (e.g., "0.2.21")
  const cleaned = version.replace(/^v/, "");
  // For v2 API, versions might need to be URL encoded or formatted differently
  // Try the version as-is first
  return cleaned;
}

export class ReadmeApi {
  /* API Specification */
  // Get metadata(https://docs.readme.com/main/reference/getapispecification)
  static async getMetadata({
    page = 1,
    perPage = 100,
    version,
  }: {
    page?: number;
    perPage?: number;
    version: string;
  }): Promise<ReadmeApiSpec[]> {
    try {
      const versionPath = getVersionPath(version);
      const response = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/apis`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
        params: {
          page,
          perPage,
        },
      });

      // Debug: log response structure
      if (process.env.DEBUG) {
        console.log(
          "API Response structure:",
          JSON.stringify(response.data, null, 2)
        );
      }

      // v2 API returns data wrapped in a data object or items array
      // Try different possible response structures
      const data = response.data as any;
      let specs: any[] = [];

      if (data?.data && Array.isArray(data.data)) {
        specs = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
        specs = data.items;
      } else if (Array.isArray(data)) {
        specs = data;
      }

      // Debug: log first spec structure (always log if specs found but titles are empty)
      if (specs.length > 0) {
        const firstSpec = specs[0];
        // If title is missing, log the structure to help debug
        if (!firstSpec.title && !firstSpec.name) {
          console.log(
            "First spec structure (no title found):",
            JSON.stringify(firstSpec, null, 2)
          );
        }
      }

      // v2 API uses different structure:
      // - filename instead of title (e.g., "web3-data-api.json")
      // - uri instead of _id (e.g., "/branches/0.2.21/apis/web3-data-api.json")
      // - No direct _id or id field
      return specs.map((spec: any) => {
        // Extract title from filename (remove .json extension)
        const filename = spec.filename || "";
        const title = filename.replace(/\.(json|yaml|yml)$/i, "");

        // Extract ID from URI (last part - keep extension for v2 API)
        const uri = spec.uri || "";
        const uriFilename = uri.split("/").pop() || "";

        // For v2 API, we need to store the full filename with extension for updates
        // But also keep the base name for matching
        const baseId = uriFilename.replace(/\.(json|yaml|yml)$/i, "");
        const fullFilename = filename || uriFilename;

        // Use legacy_id if available, otherwise use full filename
        const id = spec.legacy_id || fullFilename;

        return {
          title: spec.title || title || "",
          source:
            typeof spec.source === "string"
              ? spec.source
              : spec.source?.current || "",
          // Store full filename for v2 API updates
          _id: spec._id || spec.legacy_id || fullFilename || baseId || "",
          version: spec.version || "",
          lastSynced:
            spec.lastSynced || spec.last_synced || spec.updated_at || "",
          type: spec.type || "",
          id: id || baseId || "",
          category: spec.category || {},
          // Store original filename for reference
          filename: fullFilename,
        };
      });
    } catch (error: any) {
      console.error("Error getting metadata:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return [];
    }
  }

  // Upload API Spec(https://docs.readme.com/main/reference/uploadapispecification)
  static async uploadSpecification({
    filePath,
    version,
  }: {
    filePath: string;
    version: string;
  }): Promise<ReadmeApiSpecResponse | null> {
    const formData = new FormData();
    const fileData = fs.createReadStream(filePath);
    // v2 API uses "schema" field instead of "spec"
    formData.append("schema", fileData, {});

    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<any> = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/apis`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
          ...formData.getHeaders(), // Let FormData set the content-type with boundary
        },
        data: formData,
      });

      // Debug: log response structure
      if (process.env.DEBUG) {
        console.log(
          "Upload API Response structure:",
          JSON.stringify(response.data, null, 2)
        );
      }

      // v2 API returns data wrapped in a data object
      const data = (response.data as any)?.data || response.data;

      // v2 API response structure: filename, uri, legacy_id, etc.
      // Extract ID from various possible fields
      const result: any = {
        _id:
          data?._id ||
          data?.legacy_id ||
          data?.filename ||
          data?.uri?.split("/").pop() ||
          "",
        title:
          data?.title ||
          data?.filename?.replace(/\.(json|yaml|yml)$/i, "") ||
          "",
        filename: data?.filename || "",
        uri: data?.uri || "",
      };

      return result;
    } catch (error: any) {
      console.error("Error uploading specification:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return null;
    }
  }

  // Update API Spec(https://docs.readme.com/main/reference/updateapispecification)
  static async updateSpecification({
    filePath,
    id,
    version,
  }: {
    filePath: string;
    id: string;
    version?: string;
  }): Promise<ReadmeApiSpecResponse | null> {
    try {
      // For update, we need version to construct the URL
      // v2 API uses filename with extension in the URL
      const versionPath = version ? getVersionPath(version) : "stable";

      // Ensure ID has extension for v2 API
      // v2 API requires the full filename with extension in the URL
      let apiId = id;
      if (!apiId.includes(".")) {
        apiId = `${apiId}.json`;
      }

      // Always log for debugging
      console.log(`Updating API spec: /branches/${versionPath}/apis/${apiId}`);
      console.log(`ID received: "${id}", API ID used: "${apiId}"`);

      const formData = new FormData();
      const fileData = fs.createReadStream(filePath);

      // v2 API uses "schema" field instead of "spec"
      // Use the apiId (with extension) as the filename
      formData.append("schema", fileData, {
        filename: apiId,
      });

      const response: AxiosResponse<any> = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/apis/${apiId}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
          ...formData.getHeaders(), // Let FormData set the content-type with boundary
        },
        data: formData,
      });

      // v2 API returns data wrapped in a data object, and may not include _id
      const data = (response.data as any)?.data || response.data;
      // v2 API response may have filename, uri, legacy_id instead of _id
      const result: ReadmeApiSpecResponse = {
        _id:
          data?._id ||
          data?.legacy_id ||
          data?.filename ||
          data?.uri?.split("/").pop() ||
          apiId,
        title:
          data?.title ||
          data?.filename?.replace(/\.(json|yaml|yml)$/i, "") ||
          apiId.replace(/\.(json|yaml|yml)$/i, ""),
      };
      return result;
    } catch (error: any) {
      console.error("Error updating specification:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Request URL:", error.config?.url);
        console.error("Request method:", error.config?.method);
      }
      return null;
    }
  }

  // Delete API specification(https://docs.readme.com/main/reference/deleteapispecification)
  static async deleteApiSpec({
    id,
    version,
  }: {
    id: string;
    version?: string;
  }) {
    try {
      const versionPath = version ? getVersionPath(version) : "stable";
      const url = `/branches/${versionPath}/apis/${id}`;
      await axios.request({
        baseURL: baseUrl,
        url,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      console.log(`  ✅ Deleted: ${id}`);
      return true;
    } catch (error: any) {
      console.error(`  ❌ Failed to delete ${id}:`, error.message);
      if (error.response) {
        console.error(`     Status: ${error.response.status}`);
        if (error.response.status === 500) {
          console.error(
            `     This might be a ReadMe API issue or the spec is in use`
          );
        }
      }
      return false;
    }
  }

  // Validate API Spec(https://docs.readme.com/main/reference/validateapispecification)
  static async validateSpecification({
    filePath,
    version,
  }: {
    filePath: string;
    version?: string;
  }): Promise<any> {
    const formData = new FormData();
    const fileData = fs.createReadStream(filePath);
    formData.append("spec", fileData, {});

    try {
      const versionPath = version ? getVersionPath(version) : "stable";
      const response = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/apis/validate`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
          "content-type": "multipart/form-data",
        },
        data: formData,
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error("Error validating specification:", error.message);
      return null;
    }
  }

  /* Category */
  // get all category (https://docs.readme.com/main/reference/getcategories)
  static async getAllCategory({
    version,
    page = 1,
    perPage = 100,
  }: {
    page?: number;
    perPage?: number;
    version: string;
  }): Promise<Category[]> {
    try {
      const versionPath = getVersionPath(version);
      const url = `/branches/${versionPath}/categories`;
      if (process.env.DEBUG) {
        console.log(`[DEBUG] Fetching categories from: ${baseUrl}${url}`);
      }
      const response: AxiosResponse<Category[]> = await axios.request({
        baseURL: baseUrl,
        url,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
        params: { page, perPage },
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data || [];
    } catch (error: any) {
      console.error("Error getting all categories:", error.message);
      if (error.response) {
        console.error(`  Status: ${error.response.status}`);
        console.error(`  URL: ${error.config?.baseURL}${error.config?.url}`);
      }
      return [];
    }
  }

  // get category (https://docs.readme.com/main/reference/getcategory)
  static async getCategory({
    slug,
    version,
  }: {
    slug: string;
    version: string;
  }): Promise<Category | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<Category> = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/categories/${slug}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`The category ${slug} does not exist.`, error.message);
      return null;
    }
  }

  // delete category (https://docs.readme.com/main/reference/deletecategory)
  static async deleteCategory({
    slug,
    version,
  }: {
    slug: string;
    version: string;
  }) {
    try {
      const versionPath = getVersionPath(version);
      await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/categories/${slug}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      console.log(`Deleted Category: ${slug}`);
      return true;
    } catch (error: any) {
      console.error(`Error deleting category ${slug}:`, error.message);
      return false;
    }
  }

  // get docs for category (https://docs.readme.com/main/reference/getcategorydocs)
  static async getDocsForCategory({
    slug,
    version,
  }: {
    slug: string;
    version: string;
  }): Promise<DocInfo[]> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<DocInfo[]> = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/categories/${slug}/docs`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data || [];
    } catch (error: any) {
      console.error(
        `The docs for category ${slug} does not exist.`,
        error.message
      );
      return [];
    }
  }

  // create category (https://docs.readme.com/main/reference/createcategory)
  static async createCategory({
    title,
    type = "reference",
    version,
  }: {
    title: string;
    type: "guid" | "reference";
    version: string;
  }): Promise<Category | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<Category> = await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/categories`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
          "content-type": "application/json",
        },
        data: {
          title,
          type,
        },
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`Error creating category ${title}:`, error.message);
      return null;
    }
  }

  /* Doc API */
  // create doc (https://docs.readme.com/main/reference/createdoc)
  static async createDoc({
    version,
    options,
  }: {
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/docs`,
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
          },
          data: options,
        });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`Error creating doc ${options.title}:`, error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Request URL:", error.config?.url);
      }
      return null;
    }
  }

  /* Reference API (Readme Refactored only) */
  // create guide page (https://docs.readme.com/main/reference/createguide) - fallback when reference fails
  static async createGuide({
    version,
    options,
  }: {
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const data: any = { ...options };
      if (data.category && typeof data.category === "object") {
        if ("slug" in data.category) {
          data.category = {
            uri: `https://api.readme.com/v2/branches/${versionPath}/categories/${data.category.slug}`,
          };
        }
      }
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/guides`,
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
            "Content-Type": "application/json",
          },
          data,
        });
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`Error creating guide ${options.title}:`, error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return null;
    }
  }

  // update guide page
  static async updateGuide({
    slug,
    version,
    options,
  }: {
    slug: string;
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/guides/${slug}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
            "Content-Type": "application/json",
          },
          data: options,
        });
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`Error updating guide ${slug}:`, error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return null;
    }
  }

  // create reference page (https://docs.readme.com/main/reference/createreference)
  static async createReference({
    version,
    options,
  }: {
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const data: any = { ...options };
      if (data.category && typeof data.category === "object") {
        if ("slug" in data.category) {
          data.category = {
            uri: `https://api.readme.com/v2/branches/${versionPath}/categories/${data.category.slug}`,
          };
        }
      }
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/reference`,
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
            "Content-Type": "application/json",
          },
          data,
        });
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(
        `Error creating reference ${options.title}:`,
        error.message
      );
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Request URL:", error.config?.url);
      }
      return null;
    }
  }

  // update reference page (https://docs.readme.com/main/reference/updatereference)
  static async updateReference({
    slug,
    version,
    options,
  }: {
    slug: string;
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const data: any = { ...options };
      // Convert category slug to URI format if needed
      if (data.category && typeof data.category === "object") {
        if ("slug" in data.category) {
          data.category = {
            uri: `https://api.readme.com/v2/branches/${versionPath}/categories/${data.category.slug}`,
          };
        }
      }
      // Debug: log request data
      console.log(`   [DEBUG] Request data:`, JSON.stringify(data, null, 2));

      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/reference/${slug}`,
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
            "Content-Type": "application/json",
          },
          data: data,
        });

      // Debug: log full response data to see available fields
      const result = (response.data as any)?.data || response.data;
      console.log(`   [DEBUG] Response status:`, response.status);
      console.log(`   [DEBUG] Full response keys:`, Object.keys(result));
      console.log(`   [DEBUG] Full response:`, JSON.stringify(result, null, 2));

      return result;
    } catch (error: any) {
      console.error(`Error updating reference ${slug}:`, error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return null;
    }
  }

  // get doc (https://docs.readme.com/main/reference/getdoc)
  static async getDoc({
    slug,
    version,
  }: {
    slug: string;
    version: string;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/docs/${slug}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
          },
        });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`The doc ${slug} does not exist.`, error.message);
      return null;
    }
  }

  // update doc (https://docs.readme.com/main/reference/updatedoc)
  static async updateDoc({
    slug,
    version,
    options,
  }: {
    slug: string;
    version: string;
    options: ReadmeDocOption;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/docs/${slug}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
          },
          data: options,
        });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`Error updating doc ${slug}:`, error.message);
      return null;
    }
  }

  // get reference (API spec generated doc)
  static async getReference({
    slug,
    version,
  }: {
    slug: string;
    version: string;
  }): Promise<ReadmeDocResponse.RootObject | null> {
    try {
      const versionPath = getVersionPath(version);
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/branches/${versionPath}/reference/${slug}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${readmeApiKey}`,
          },
        });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data;
    } catch (error: any) {
      console.error(`The reference ${slug} does not exist.`, error.message);
      return null;
    }
  }

  // delete doc (https://docs.readme.com/main/reference/deletedoc)
  static async deleteDoc({ slug, version }: { slug: string; version: string }) {
    try {
      const versionPath = getVersionPath(version);
      await axios.request({
        baseURL: baseUrl,
        url: `/branches/${versionPath}/docs/${slug}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      console.log(`Deleted Doc: ${slug}`);
    } catch (error: any) {
      console.error(`Error deleting doc ${slug}:`, error.message);
    }
  }

  /* Version */
  // get all versions (https://docs.readme.com/main/reference/getversions)
  static async getAllVersions(): Promise<ReadmeVersionData[]> {
    try {
      const response: AxiosResponse<ReadmeVersionData[]> = await axios.request({
        baseURL: baseUrl,
        url: `/branches`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${readmeApiKey}`,
        },
      });
      // v2 API returns data wrapped in a data object
      return (response.data as any)?.data || response.data || [];
    } catch (error: any) {
      console.error("Error getting all versions:", error.message);
      return [];
    }
  }
}
