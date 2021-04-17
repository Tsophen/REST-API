import { response } from "express";
import User from "../api/v1.0/components/users/model";

enum ROLE {
  ADMIN = 10,
  MANAGER = 9,
  DEVELOPER = 8,
  STAFF = 6,
  DELUX = 3,
  PREMIUM = 2,
  DEFAULT = 1
}

enum RESOURCE {
  users
}

enum ACTION {
  READ_ALL,
  READ_ONE,
  UPDATE_ALL_FIELDS,
  DELETE_ONE
}

class Permission {
  public resource: RESOURCE;
  public action: ACTION;
  public role: ROLE;

  constructor(resource: RESOURCE, action: ACTION, role: ROLE) {
    this.resource = resource;
    this.action = action;
    this.role = role;
  }
}

const permissions: Array<Permission> = [
  new Permission(RESOURCE.users, ACTION.READ_ALL, ROLE.ADMIN),
  new Permission(RESOURCE.users, ACTION.READ_ONE, ROLE.ADMIN),
  new Permission(RESOURCE.users, ACTION.UPDATE_ALL_FIELDS, ROLE.ADMIN),
  new Permission(RESOURCE.users, ACTION.DELETE_ONE, ROLE.ADMIN),
]

/**
 * Checks whether a user with the given userId has enough permissions to perform the action on the resource
 * 
 * @param userId     User to check
 * @param resource   Resource to check 
 * @param action     Action to check
 * @returns          @Promise resolved if the user has permissions | rejected if the user doesn't have permissions
 */
async function hasPermission(userId: string, resource: RESOURCE, action: ACTION): Promise<void | Error> {
  return new Promise(async (resolve, reject) => {
    const requiredPermission = permissions.filter(permission => (permission.resource === resource && permission.action === action))[0];
    if(!requiredPermission) return reject(new Error("Couldn't find required permission"));

    const requiredPermissionLevel = requiredPermission.role;
    if(!requiredPermissionLevel) return reject(new Error("Can't load the required permission level"));

    try {
      const user = await User.findById(userId).exec();

      if(!user || !user.permissionLevel)
        return reject(new Error("Couldn't load user's permissions"));

      if(user.permissionLevel < requiredPermissionLevel)
        return reject(new Error("Not enough permissions"));
      
      return resolve();      
    } catch(exception) {
      return reject(exception);
    }
  });
}

export { RESOURCE, ACTION, hasPermission }