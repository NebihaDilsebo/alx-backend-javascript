const http = require('http');
const fs = require('fs');

// Function to read file asynchronously
const readFileAsync = (file, callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Function to parse CSV data and filter out empty lines
const parseCSV = (data) => {
  const lines = data.split('\n').filter((line) => line.trim() !== '');
  return lines;
};

// Create HTTP server
const app = http.createServer((req, res) => {
  // Set the content type to plain text
  res.setHeader('Content-Type', 'text/plain');

  // Handle requests based on URL path
  if (req.url === '/') {
    res.end('Hello Holberton School!\n');
  } else if (req.url === '/students') {
    // Get the database file name from command line arguments
    const databaseFileName = process.argv[2];

    // Read the file asynchronously
    readFileAsync(databaseFileName, (err, data) => {
      if (err) {
        res.end(`Error reading file: ${err}\n`);
      } else {
        // Parse CSV data and filter out empty lines
        const lines = parseCSV(data);

        // Calculate the number of students
        const numberOfStudents = lines.length - 1; // Subtract 1 to exclude header

        // Extract students in CS and SWE
        const csStudents = lines.filter((line) => line.endsWith(',CS')).length;
        const sweStudents = lines.filter((line) => line.endsWith(',SWE')).length;

        // Extract names of students in CS and SWE
        const csStudentNames = lines
          .filter((line) => line.endsWith(',CS'))
          .map((line) => line.split(',')[0]);
        const sweStudentNames = lines
          .filter((line) => line.endsWith(',SWE'))
          .map((line) => line.split(',')[0]);

        // Generate the response
        const response = `This is the list of our students\nNumber of students: ${numberOfStudents}\nNumber of students in CS: ${csStudents}. List: ${csStudentNames.join(', ')}\nNumber of students in SWE: ${sweStudents}. List: ${sweStudentNames.join(', ')}\n`;

        // Send the response
        res.end(response);
      }
    });
  } else {
    // Handle other paths with a 404 Not Found response
    res.statusCode = 404;
    res.end('Not Found\n');
  }
});

// Set the server to listen on port 1245
const port = 1245;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Export the app variable
module.exports = app;

