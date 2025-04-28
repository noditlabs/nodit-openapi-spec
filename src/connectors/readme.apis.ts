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

const baseUrl = "https://dash.readme.com/api/v1";
const readmeApiKey = process.env.README_API_KEY;

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
      const response = await axios.request({
        baseURL: baseUrl,
        url: "/api-specification",
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
        },
        params: {
          page,
          perPage,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting metadata:", error.message);
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
    formData.append("spec", fileData, {});

    try {
      const response: AxiosResponse<ReadmeApiSpecResponse> =
        await axios.request({
          baseURL: baseUrl,
          url: "/api-specification",
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: readmeApiKey,
            "content-type": "multipart/form-data",
            "x-readme-version": `${version}`,
          },
          data: formData,
        });
      return response.data;
    } catch (error: any) {
      console.error("Error uploading specification:", error.message);
      return null;
    }
  }

  // Update API Spec(https://docs.readme.com/main/reference/updateapispecification)
  static async updateSpecification({
    filePath,
    id,
  }: {
    filePath: string;
    id: string;
  }): Promise<ReadmeApiSpecResponse | null> {
    const formData = new FormData();
    const fileData = fs.createReadStream(filePath);
    formData.append("spec", fileData);

    try {
      const response: AxiosResponse<ReadmeApiSpecResponse> =
        await axios.request({
          baseURL: baseUrl,
          url: `/api-specification/${id}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: readmeApiKey,
            "content-type": "multipart/form-data",
          },
          data: formData,
        });
      return response.data;
    } catch (error: any) {
      console.error("Error updating specification:", error.message);
      return null;
    }
  }

  // Delete API specification(https://docs.readme.com/main/reference/deleteapispecification)
  static async deleteApiSpec({ id }: { id: string }) {
    try {
      await axios.request({
        baseURL: baseUrl,
        url: `/api-specification/${id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: readmeApiKey,
        },
      });
      console.log(`Deleted API Specification: ${id}`);
      return true;
    } catch (error: any) {
      console.error("Error deleting API specification:", error.message);
      return false;
    }
  }

  // Validate API Spec(https://docs.readme.com/main/reference/validateapispecification)
  static async validateSpecification({
    filePath,
  }: {
    filePath: string;
  }): Promise<any> {
    const formData = new FormData();
    const fileData = fs.createReadStream(filePath);
    formData.append("spec", fileData, {});

    try {
      const response = await axios.request({
        baseURL: baseUrl,
        url: "/api-validation",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "content-type": "multipart/form-data",
        },
        data: formData,
      });
      return response.data;
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
      const response: AxiosResponse<Category[]> = await axios.request({
        baseURL: baseUrl,
        url: `/categories`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
        },
        params: { page, perPage },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting all categories:", error.message);
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
      const response: AxiosResponse<Category> = await axios.request({
        baseURL: baseUrl,
        url: `/categories/${slug}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
        },
      });
      return response.data;
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
      await axios.request({
        baseURL: baseUrl,
        url: `/categories/${slug}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
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
      const response: AxiosResponse<DocInfo[]> = await axios.request({
        baseURL: baseUrl,
        url: `/categories/${slug}/docs`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        `The docs for category ${slug} does not exist.`,
        error.message,
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
      const response: AxiosResponse<Category> = await axios.request({
        baseURL: baseUrl,
        url: `/categories/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "content-type": "application/json",
          "x-readme-version": `${version}`,
        },
        data: {
          title,
          type,
        },
      });
      return response.data;
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
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/docs`,
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: readmeApiKey,
            "x-readme-version": `${version}`,
          },
          data: options,
        });
      return response.data;
    } catch (error: any) {
      console.error(`Error creating doc ${options.title}:`, error.message);
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
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/docs/${slug}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: readmeApiKey,
            "x-readme-version": `${version}`,
          },
        });
      return response.data;
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
      const response: AxiosResponse<ReadmeDocResponse.RootObject> =
        await axios.request({
          baseURL: baseUrl,
          url: `/docs/${slug}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: readmeApiKey,
            "x-readme-version": `${version}`,
          },
          data: options,
        });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating doc ${slug}:`, error.message);
      return null;
    }
  }

  // delete doc (https://docs.readme.com/main/reference/deletedoc)
  static async deleteDoc({ slug, version }: { slug: string; version: string }) {
    try {
      await axios.request({
        baseURL: baseUrl,
        url: `/docs/${slug}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
          "x-readme-version": `${version}`,
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
        url: `/versions`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: readmeApiKey,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting all versions:", error.message);
      return [];
    }
  }
}
