import dotenv from "dotenv"
import { ConnectDB } from "./db/db.js";
import { app } from "./app.js"


dotenv.config({
    path: "./.env"
})

ConnectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        })
    })


