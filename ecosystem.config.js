// PM2 Process Management Configuration for TOTAG Group Platform
module.exports = {
  apps: [{
    name: 'totag-platform',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Auto-restart options
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Resource limits
    max_memory_restart: '1G',
    
    // Advanced options
    node_args: '--max-old-space-size=1024',
    source_map_support: false,
    
    // Environment-specific configuration
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Health monitoring
    health_check_url: 'http://localhost:3000/api/services',
    health_check_grace_period: 30000
  }]
}