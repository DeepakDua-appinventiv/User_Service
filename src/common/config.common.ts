import * as dotenv from "dotenv";
dotenv.config({});

const config = {
    PORT: process.env.PORT ,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    DB_NAME: process.env.DB_NAME ,
    SECRET_KEY: process.env.SECRET_KEY,
  };
  
  export default config;
  