module.exports = {
  apps : [{
    script: 'src/index.js',
    watch: false,
    error_file:"logs/errors.log",
    out_file:"logs/out.log",
    log_date_format:"YYYY-MM-DD HH:mm Z"
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',


    }
  }
};
