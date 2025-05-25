# SmartVote Backend

SmartVote Backend is the server-side application for the SmartVote platform, providing RESTful APIs for managing elections, candidates, users, votes, and results. It is built with Node.js and Express, and uses MongoDB for data storage.

## Features
- User authentication and authorization (JWT-based)
- Admin and user roles
- Election creation and management
- Candidate and location management
- Secure voting process
- Real-time updates via sockets
- Rate limiting and CORS configuration

## Project Structure
```
src/
  config/           # Configuration files (CORS, etc.)
  controllers/      # Route controllers for business logic
  libs/             # Utility libraries (DB, rate limit, socket)
  middlewares/      # Express middlewares (auth, validation)
  models/           # Mongoose models
  routes/           # Express route definitions
  schemas/          # Mongoose schemas
  utils/            # Utility functions (auth, JWT, etc.)
  server.js         # Main server entry point
Dockerfile          # Docker configuration
package.json        # Project metadata and scripts
vercel.json         # Vercel deployment config
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Docker (optional, for containerization)

### Installation
1. Clone the repository:
   ```powershell
   git clone <repo-url>
   cd "SmartVote Backend"
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     PORT=3000
     ```

### Running the Server
- Start the server:
  ```powershell
  npm start
  ```
- The server will run on `http://localhost:3000` by default.

### Docker
- Build and run with Docker:
  ```powershell
  docker build -t smartvote-backend .
  docker run -p 3000:3000 --env-file .env smartvote-backend
  ```

### API Endpoints
- Authentication: `/api/auth`
- Admin: `/api/admins`
- Elections: `/api/elections`
- Locations: `/api/locations`
- Votes: `/api/votes`

Refer to the route files in `src/routes/` for detailed endpoint information.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
