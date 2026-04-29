const app = require("./src/app");

const port = Number.parseInt(process.env.PORT, 10) || 3000;

app.listen(port, () => {
  console.log(`Seat booking API listening on port ${port}`);
});
