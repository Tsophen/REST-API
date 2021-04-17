import jwt from "jsonwebtoken";

enum KeyType {
  ACCESS,
  REFRESH
}

export class AuthService {  
  /**
   * Creates an access token for a user
   * 
   * @returns    Promise of a token/an error 
   */
  public async createAccessToken(userId: string): Promise<String | Error> {
    return new Promise((resolve, reject) => {
      if(!process.env.JWT_ACCESS_SECRET)
        return reject(new Error("Could not find a JWT Access Secret"));
      
      const token = jwt.sign({ id: userId, type: KeyType.ACCESS }, process.env.JWT_ACCESS_SECRET, { expiresIn: "5m" });

      return resolve(token);
    });
  }

  /**
   * Creates a refresh token for a user
   * 
   * @returns    Promise of a token/an error 
   */
   public async createRefreshToken(userId: string): Promise<String | Error> {
    return new Promise((resolve, reject) => {
      if(!process.env.JWT_REFRESH_SECRET)
        return reject(new Error("Could not find a JWT Refresh Secret"));
      
      const token = jwt.sign({ id: userId, type: KeyType.REFRESH }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

      return resolve(token);
    });
  }
}