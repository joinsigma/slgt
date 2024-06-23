import axios from 'axios'
import Environment from '../config/environment'

class UserService {
  hasuraGraphQLURL: string
  hasuraGraphQLAdminSecret: string
  constructor() {
    this.hasuraGraphQLURL = Environment.config().hasuraGraphQLURL
    this.hasuraGraphQLAdminSecret =
      Environment.config().hasuraGraphQLAdminSecret
  }

  getProfiles = async () => {
    const query = JSON.stringify({
      query: `
      query GetProfiles {
        profiles {
          id
          userMetadata
        }
      }
      `,
    })

    const { data } = await axios.post(
      this.hasuraGraphQLURL + '/v1/graphql',
      query,
      {
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': this.hasuraGraphQLAdminSecret,
        },
      }
    )

    if (data?.errors?.length) {
      throw new Error(data.errors[0].message)
    }

    return data?.data?.profiles || []
  }
}

export default UserService
