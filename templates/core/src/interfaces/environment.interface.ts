export interface EnvironmentSetting {
  name: string
  debug: boolean
  supabaseUrl: string
  supabaseAnonKey: string
  hasuraGraphQLURL: string
  hasuraGraphQLAdminSecret: string
  encryptKey: string
}

export interface EnvironmentConfig {
  [key: string]: EnvironmentSetting
}
