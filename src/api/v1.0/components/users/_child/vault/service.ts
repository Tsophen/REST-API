import User, { IUser } from "$api/v1.0/users/model";

export class UsersVaultService {
  /**
   * Updates an existing user's vault
   * 
   * @param usedId   Id of the user to update
   * @param vault    New vault of the user
   * @returns        Promise of a (updated) user/an error 
   */
  public updateUserVault(userId: string, vault: string): Promise<IUser | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { vault } }, { new: true }).exec();
  
        if(!updatedUser)
          return reject(new Error("Couldn't find any user with the given id"));
          
        return resolve(updatedUser);
      } catch(exception) {
        return reject(exception);
      }
    });
  }
}