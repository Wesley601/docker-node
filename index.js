import http from "http";
import mysql from "mysql";
import { faker } from "@faker-js/faker";

const conn = mysql.createConnection({
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
});

conn.query(
  "CREATE TABLE IF NOT EXISTS people (name VARCHAR(255) NOT NULL)",
  (error) => {
    if (error) {
      console.log("error trying to create a the table");
      console.error(error);
    }
  },
);

const server = http.createServer((_, res) => {
  conn.query(
    "INSERT INTO people(name) values (?)",
    [faker.person.fullName()],
    (error) => {
      if (error) {
        console.error(error);
        res.writeHead(500);
        res.end("internal server error");
      }

      conn.query("SELECT * FROM people", (error, result) => {
        if (error) {
          console.error(error);
          res.writeHead(500);
          res.end("internal server error");
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <h1>Full Cycle Rocks!</h1>
          ${result
            .map((people) => `- <strong>${people.name}</strong>`)
            .join("<br>")}
        `);
      });
    },
  );
});

server.listen(3000, () => {
  console.log("server listen on :3000");
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");

    console.log("Closing db connection");
    conn.end(() => {
      console.log("db connection closed.");
      process.exit(0);
    });
  });
});
