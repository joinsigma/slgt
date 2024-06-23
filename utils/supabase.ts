import type { CreateProjectPayload } from "../interfaces/supabase.js";
import type {
  CreateProjectResponseData,
  GetOrganizationsResponseData,
} from "supabase-management-js";
import { SupabaseManagementAPI, isSupabaseError } from "supabase-management-js";
/* 
CREATE PROJECT SCHEMA
{
  "schema": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Id of your project"
      },
      "organization_id": {
        "type": "string",
        "description": "Slug of your organization"
      },
      "name": {
        "type": "string",
        "description": "Name of your project"
      },
      "region": {
        "type": "string",
        "description": "Region of your project",
        "example": "us-east-1"
      },
      "created_at": {
        "type": "string",
        "description": "Creation timestamp",
        "example": "2023-03-29T16:32:59Z"
      },
      "database": {
        "type": "object",
        "properties": {
          "host": {
            "type": "string",
            "description": "Database host"
          },
          "version": {
            "type": "string",
            "description": "Database version"
          }
        },
        "required": [
          "host",
          "version"
        ]
      }
    },
    "required": [
      "id",
      "organization_id",
      "name",
      "region",
      "created_at"
    ]
  }
}
*/
export const createProject = async (
  payload: CreateProjectPayload,
  token: string
): Promise<CreateProjectResponseData> => {
  try {
    const client = new SupabaseManagementAPI({
      accessToken: token,
    });

    const project = await client.createProject({
      name: payload.name,
      organization_id: payload.organization_id,
      region: payload.region as any,
      db_pass: payload.db_pass,
      plan: "free",
    });

    return project;
  } catch (error) {
    if (isSupabaseError(error)) {
      console.log(
        `Supabase Error:  ${error.message}, response status: ${error.response.status}`
      );
      process.exit(1);
    }
  }
};

export const listOrganizations = async (
  token: string
): Promise<GetOrganizationsResponseData> => {
  try {
    const client = new SupabaseManagementAPI({
      accessToken: token,
    });

    const organizations = await client.getOrganizations();
    return organizations;
  } catch (error) {
    if (isSupabaseError(error)) {
      console.log(
        `Supabase Error:  ${error.message}, response status: ${error.response.status}`
      );
      process.exit(1);
    }
  }
};

export const checkServiceHealth = async (
  project_id: string,
  token: string
): Promise<boolean> => {
  try {
    const client = new SupabaseManagementAPI({
      accessToken: token,
    });

    const response = await client.checkServiceHealth(project_id, {
      services: ["db"],
    });

    const { healthy } = response?.[0];

    return healthy;
  } catch (error) {
    if (isSupabaseError(error)) {
      console.log(
        `Supabase Error:  ${error.message}, response status: ${error.response.status}`
      );
      process.exit(1);
    }
  }
};

export const getProjectAnonKey = async (
  project_id: string,
  token: string
): Promise<string> => {
  try {
    const client = new SupabaseManagementAPI({
      accessToken: token,
    });

    const keys = await client.getProjectApiKeys(project_id);
    const anonKey = keys.find((key) => key.name === "anon");
    return anonKey.api_key;
  } catch (error) {
    if (isSupabaseError(error)) {
      console.log(
        `Supabase Error:  ${error.message}, response status: ${error.response.status}`
      );
      process.exit(1);
    }
  }
};
