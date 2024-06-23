<h1 align='center'>__SUPABASE_PROJECT_NAME__ Hasura Server</h1>

## Running Locally

**Note 1**: This guide assumes you are using a Mac or Linux machine, if you are using Windows, you can use the Windows Subsystem for Linux (WSL) to run the following commands.  
**Note 2**: Please make sure you have Docker installed on your machine. If you don't have Docker installed, you can install it from [here](https://docs.docker.com/get-docker/).  
**Note 3**: You only need to run `chmod` commands one time. After that, you can skip them.

1. **Install Dependencies and Make the Scripts Executable**

   ```bash
   npm install
   chmod +x runner-*.sh
   ```

2. **Setup Environment Variables:**

   - Create a `.env` file by copying the `.env.example` file.

   ```bash
   cp .env.example .env
   ```

   - Edit the values in the `.env` file with the appropriate values. **Ask your team lead for the actual values of the environment variables.**

3. **Start the Server:**

   ```bash
   ./runner-start.sh
   ```

   Make sure you have the appropriate `.env` file in place before running this command.

   This will start the Hasura GraphQL engine. You can access the Hasura console at: http://localhost:8080/console

4. **Stop the Server:**

   ```bash
   ./runner-destroy.sh
   ```

## Migration & Metadata

- Check the status of the migrations

```
npm run status
```

- To apply migrations, run the following command:

```
npm run migrate:apply
```

- To apply metadata, run the following command:

```
npm run metadata:apply
```

- To export metadata, run the following command:

```
npm run metadata:export
```

See [Hasura CLI](https://hasura.io/docs/latest/hasura-cli/commands/index/) for all available commands.

## API Documentation

### API Endpoints:

Console URL: https://__SUPABASE_PROJECT_NAME__-hasura-krljeif4ga-as.a.run.app/console

GraphQL Endpoint: https://__SUPABASE_PROJECT_NAME__-hasura-krljeif4ga-as.a.run.app/v1/graphql_
