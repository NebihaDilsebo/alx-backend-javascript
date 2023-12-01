const http = require('http');
const fs = require('fs');

// Function to read file asynchronously
function readFileAsync(file, callback) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// Create an HTTP server
const app = http.createServer((req, res) => {
  // Set the response headers
  res.setHeader('Content-Type', 'text/plain');

  // Handle different URL paths
  if (req.url === '/') {
    res.end('Hello Holberton School!\n');
  } else if (req.url === '/students') {
    // Assuming the database file is passed as a command-line argument
    const databaseFile = process.argv[2];

    // Read the content of the database file asynchronously
    readFileAsync(databaseFile, (err, data) => {
      if (err) {
        res.end('Error reading the database file\n');
      } else {
        // Process the content and generate the response
        const students = data.trim().split('\n').filter(Boolean);
        const totalStudents = students.length;
        const csStudents = students.filter((student) => student.endsWith('CS')).length;
        const sweStudents = students.filter((student) => student.endsWith('SWE')).length;

        const response = `This is the list of our students\nNumber of students: ${totalStudents}\nNumber of students in CS: ${csStudents}. List: ${students.filter((student) => student.endsWith('CS')).join(', ')}\nNumber of students in SWE: ${sweStudents}. List: ${students.filter((student) => student.endsWith('SWE')).join(', ')}\n`;

        res.end(response);
      }
    });
  } else {
    // Handle other paths with a 404 Not Found response
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
  }
});

// Set the server to listen on port 1245
const port = 1245;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Export the app for external use
module.exports = app;
