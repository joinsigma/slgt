import {
  EnvironmentSetting,
  EnvironmentConfig,
} from '../interfaces/environment.interface'

class Environment {
  private static configs: EnvironmentConfig = {
    local: {
      name: 'local',
      debug: true,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      encryptKey: process.env.ENCRYPTION_KEY,
      hasuraGraphQLURL: process.env.HASURA_GRAPHQL_ENDPOINT,
      hasuraGraphQLAdminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  }

  /**
   * Get environment settings
   */
  public static config(): EnvironmentSetting {
    return this.configs['local']
  }
}

export default Environment
