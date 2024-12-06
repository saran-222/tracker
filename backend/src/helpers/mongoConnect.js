import 'dotenv/config'
import mongoose from "mongoose";

export default class Mongo{
    static async connect(req,res, next){
        try {
            return await new Promise((resolve, reject) => {
              mongoose.connect(process.env.CONNECTION_STRING);
              const connection = mongoose.connection;
              connection.on("open", () => {
                resolve(true);
              });
              connection.on("error", e => {
                reject(false);
              });
            });
          }
          catch {
            return false;
          }
    }
}