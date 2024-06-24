import app from "./app";
import mongoose from "mongoose";
const port = 8000;
const DB_URI = "mongodb+srv://ghandhisanju:xQQYzwr8vlzvIWoT@sss.y1krw0v.mongodb.net/country-code?retryWrites=true&w=majority&appName=SSS"

async function main() {
    await mongoose.connect(DB_URI)

    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
      });
}

main().catch(e => console.error(e))