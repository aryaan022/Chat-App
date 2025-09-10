const express = require("express")
const dotenv = require("dotenv")
const cookieparser = require("cookie-parser")
const cors = require("cors");


const connectDb = require("./lib/db.js");
const authRoutes = require("./routes/auth.routes.js");

dotenv.config();


const port = process.env.PORT || 5001;


const app = express();
 




app.use(express.json());
app.use(cookieparser());
app.use(
    cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))
app.use("/api/auth", authRoutes);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
});