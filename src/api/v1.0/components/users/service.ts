import { randomString } from "../../../../config/global";

import User, { IUser } from "./model";

export class UsersService {
  /**
   * Retrieves data on all users
   * 
   * @returns   Promise of a list of users/an error 
   */
  public async getUsers(select?: string): Promise<IUser[] | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await (select ? User.find().select(select) : User.find()).exec();

        if(!users)
          return reject(new Error("Could not load users from the database"));
        
        return resolve(users);
      } catch(exception) {
        return reject(exception);
      }
    });
  }

  /**
   * Retrieves data on a specific user
   * 
   * @param userId   ID of the user to retrieve data on
   * @returns        Promise of a user/an error 
   */
  public getUser(userId: string, select?: string): Promise<IUser | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await (select ? User.findById(userId).select(select) : User.findById(userId)).exec();

        if(!user)
          return reject(new Error("Could not load user from the database"));
        
        return resolve(user);
      } catch(exception) {
        return reject(exception);
      }
    });
  }

  /**
   * Creates a new user
   * 
   * @param email      Email of the user
   * @param name       Full name of the user
   * @param vaultKey   A key generated using PBKDF2 on the user's password to verify their identiy and save their vault
   * @param reminder   <Optional> a reminder for the password
   * @returns          Promise of a (created) user/an error 
   */
  public createUser(email: string, name: string, vaultKey: string, reminder?: string): Promise<IUser | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const exsitingUser = await User.findOne({ email }).exec();

        if(exsitingUser)
          return reject(new Error("User with the provided email already exists!"));
        
        const newUser = new User({
          email: email,
          verified: false,
          emailVerificationToken: randomString(128),
          vaultKey: vaultKey,
          reminder: reminder,
          name: name,
          vault: {
            passwords: "",
            notes: "",
            settings: "",
            personal: ""
          },
          permissionLevel: 1
        });

        return resolve(await newUser.save());
      } catch(exception) {
        return reject(exception);
      }
    });
  }

  /**
   * Updates an existing user
   * 
   * @param usedId             Id of the user to update
   * @param updateOperations   An IUser object with new data to set
   * @returns                  Promise of an (update) user/an error 
   */
  public updateUser(userId: string, updateOperations: IUser): Promise<IUser | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: updateOperations }).exec();

        if(!updatedUser)
          return reject(new Error("Couldn't find any user with the given id"));
        
        return resolve(updatedUser);
      } catch(exception) {
        return reject(exception);
      }
    });
  }

  /**
   * Deletes an existing user
   * 
   * @param usedId   Id of the user to delete
   * @returns        Promise of an (update) user/an error 
   */
  public deleteUser(userId: string): Promise<IUser | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedUser = await User.remove({ _id: userId }).exec();

        if(!deletedUser || deletedUser.deletedCount === 0)
          return reject(new Error("Could not find any user with the given id"));
        
        return resolve(deletedUser);
      } catch(exception) {
        return reject(exception);
      }
    });
  }
}