module.exports = {
  "apps": [
    {
      "name": "rnc-malaysia-server",
      "script": "server.js",
      "cwd": "C:\\Users\\Lenovo\\CascadeProjects\\RNC\\CascadeProjects\\windsurf-project",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "env": {
        "NODE_ENV": "development",
        "PORT": 5000
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true,
      "log_date_format": "YYYY-MM-DD HH:mm Z"
    }
  ]
};