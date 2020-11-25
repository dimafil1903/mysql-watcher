const MySQLEvents = require('@rodrigogs/mysql-events');
const connection = require("./config/connection.js")
const  triggers= require("./triggers")
const ora = require('ora'); // cool spinner
const server = require("./server")
const spinner = ora({
    text: '🛸 Waiting for database events... 🛸 MEMORY USAGE:' + Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100 + "MB",
    color: 'blue',
    spinner: 'dots2'
});

const watcher = async () => {
    const instance = new MySQLEvents(connection, {
        startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
    });
    await instance.start();
    triggers(instance,MySQLEvents)
    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

watcher()
    .then(spinner.start.bind(spinner))
    .catch(console.error);
server.server()