const socketIO = require("socket.io");

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
            socket.join(`election-${electionId}`);
            console.log(`Socket ${socket.id} joined election ${electionId}`);
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
const emitElectionUpdate = (electionId, results) => {
    if (!io) return;
    io.to(`election-${electionId}`).emit("electionUpdate", {
        electionId,
        results,
    });
};

module.exports = { initializeSocket, getIO, emitElectionUpdate };
