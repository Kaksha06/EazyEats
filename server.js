const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 5001;
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');

// Send JSON Response Helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/booktable' && req.method === 'POST') {
    let body = '';

    // Receive data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Save after all data is received
    req.on('end', () => {
      const formData = querystring.parse(body); // Handle form-urlencoded data

      const newBooking = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        people: formData.people
      };

      const bookingsPath = BOOKINGS_FILE;

      // Read existing
      const currentData = JSON.parse(fs.readFileSync(bookingsPath, 'utf-8'));

      // Add new
      currentData.push(newBooking);

      // Write back to file
      fs.writeFileSync(bookingsPath, JSON.stringify(currentData, null, 2));

      sendJSON(res, 201, { message: 'Booking saved successfully', booking: newBooking });
    });
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`✅ EazyEats backend is running at http://localhost:${PORT}`);
});