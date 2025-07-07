<h1 align='center'>Sigma Labs General Tech (SLGT)</h1>

### What is SLGT?

One thing we realized while building web applications is that there are a lot of moving parts and it is hard to keep track of all of them. For instance, you need to manage your database, authentication, authorization, microservices, etc. Frontend developers need to know about backend and vice versa. What's even more annoying are credentials and secrets. You need to manage them and keep them secure.

We asked ourselves, why not build a platform that takes care of all these things and let developers focus on building the application? Instead of spending time on setting up the infrastructure, developers can focus on building the application. Sigma Tech is the answer to this question. You use Sigma Tech to spin up a new project and you are ready to go!

### What does SLGT do?

Sigma Labs General Tech or SLGT is simply a framework for building scalable and secure web applications/services. It can generate a new project with all the necessary tools and services required to build a web application under one organization. Currently, it can generate a new project with the following services:

1. Hasura GraphQL Engine
2. Core Server (Auth, Mail, etc.)
3. CI/CD (GitHub Actions)
4. Cloud Functions (Supabase Edge Functions) (Coming Soon)
5. Frontend (React, Next.js) (Coming Soon)

### How to use SLGT?

Please read the prerequisites and follow the instructions below to generate a new project using SLGT.

#### Requirements

1. [Node.js](https://nodejs.org/en/download/)
2. [Docker](https://docs.docker.com/get-docker/)
3. [Docker Compose](https://docs.docker.com/compose/install/)
4. [GitHub CLI](https://github.com/cli/cli#installation)
   You must login to GitHub CLI using `gh auth login` before running the SLGT commands.
5. Linux or Mac machine (Windows users can use WSL)

**Note:** The CI/CD only works if you're part of the Sigma Labs organization on GitHub. If you're not part of the organization, you'll need to set it up manually.

**Note:**. For CI/CD to work, you need to have a `secrets` folder that contains the necessary secrets for the project. The `secrets` folder should be in the root of the SLGT repository. Contact the team lead to get the `secrets` folder.

#### Instructions

1. Clone the SLGT repository:
   ```bash
   git clone <repo_url>
   ```
2. Change the directory to the SLGT repository:
   ```bash
   cd slgt
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the SLGT CLI:
   ```bash
   npm start
   ```
5. Follow the instructions shown in the CLI to generate a new project.

#### Things to do after generating a new project

1. By default, `.env` files are not committed to the repository. So do make sure to NOT to delete the `.env` files in the generated project. Instead, you should store the `.env` files in a secure place that only the team members have access to.
2. Run the project locally and test it to make sure everything is working as expected. Check the README.md file in the generated project for instructions on how to run the project locally.
3. Verify the GitHub Actions in newly created repository to make sure the CI/CD pipeline is working as expected.
4. If you face any issues, please reach out to the team lead or the project owner.
