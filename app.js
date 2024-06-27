const  express = require("express");
const connectToDb = require("./config/connectToDb");
const cors = require("cors")
require("dotenv").config();
// Connection To DB
connectToDb();

//Init App
const app = express();


// MiddleWares
app.use(express.json());


app.use(cors({origin: "*"}));

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    })


// Routes
app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/salles", require("./routes/sallesRoute"));
app.use("/api/reservation", require("./routes/reservationsRoute"));


//Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
 )
);