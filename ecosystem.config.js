module.exports = {
  apps: [
    {
      name: 'language-learner',
      script: './server/index.js',
      cwd: '/var/www/language-buddy',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
