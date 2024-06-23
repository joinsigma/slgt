import { v4 as uuidv4 } from 'uuid'

class UUIDUtil {
  public static generateUUID() {
    return uuidv4()
  }
}

export default UUIDUtil
