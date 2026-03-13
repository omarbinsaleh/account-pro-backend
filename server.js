// import necessary modules
const app = require('./src/app');

// define necessary constants
const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});