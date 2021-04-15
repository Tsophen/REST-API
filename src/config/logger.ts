import path from "path";
import Logger from "@lielamar/logger";

const logger = new Logger("REST-API", path.join(__dirname, "..", "..", "/logs"), { consoleLog: true, includeObjects: true });

export default logger;

// export class Logger2 {
//   private namespace;

//   constructor(namespace: string) {
//     this.namespace = namespace;
//   }

//   private getTimestamp = (): string => new Date().toISOString();
  
//   /**
//    * Logs an info message
//    * 
//    * @param message   Message to log
//    * @param object    Optional object to log
//    * @returns 
//    */
//   public info = (message: string, object?: any): void => {
//     if(object)
//       return console.info(`[${this.getTimestamp()}] [INFO] [${this.namespace}] ${message}`, object);
  
//     return console.info(`[${this.getTimestamp()}] [INFO] [${this.namespace}] ${message}`);
//   }
  
//   /**
//    * Logs a warn message
//    * 
//    * @param message   Message to log
//    * @param object    Optional object to log
//    * @returns 
//    */
//   public warn = (message: string, object?: any): void => {
//     if(object)
//       return console.warn(`[${this.getTimestamp()}] [WARN] [${this.namespace}] ${message}`, object);
      
//     return console.warn(`[${this.getTimestamp()}] [WARN] [${this.namespace}] ${message}`);
//   }
  
//   /**
//    * Logs a debug message
//    * 
//    * @param message   Message to log
//    * @param object    Optional object to log
//    * @returns 
//    */
//   public debug = (message: string, object?: any): void => {
//     if(object)
//       return console.debug(`[${this.getTimestamp()}] [DEBUG] [${this.namespace}] ${message}`, object);
      
//     return console.debug(`[${this.getTimestamp()}] [DEBUG] [${this.namespace}] ${message}`);
//   }
  
//   /**
//    * Logs an error message
//    * 
//    * @param message   Message to log
//    * @param object    Optional object to log
//    * @returns 
//    */
//   public error = (message: string, object?: any): void => {
//     if(object)
//       return console.error(`[${this.getTimestamp()}] [ERROR] [${this.namespace}] ${message}`, object);
      
//     return console.error(`[${this.getTimestamp()}] [ERROR] [${this.namespace}] ${message}`);
//   }
// }