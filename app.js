const express=require("express");
const cors=require("cors");
const { connection } = require("./src/connection/db");
const { customerRouter } = require("./src/Customer/customerRoutes");
const { AdminRouter } = require("./src/Admin/adminRoutes");
const { MilkRouter } = require("./src/Milk/milkRoutes");
const { producedmilkRouter } = require("./src/ProducedMilk/producedmilkRoutes");
const { cowRouter } = require("./src/cow/cowRoutes");
const { expenseRouter } = require("./src/Expenses/expensesRoutes");
const { healthRouter } = require("./src/health/healthRoutes");
const { transporter } = require("./src/connection/mailConnection");
const rateRouter = require("./src/Milk/RateSetting/rateSettingRoutes");

require("dotenv").config();

const PORT=process.env.PORT || 3030;

const app=express();

app.use(cors());
 app.options('*', cors()); 

app.use(express.json());

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/utils/index.html");
  });
  
app.use("/api/admin",AdminRouter);
app.use("/api/customer",customerRouter);
app.use("/api/milk",MilkRouter)
app.use("/api/rate",rateRouter);
app.use("/api/cow",cowRouter);
app.use("/api/producedmilk",producedmilkRouter);
app.use("/api/expense",expenseRouter);
app.use("/api/health",healthRouter);
//server
app.listen(PORT, async ()=>{
    try {
        await connection
         
        console.log("DB connected successfully")
        console.log(`Server is running`)
        transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });
    } catch (error) {
        console.error(error);
    }
})