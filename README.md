NoteWriter
NoteWriter is a full‑stack note‑taking application that lets you capture your ideas in multiple formats. You can create text notes, record voice notes with live transcription, and enrich your notes by uploading images—all using a modern, responsive interface.

Features
Text Notes: Create, edit, and manage plain text notes.
Voice Notes: Record voice notes that are automatically transcribed in real time.
Image Uploads: Upload and attach images to your notes using Cloudinary.
Technologies Used
Frontend: React
Backend: Node.js, Express
Database: MongoDB (using Mongoose for object modeling)
Storage: Cloudinary for image hosting
Installation
Prerequisites
Node.js (v14+ recommended)
MongoDB (running locally or remotely)
A Cloudinary account (for image uploads)

Steps
1.Clone the repository:
bash
Copy
git clone https://github.com/yourusername/notewriter.git
cd notewriter

2.Install dependencies for the backend:
bash
Copy
cd backend
npm install

3.Install dependencies for the frontend:
bash
Copy
cd ../frontend
npm install

4.Configure environment variables:
In your backend directory, create a .env file and add:
env
Copy
MONGO_URI=your-mongodb-uri
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000

5.Start the backend server:
bash
Copy
cd ../backend
npm start

6.Start the frontend application:
bash
Copy
cd ../frontend
npm start

7.Open your browser and navigate to http://localhost:5173 to use the app.

Usage
Click the " + " Icon button to create a new note.
Use the provided interface to type your note, record a voice note (with live transcription), or upload images.
Manage your notes with options to edit, favorite, or delete them.
Contributing
Contributions are welcome! Please fork the repository, create a new branch for your feature or fix, and open a pull request. Make sure to follow the existing code style and include tests where applicable.

License
This project is licensed under the MIT License.

Contact
For questions or support, please contact Your Name.

This README covers your key features and technology stack without adding extraneous details. Feel free to customize it further to match your project’s specifics.
