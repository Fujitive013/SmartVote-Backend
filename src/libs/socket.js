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
        let modifiedPayload = null;

        const fakeRes = {
            status: () => ({
                json: (data) => {
                    // Check if valid results structure
                    if (data && data.results && Array.isArray(data.results)) {
                        // +1 voteCount for each candidate
                        const updatedResults = data.results.map((result) => ({
                            ...result,
                            voteCount: result.voteCount + 1,
                        }));

                        modifiedPayload = {
                            ...data,
                            results: updatedResults,
                            totalVotes: updatedResults.reduce(
                                (sum, r) => sum + r.voteCount,
                                0
                            ),
                        };
                    } else {
                        modifiedPayload = data;
                    }
                },
            }),
        };

        const fakeReq = { params: { election_id: electionId } };
        await getCurrentElectionResults(fakeReq, fakeRes);

        if (modifiedPayload) {
            io.to(electionId).emit("electionResults", modifiedPayload);
        }
    } catch (err) {
        console.error("Error emitting updated results:", err);
    }
};

module.exports = {
    initializeSocket,
    emitResultsUpdate,
};
