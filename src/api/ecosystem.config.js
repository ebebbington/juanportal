module.exports =
  {
    apps:
      [
        {
          name: 'API',
          script: 'bin/www',
          watch: false,
          //output: 'logs/out.log', // Console logs
          //error: 'logs/err.log', // Errors
          log_type: 'JSON',
          log_date_format: 'DD-MM-YYYY',
          max_memory_restart: '100M',
          node_args: '--expose-gc' // to stop memory leaks by calling GC
        }
      ]
  };
