module.exports = {
  apps: [
    {
      name: 'nexus-backend',
      script: './backend/dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'nexus-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start ./frontend -p 3000',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
