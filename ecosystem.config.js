module.exports =
  {
    apps:
      [
        {
          name: 'JuanPortal',
          script: '/mnt/c/xampp/htdocs/juanportal/app.js',
          watch: true,
          output: 'logs/out.log', // Console logs
          error: 'logs/err.log', // Errors
          log: 'logs/combined.outerr.log', // Both console and errors
          log_type: 'JSON',
          log_date_format: 'DD-MM-YYYY',
          max_memory_restart: '100M',
          node_args: '--expose-gc' // to stop memory leaks by calling GC
        }
      ]
  };
