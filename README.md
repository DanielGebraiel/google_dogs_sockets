# Google Dogs Sockets 🚀📄

This repository contains the **Node.js** application that handles real-time collaborative editing for **Google Dogs**, a collaborative text editor. This part of the application ensures smooth real-time synchronization between multiple users working on the same or different documents, using **CRDT (Conflict-Free Replicated Data Types)** with **fractional indexing** for concurrency control.

## Features

- **Real-Time Collaboration**: Handles real-time document edits for multiple users.
- **Auto-Saving**: Automatically saves document changes to the database as users edit.
- **Concurrency Control**: Ensures that edits made by multiple users are synchronized, even when they occur simultaneously, using **CRDT** to prevent collisions.
- **Collision Handling**: Detects and resolves editing collisions when two or more users are working on the same document.
- **Document Management**: Recognizes if editors are working on the same or different documents and handles their edits accordingly.

## CRDT and Fractional Indexing

The core of the concurrency control mechanism in Google Dogs is the **CRDT** (Conflict-Free Replicated Data Types) class, which allows multiple users to edit the same document without conflict. It uses **fractional indexing** to:

- Ensure **total order** of document changes.
- Prevent **collisions** when two users are editing the same part of a document at the same time.
- Efficiently manage **distributed edits**, ensuring that changes are merged correctly, regardless of the order or timing.

## References

- [Google Dogs Frontend](https://github.com/DanielGebraiel/google_dogs)
- [Google Dogs Backend](https://github.com/PeterAshraf1/Google_Dogs_backend)
