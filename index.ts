// Libs
import { execa } from "execa";
import prompts from "prompts";
import axios from "axios";
import fs from "fs";

// Interfaces
import type { Variables } from "./interfaces/variables.js";
import type { Params } from "./interfaces/params.js";

// Utils
import {
  checkServiceHealth,
  createProject,
  getProjectAnonKey,
  listOrganizations,
} from "./utils/supabase.js";
import generateUUID from "./utils/uuid.js";

// Constants
const ROOT_DIR = process.cwd();

const VARIABLES: Variables = {
  __SUPABASE_PROJECT_NAME__: "",
  __SUPABASE_PROJECT_ID__: "",
  __SUPABASE_ANON_KEY__: "",
  __HASURA_GRAPHQL_ENDPOINT__: "",
  __HASURA_GRAPHQL_ADMIN_SECRET__: "",
  __HASURA_GRAPHQL_DATABASE_URL__: "",
  __ENCRYPTION_KEY__: "",
  __GITHUB_USERNAME__: "",
};

const PARAMS: Params = {
  SUPABASE_MANAGEMENT_TOKEN: {
    key: "SUPABASE_MANAGEMENT_TOKEN",
    prompt:
      "Enter Supabase Management API token.\n\nWe never store this token. It's only used to create a new project. If you don't have one, please visit https://supabase.com/dashboard/account/tokens to create a new token.",
    required: true,
    type: "text",
    default: "",
    value: "",
  },
  SUPABASE_PROJECT_NAME: {
    key: "SUPABASE_PROJECT_NAME",
    prompt:
      "Enter the name of your Supabase project.\n\nPlease make sure the name is unique. If the name is already taken, the project creation will fail. The name should be alphanumeric and must not contain spaces.",
    required: true,
    type: "text",
    default: "",
    value: "",
  },
  SUPABASE_DATABASE_PASSWORD: {
    key: "SUPABASE_DATABASE_PASSWORD",
    prompt:
      "Enter the password for the default database user.\n\nThis password is used to connect to the database and should be long secure string. You can use: `openssl rand -base64 32` to generate one.",
    required: true,
    type: "text",
    default: "",
    value: "",
  },
  SUPABASE_REGION: {
    key: "SUPABASE_REGION",
    prompt:
      "Select the region for your Supabase project.\n\nPlease select the region closest to your users. If you are not sure, select the default region.",
    required: true,
    type: "select",
    choices: [
      { title: "us-east-1", value: "us-east-1" },
      { title: "us-west-1", value: "us-west-1" },
      { title: "us-west-2", value: "us-west-2" },
      { title: "ap-southeast-1 (default)", value: "ap-southeast-1" },
      { title: "ap-northeast-1", value: "ap-northeast-1" },
      { title: "ap-northeast-2", value: "ap-northeast-2" },
      { title: "ap-southeast-2", value: "ap-southeast-2" },
      { title: "eu-west-1", value: "eu-west-1" },
      { title: "eu-west-2", value: "eu-west-2" },
      { title: "eu-west-3", value: "eu-west-3" },
      { title: "eu-central-1", value: "eu-central-1" },
      { title: "ca-central-1", value: "ca-central-1" },
      { title: "ap-south-1", value: "ap-south-1" },
      { title: "sa-east-1", value: "sa-east-1" },
    ],
    default: "ap-southeast-1",
    value: "",
  },
  HASURA_GRAPHQL_ADMIN_SECRET: {
    key: "HASURA_GRAPHQL_ADMIN_SECRET",
    prompt:
      "Enter the admin secret for Hasura GraphQL Engine.\n\nThis secret is used to authenticate with Hasura GraphQL Engine. It should be a long secure string. You can use: `openssl rand -base64 32` to generate one.",
    required: true,
    type: "text",
    default: "",
    value: "",
  },
  GITHUB_USERNAME: {
    key: "GITHUB_USERNAME",
    prompt:
      "Enter your GitHub username.\n\nThis is used to create a new GitHub repository for the project.",
    required: true,
    type: "text",
    default: "",
    value: "",
  },
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyDependencies() {
  try {
    await execa("node", ["--version"], { shell: true });
    await execa("docker", ["--version"], { shell: true });
    await execa("docker compose version", { shell: true });
    await execa("gh", ["--version"], { shell: true });
  } catch (error) {
    console.error(
      "Please make sure you have the following dependencies installed:"
    );
    console.error("1. Node.js");
    console.error("2. Docker");
    console.error("3. Docker Compose");
    console.error("4. GitHub CLI");
    console.error("5. Linux or Mac machine (Windows users can use WSL)");
    process.exit(1);
  }
}

async function replaceVariables(projectID: string) {
  console.log("🚀 Replacing variables...");
  // Replace VARIABLES with values
  VARIABLES.__SUPABASE_PROJECT_NAME__ = PARAMS.SUPABASE_PROJECT_NAME.value;
  VARIABLES.__SUPABASE_PROJECT_ID__ = projectID;
  VARIABLES.__HASURA_GRAPHQL_ENDPOINT__ = `https://${PARAMS.SUPABASE_PROJECT_NAME.value}-hasura-krljeif4ga-as.a.run.app`;
  VARIABLES.__HASURA_GRAPHQL_ADMIN_SECRET__ =
    PARAMS.HASURA_GRAPHQL_ADMIN_SECRET.value;
  VARIABLES.__HASURA_GRAPHQL_DATABASE_URL__ = `postgres://postgres.${VARIABLES.__SUPABASE_PROJECT_ID__}:${PARAMS.SUPABASE_DATABASE_PASSWORD.value}@aws-0-${PARAMS.SUPABASE_REGION.value}.pooler.supabase.com:5432/postgres`;
  VARIABLES.__SUPABASE_ANON_KEY__ = await getProjectAnonKey(
    projectID,
    PARAMS.SUPABASE_MANAGEMENT_TOKEN.value
  );
  VARIABLES.__ENCRYPTION_KEY__ = generateUUID();
  VARIABLES.__GITHUB_USERNAME__ = PARAMS.GITHUB_USERNAME.value;
  console.log("🚀 Variables replaced.");
}

async function copyTemplatesAndReplaceVariables() {
  console.log("🚀 Cloning templates and replacing variables...");

  // Remove /generated directory if it already exists
  await execa("rm", ["-rf", "generated"], { shell: true });

  // Copy /templates directory to /generated
  await execa("cp", ["-r", "templates/", "generated"], { shell: true });

  // Change to /generated
  process.chdir("generated");

  // Replace variable in all files in /generated directory
  for (let [variable, value] of Object.entries(VARIABLES)) {
    value = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    // replace variable with value in path
    await execa(
      "find",
      [
        ".",
        "-type",
        "f",
        "-exec",
        "sed",
        "-i",
        `'s/${variable}/${value}/g'`,
        "{}",
        "\\;",
      ],
      {
        shell: true,
      }
    );
  }

  // Change back to root directory
  process.chdir(ROOT_DIR);

  console.log("🚀 Templates cloned and variables replaced.");
}

async function installDependencies(path: string) {
  console.log("🚀 Installing dependencies in " + path);

  // Install dependencies
  await execa("npm", ["install", "--prefix", path], {
    stdio: "inherit",
    shell: true,
  });

  console.log("🚀 Dependencies installed.");
}

async function startDockerContainer(path: string) {
  console.log("🚀 Starting Docker container in " + path);

  // Start docker container
  await execa(
    "docker",
    ["compose", "-f", path + "/docker-compose.yaml", "up", "--build", "-d"],
    {
      stdio: "inherit",
      shell: true,
    }
  );

  console.log("🚀 Docker container started.");
}

async function stopDockerContainer(path: string) {
  console.log("🚀 Stopping Docker container in " + path);

  // Stop and destroy docker container
  await execa(
    "docker",
    [
      "compose",
      "-f",
      path + "/docker-compose.yaml",
      "down",
      "--volumes",
      "--rmi",
      "all",
      "--remove-orphans",
    ],
    {
      stdio: "inherit",
      shell: true,
    }
  );

  console.log("🚀 Docker container stopped.");
}

async function initGit(path: string) {
  console.log("🚀 Initializing Git repository in " + path);

  process.chdir(path);

  await execa("git", ["init"], {
    stdio: "inherit",
    shell: true,
  });

  process.chdir(ROOT_DIR);

  console.log("🚀 Git repository initialized.");
}

async function gitCommit(
  path: string,
  filesToCommit: string[],
  message: string
) {
  console.log("🚀 Committing to Git repository...");

  process.chdir(path);

  await execa("git", ["add", ...filesToCommit], {
    stdio: "inherit",
    shell: true,
  });

  await execa("git", ["commit", "-m", message], {
    stdio: "inherit",
    shell: true,
  });

  await execa("git", ["branch", "-M", "main"], {
    stdio: "inherit",
    shell: true,
  });

  process.chdir(ROOT_DIR);

  console.log("🚀 Committed to Git repository.");
}

async function createRepoInGitHub(
  path: string,
  githubUsername: string,
  repoName: string
) {
  console.log("🚀 Creating GitHub repository...");

  process.chdir(path);

  // Create new GitHub repository using GitHub CLI
  await execa(
    "gh",
    [
      "repo",
      "create",
      githubUsername + "/" + repoName,
      "--source",
      ".",
      "--private",
    ],
    {
      stdio: "inherit",
    }
  );

  // Change back to root directory
  process.chdir(ROOT_DIR);

  console.log("🚀 GitHub repository created.");
}

async function pushToGitHub(path: string) {
  console.log("🚀 Pushing to GitHub repository...");

  process.chdir(path);

  await execa("git", ["push", "origin", "main"], {
    stdio: "inherit",
    shell: true,
  });

  // Change back to root directory
  process.chdir(ROOT_DIR);

  console.log("🚀 Pushed to GitHub repository.");
}

async function createSecretsInGitHubRepo(
  path: string,
  extraSecrets: { key: string; value: string }[] = []
) {
  // If user is part of joinsigma organization, add CI/CD secrets
  const { stdout } = await execa("gh", ["org", "list"], { shell: true });

  const shouldSetupCICD = stdout.match("joinsigma");

  if (shouldSetupCICD) {
    console.log(
      "🚀 You are part of the joinsigma organization. Adding CI/CD secrets to GitHub repository for " +
        path
    );
  } else {
    console.log(
      "🚀 You are NOT part of the joinsigma organization. Skipping CI/CD secrets..."
    );
  }

  if (shouldSetupCICD) {
    // Copy /secrets folder to generated directory
    await execa("cp", ["-r", "secrets/", path], { shell: true });
  }

  // Create a new file in generated directory with extra secrets
  let extraSecretsString = "";
  for (const secret of extraSecrets) {
    extraSecretsString += `${secret.key}=${secret.value}\n`;
  }

  fs.writeFileSync(`${path}/.env.extra`, extraSecretsString, "utf-8");

  process.chdir(path);

  // Set secrets
  await execa("gh", ["secret", "set", "-f", ".env.extra"], {
    stdio: "inherit",
    shell: true,
  });

  if (shouldSetupCICD) {
    await execa("gh", ["secret", "set", "-f", "secrets/.env.main"], {
      stdio: "inherit",
      shell: true,
    });

    await execa(
      "gh",
      ["secret", "set", "GCP_SA_KEY", "<", "secrets/GCP_SA_KEY.json"],
      {
        stdio: "inherit",
        shell: true,
      }
    );
  }

  // Change back to root directory
  process.chdir(ROOT_DIR);

  // Cleanup
  await execa("rm", ["-rf", `${path}/.env.extra`], { shell: true });
  await execa("rm", ["-rf", `${path}/secrets`], { shell: true });

  console.log("🚀 Secrets added to GitHub repository.");
}

async function main() {
  verifyDependencies();

  // Ask user to provide the required values
  for (const [key, value] of Object.entries(PARAMS)) {
    const response = await prompts({
      type: value.type,
      name: key,
      message: value.prompt,
      ...(value.type === "select" && { choices: value.choices }),
    });

    if (value.required && !response[key]) {
      console.error(`Please provide a ${key}`);
      process.exit(1);
    }

    PARAMS[key].value = response[key];

    if (!PARAMS[key].value) {
      PARAMS[key].value = value.default;
    }

    console.log("\n\n");
  }

  console.log("🚀 Getting organizations...");
  const organizations = await listOrganizations(
    PARAMS.SUPABASE_MANAGEMENT_TOKEN.value
  );

  // Pick the organization
  const organizationChoices = organizations.map((org) => ({
    title: org.name,
    value: org.id,
  }));

  const organizationResponse = await prompts({
    type: "select",
    name: "organization_id",
    message: "Pick an organization from Supabase",
    choices: organizationChoices,
  });

  const organizationID = organizationResponse.organization_id;

  // Create the project
  console.log("🚀 Creating project...");
  const project = await createProject(
    {
      name: PARAMS.SUPABASE_PROJECT_NAME.value,
      organization_id: organizationID,
      region: PARAMS.SUPABASE_REGION.value,
      db_pass: PARAMS.SUPABASE_DATABASE_PASSWORD.value,
    },
    PARAMS.SUPABASE_MANAGEMENT_TOKEN.value
  );

  if (!project.id) {
    console.error("Failed to create project");
    process.exit(1);
  }

  // Make sure the db service is healthy
  while (true) {
    console.log("🚀 Waiting for service to be healthy. Please be patient...");
    const healthy = await checkServiceHealth(
      project.id,
      PARAMS.SUPABASE_MANAGEMENT_TOKEN.value
    );

    if (healthy) {
      break;
    }

    await delay(1000);
  }

  console.log("🚀 Service is healthy");

  // Replace variables
  await replaceVariables(project.id);

  // Copy templates and replace variables
  await copyTemplatesAndReplaceVariables();

  // Install dependencies
  await installDependencies("generated/hasura");
  await installDependencies("generated/core");

  // Start docker containers
  await startDockerContainer("generated/hasura");
  await startDockerContainer("generated/core");

  // Wait for Hasura to be ready
  while (true) {
    console.log("🚀 Waiting for Hasura to be ready. Please be patient...");
    try {
      const { data } = await axios.get("http://127.0.0.1:8080/v1/version");
      if (data.version) {
        break;
      }
    } catch (error) {
      console.log("🚀 Hasura is not ready yet. Please be patient...");
    }

    await delay(1000);
  }
  console.log("🚀 Hasura is ready");

  // Apply migrations, metadata, and reload metadata with logs
  process.chdir("generated/hasura");
  console.log("🚀 Applying hasura migrations...");
  await execa("npm", ["run", "migrate:apply"], {
    stdio: "inherit",
    shell: true,
  });
  console.log("🚀 Applying hasura metadata...");
  await execa("npm", ["run", "metadata:apply"], {
    stdio: "inherit",
    shell: true,
  });
  console.log("🚀 Reloading metadata...");
  await execa("npm", ["run", "metadata:reload"], {
    stdio: "inherit",
    shell: true,
  });

  // Change back to root directory
  process.chdir(ROOT_DIR);

  // Initialize Git repository
  await initGit("generated/hasura");
  await initGit("generated/core");

  // Initial commit
  await gitCommit("generated/hasura", ["README.md"], '"Initial commit"');
  await gitCommit("generated/core", ["README.md"], '"Initial commit"');

  // Create GitHub repositories
  await createRepoInGitHub(
    "generated/hasura",
    PARAMS.GITHUB_USERNAME.value,
    PARAMS.SUPABASE_PROJECT_NAME.value + "-hasura"
  );
  await createRepoInGitHub(
    "generated/core",
    PARAMS.GITHUB_USERNAME.value,
    PARAMS.SUPABASE_PROJECT_NAME.value + "-core"
  );

  // Add secrets to GitHub repository
  await createSecretsInGitHubRepo("generated/hasura", [
    {
      key: "HASURA_GRAPHQL_DATABASE_URL",
      value: VARIABLES.__HASURA_GRAPHQL_DATABASE_URL__,
    },
    {
      key: "HASURA_GRAPHQL_ADMIN_SECRET",
      value: VARIABLES.__HASURA_GRAPHQL_ADMIN_SECRET__,
    },
  ]);

  await createSecretsInGitHubRepo("generated/core", [
    {
      key: "SUPABASE_URL",
      value: `https://${project.id}.supabase.co`,
    },
    {
      key: "SUPABASE_ANON_KEY",
      value: VARIABLES.__SUPABASE_ANON_KEY__,
    },
    {
      key: "HASURA_GRAPHQL_ENDPOINT",
      value: VARIABLES.__HASURA_GRAPHQL_ENDPOINT__,
    },
    {
      key: "HASURA_GRAPHQL_ADMIN_SECRET",
      value: VARIABLES.__HASURA_GRAPHQL_ADMIN_SECRET__,
    },
    {
      key: "ENCRYPTION_KEY",
      value: VARIABLES.__ENCRYPTION_KEY__,
    },
  ]);

  // Commit everything
  await gitCommit("generated/hasura", ["."], '"Add secrets"');
  await gitCommit("generated/core", ["."], '"Add secrets"');

  // Push to GitHub
  await pushToGitHub("generated/hasura");
  await pushToGitHub("generated/core");

  // Stop docker containers
  await stopDockerContainer("generated/hasura");
  await stopDockerContainer("generated/core");

  // Delete /generated directory
  // await execa("rm", ["-rf", "generated"], { shell: true });

  console.log("🚀 Done");
}

main();
