import { randomString } from "../../../../config/global";

import User, { IUser } from "./model";

export class UsersService {
  private readonly retrievables: string = "_id email name"

  /**
   * Retrieves data on all users
   * 
   * @returns   Promise of a list of users/an error 
   */
  public async getUsers(): Promise<IUser[] | Error> {
    return new Promise((resolve, reject) => {
      User.find().select(this.retrievables).exec()
        .then(users => {
          if(!users)
            return reject(new Error("Could not load users from the database"));
            
          return resolve(users);
        })
        .catch(error => {
          return reject(error);
        });
    });
  }

  /**
   * Retrieves data on a specific user
   * 
   * @param userId   ID of the user to retrieve data on
   * @returns        Promise of a user/an error 
   */
  public getUser(userId: string): Promise<IUser | Error> {
    return new Promise((resolve, reject) => {
      User.findById(userId).select(this.retrievables).exec()
        .then(user => {
          if(!user)
            return reject(new Error("Could not load user from the database"));
            
          return resolve(user);
        })
        .catch(error => {
          return reject(error);
        });
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
    return new Promise((resolve, reject) => {
      User.findOne({ email }).exec()
        .then(user => {
          if(user)
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

          newUser.save()
            .then(createdUser => {
              return resolve(createdUser);
            })
            .catch(error => {
              return reject(error);
            })
        })
        .catch(error => {
          return reject(error);
        });
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
    return new Promise((resolve, reject) => {
      User.findOneAndUpdate({ _id: userId }, { $set: updateOperations }).exec()
        .then(updatedUser => {
          if(!updatedUser)
            return reject(new Error("Couldn't find any user with the given id"));
          
          return resolve(updatedUser);
        })
        .catch(error => {
          return reject(error);
        });
    });
  }

  /**
   * Deletes an existing user
   * 
   * @param usedId   Id of the user to delete
   * @returns        Promise of an (update) user/an error 
   */
  public deleteUser(userId: string): Promise<IUser | Error> {
    return new Promise((resolve, reject) => {
      User.remove({ _id: userId }).exec()
        .then(result => {
          if(result.deletedCount === 0)
            return reject(new Error("Could not find any user with the given id"));

          return resolve(result);
        })
        .catch(error => {
          return reject(error);
        });
    });
  }
}