module.exports =
  {
    apps:
      [
        {
          name: 'JuanPortal',
          script: 'bin/www',
          ignore_watch: 'public/images',
          //watch: true,
          //output: 'logs/out.log', // Console logs
          //error: 'logs/err.log', // Errors
          log_type: 'JSON',
          log_date_format: 'DD-MM-YYYY',
          max_memory_restart: '100M',
          node_args: '--expose-gc' // to stop memory leaks by calling GC
        }
      ]
  };
