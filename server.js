const { View } = require("grandjs");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const colors = require("colors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

connectDB();

View.settings.set("views", "./templates");

app.use(express.json());
// uploading file
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));
// import route for execute
app.use("/api/v1/products", require("./routes/Products"));
app.use("/api/v1/orders", require("./routes/Orders"));
app.use("/api/v1/reviews", require("./routes/Reviews"));
app.use("/api/v1/locations", require("./routes/Locations"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/auth", require("./routes/auth"));

//Dev logging middleware
if (process.env.Node_ENV === "development") {
  app.use(morgan("dev"));
}
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
  );
});
