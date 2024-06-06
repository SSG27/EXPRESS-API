import app from "./app";
import mongoose from "mongoose";
const port = 3000;
const DB_URI = "mongodb://localhost:27017/country-code"

async function main() {
    await mongoose.connect(DB_URI)

    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
      });
}

main().catch(e => console.error(e))