# YouTube Video List MERN Application

A simple MERN stack application for managing YouTube videos.

## Features

- View a list of YouTube videos
- Add new videos with title, link, and category
- Videos are sorted by most recently added
- Input validation for required fields and valid YouTube URLs

## Tech Stack

- MongoDB - Database
- Express - Backend API
- React - Frontend UI
- Node.js - Server

## Setup and Running

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/youtube_videos
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add a new video

## Data Model

### Video
- title (String, required)
- link (String, required, must be valid YouTube URL)
- category (String, required, one of: Music, Education, Coding, Entertainment, News, Other)
- createdAt (Date, automatically generated)
- updatedAt (Date, automatically generated) 