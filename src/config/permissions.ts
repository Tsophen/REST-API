import User from "../api/v1.0/components/users/model";

const NAMESPACE = "Permissions";

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
    READ,
    UPDATE_ALL,
    DELETE
}

interface PERMISSION {
    resource: RESOURCE,
    action: ACTION
}

const permissions = new Map<PERMISSION, ROLE>();
permissions.set({ resource: RESOURCE.users, action: ACTION.READ_ALL },          ROLE.ADMIN);
permissions.set({ resource: RESOURCE.users, action: ACTION.READ },              ROLE.DEVELOPER);
permissions.set({ resource: RESOURCE.users, action: ACTION.UPDATE_ALL },        ROLE.DEVELOPER);
permissions.set({ resource: RESOURCE.users, action: ACTION.DELETE },            ROLE.ADMIN);

/**
 * Checks whether a user with the given userId has enough permissions to perform the action on the resource
 * 
 * @param userId     User to check
 * @param resource   Resource to check 
 * @param action     Action to check
 * @returns          @Promise resolved if the user has permissions | rejected if the user doesn't have permissions
 */
async function hasPermission(userId: string, resource: RESOURCE, action: ACTION): Promise<String> {
    return new Promise((resolve, reject) => {
        let requiredPermissionLevel = permissions.get({ resource, action });

        User.findById(userId).exec()
        .then(user => {
            if(!user || !user.permissionLevel)
                return reject("Couldn't load user's permissions");

            if(!requiredPermissionLevel)
                return reject("Can't find action for resource");

            if(user.permissionLevel < requiredPermissionLevel)
                return reject("Not enough permissions");
                
            return resolve("Allowed");
        })
        .catch(error => {
            return reject(error.message);
        });
    });
}

export { RESOURCE, ACTION, hasPermission }