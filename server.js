const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const CRDT = require("./crdt"); // Import the CRDT class

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const pool = new Pool({
  user: "peterashraf1",
  host: "soradogs-server.postgres.database.azure.com",
  database: "Soradogs",
  password: "Soradogs12345",
  port: 5432,
  ssl: true, // Enable SSL for Azure PostgreSQL
});

const crdt = new CRDT(); // Create a new instance of the CRDT class

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL at:", res.rows[0].now);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (docId) => {
    socket.join(docId);
    console.log(`User joined room: ${docId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on(
    "insert",
    (docId, char, uniqueId, fractionalId, isBold, isItalic) => {
      console.log(char);
      console.log(uniqueId);
      console.log(fractionalId);
      console.log(isBold);
      console.log(isItalic);
      crdt.insert(char, uniqueId, fractionalId, isBold, isItalic);
      socket
        .to(docId)
        .emit("insert", char, uniqueId, fractionalId, isBold, isItalic); // Broadcast insertions to clients in the same room
    }
  );

  socket.on("delete", (docId, uniqueId, fractionalId) => {
    crdt.delete(uniqueId, fractionalId); // Use CRDT to handle deletions
    socket.to(docId).emit("delete", uniqueId, fractionalId); // Broadcast deletions to clients in the same room
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
