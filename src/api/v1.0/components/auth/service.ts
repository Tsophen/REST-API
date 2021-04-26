import jwt from "jsonwebtoken";

export class AuthService {  
  /**
   * Creates an access token for a user
   * 
   * @returns    Promise of a token/an error 
   */
  public async createAccessToken(userId: string): Promise<{ accessToken: string, expires: Number } | Error> {
    return new Promise((resolve, reject) => {
      if(!process.env.JWT_ACCESS_SECRET)
        return reject(new Error("Could not find a JWT Access Secret"));
      
      const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1m" });
      const object = {
        accessToken: token,
        expires: Date.now() + (60*1000)
      }

      return resolve(object);
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
      
      const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

      return resolve(token);
    });
  }
}