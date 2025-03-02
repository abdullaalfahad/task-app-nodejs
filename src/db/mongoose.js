const mongoose = require("mongoose");

const URL = process.env.MONGODB_URI;

async function connectMongo() {
  try {
    await mongoose.connect(URL);
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}

mongoose.connection.on("connected", () => {
  console.log("DB connected!");
});

mongoose.connection.on("error", (error) => {
  console.log(error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("DB connection is disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

connectMongo();
