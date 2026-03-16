const { spawn } = require('child_process');
const yargs = require('yargs');

function runCommand(command, args, cwd, callback) {
  const isNpm = command === 'npm';
  const actualCommand = isNpm ? 'cmd' : command;
  const actualArgs = isNpm ? ['/c', `cd ${cwd} && npm ${args.join(' ')}`] : args;
  const child = spawn(actualCommand, actualArgs, { cwd: isNpm ? process.cwd() : cwd, stdio: 'inherit' });
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Command failed: ${command} ${args.join(' ')} in ${cwd}`);
      process.exit(1);
    }
    callback();
  });
}

const argv = yargs.argv;
const mapPath = argv.map || 'map.ascii';
const bookingsPath = argv.bookings || 'bookings.json';

// Install dependencies
runCommand('npm', ['install'], 'backend', () => {
  runCommand('npm', ['install'], 'frontend', () => {
    // Start backend and frontend
    const backend = spawn('node', ['backend/server.js', '--map', mapPath, '--bookings', bookingsPath], { stdio: 'inherit' });
    const frontend = spawn('cmd', ['/c', 'cd frontend && npm start'], { stdio: 'inherit' });

    process.on('SIGINT', () => {
      backend.kill();
      frontend.kill();
      process.exit();
    });
  });
});
