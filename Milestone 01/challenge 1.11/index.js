const app = require('./app');

// Load environment variables
require('dotenv').config();

// Get port from environment or use default
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start Express server
const server = app.listen(PORT, () => {
  console.log('=====================================');
  console.log('📝 Dev Confessions API Server');
  console.log('=====================================');
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api/confessions`);
  console.log('=====================================');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⛔ Server shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
