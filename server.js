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
    pool.query("SELECT content FROM document WHERE doc_id = $1", [docId], (err, res) => {
      if (err) {
        console.error(`Error fetching document: ${err}`);
      } else if (res.rows[0]) {
        // Emit an event to the client with the document content
        console.log("Emitting content to client: ", res.rows[0].content);
        socket.emit('document', res.rows[0].content);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on(
    "insert",
    (docId, char, uniqueId, fractionalId, isBold, isItalic) => {
      uniqueId = parseFloat(uniqueId);
      fractionalId = parseFloat(fractionalId);
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

  socket.on(
    "delete",
    (docId, char, uniqueId, fractionalId, isBold, isItalic) => {
      uniqueId = parseFloat(uniqueId);
      fractionalId = parseFloat(fractionalId);
      console.log(char);
      console.log(uniqueId);
      console.log(fractionalId);
      console.log(isBold);
      console.log(isItalic);
      crdt.delete(uniqueId, fractionalId);
      socket
        .to(docId)
        .emit("delete", char, uniqueId, fractionalId, isBold, isItalic); // Broadcast insertions to clients in the same room
    }
  );

  socket.on("update", (docId, updateType, updatedNodes) => {
    console.log(updateType);
    updatedNodes.forEach(({ uniqueId }) => {
      switch (updateType) {
        case "bold":
          crdt.bold(uniqueId);
          break;
        case "unbold":
          crdt.unbold(uniqueId);
          break;
        case "italic":
          crdt.italic(uniqueId);
          break;
        case "unitalic":
          crdt.unitalic(uniqueId);
          break;
        default:
          console.error(`Invalid update type: ${updateType}`);
      }
    });

    // Broadcast the updates to other clients in the same room
    socket.to(docId).emit("update", updateType, updatedNodes);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
