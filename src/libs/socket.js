const socketIO = require("socket.io");
const mongoose = require("mongoose");

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin:
                process.env.CLIENT_URL ||
                process.env.API_URL ||
                "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Join election room
        socket.on("joinElection", (electionId) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(electionId)) {
                    socket.emit("error", "Invalid election ID format");
                    return;
                }
                socket.join(`election-${electionId}`);
                console.log(`Socket ${socket.id} joined election ${electionId}`);
                
                // Send initial election results
                getCurrentElectionResults(electionId)
                    .then(results => {
                        socket.emit("electionUpdate", results);
                    })
                    .catch(err => {
                        console.error("Error fetching initial results:", err);
                    });
            } catch (error) {
                console.error("Error joining election room:", error);
                socket.emit("error", "Failed to join election room");
            }
        });

        // Leave election room
        socket.on("leaveElection", (electionId) => {
            socket.leave(`election-${electionId}`);
            console.log(`Socket ${socket.id} left election ${electionId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

// Helper function to emit updated results
const emitElectionUpdate = (electionId, data) => {
    if (!io) return;
    io.to(`election-${electionId}`).emit("electionUpdate", {
        electionId,
        totalVotes: data.totalVotes,
        results: data.results,
    });
};

module.exports = { initializeSocket, getIO, emitElectionUpdate };
