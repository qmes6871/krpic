module.exports = {
  apps: [{
    name: 'krpic',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/krpic',
    env: {
      PORT: 3006,
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
