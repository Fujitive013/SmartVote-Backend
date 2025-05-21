const { Server } = require("socket.io");
const {
    getCurrentElectionResults,
} = require("../controllers/electionsControllers");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinElectionRoom", async (electionId) => {
            try {
                socket.join(electionId);
                console.log(
                    `Socket ${socket.id} joined election ${electionId}`
                );

                // Emit current results to the new user
                const fakeRes = {
                    status: () => ({
                        json: (data) => {
                            socket.emit("electionResults", data);
                        },
                    }),
                };
                const fakeReq = { params: { election_id: electionId } };

                await getCurrentElectionResults(fakeReq, fakeRes);
            } catch (err) {
                console.error("Error joining election room:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
};

const emitResultsUpdate = async (electionId) => {
    if (!io) return;

    try {
        const fakeRes = {
            status: () => ({
                json: (data) => {
                    // You could just emit the real results here, no need to mutate vote counts unless testing
                    io.to(electionId).emit("electionResults", data);
                },
            }),
        };

        const fakeReq = { params: { election_id: electionId } };
        await getCurrentElectionResults(fakeReq, fakeRes);
    } catch (err) {
        console.error("Error emitting updated results:", err);
    }
};

module.exports = {
    initializeSocket,
    emitResultsUpdate,
};
