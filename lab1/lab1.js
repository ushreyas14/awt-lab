const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const tracker = new EventEmitter();
const EVENT_TYPES = ['user-login', 'user-logout', 'user-purchase', 'profile-update'];
const stats = EVENT_TYPES.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
}, {});
const INDEX_FILE = path.join(__dirname, 'index.html');
const LOG_FILE = path.join(__dirname, 'events.log');
const PORT = process.env.PORT || 8080;

const logLine = (text) => {
    const stamp = new Date().toISOString();
    const entry = `[${stamp}] ${text}`;
    console.log(entry);
    fs.appendFile(LOG_FILE, `${entry}\n`, (err) => {
        if (err) {
            console.error('Failed to write log file:', err.message);
        }
    });
};

tracker.on('user-login', (name = 'Guest') => {
    stats['user-login'] += 1;
    logLine(`${name} logged in`);
});

tracker.on('user-logout', (name = 'Guest') => {
    stats['user-logout'] += 1;
    logLine(`${name} logged out`);
});

tracker.on('user-purchase', (item = 'Unknown item') => {
    stats['user-purchase'] += 1;
    logLine(`Purchase recorded: ${item}`);
});

tracker.on('profile-update', (field = 'Profile') => {
    stats['profile-update'] += 1;
    logLine(`Profile update: ${field}`);
});

tracker.on('summary', () => {
    logLine('--- Event Summary ---');
    EVENT_TYPES.forEach((type) => {
        logLine(`${type}: ${stats[type]}`);
    });
    logLine('----------------------');
});

const sendJson = (res, status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
};

const serveIndex = (res) => {
    const stream = fs.createReadStream(INDEX_FILE);
    stream.on('error', () => {
        sendJson(res, 500, { error: 'index.html missing next to lab1.js' });
    });
    stream.pipe(res);
};

const readJsonBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
        if (body.length > 1e6) {
            reject(new Error('PAYLOAD_TOO_LARGE'));
            req.destroy();
        }
    });
    req.on('end', () => {
        if (!body) {
            resolve({});
            return;
        }
        try {
            resolve(JSON.parse(body));
        } catch (err) {
            reject(new Error('INVALID_JSON'));
        }
    });
    req.on('error', reject);
});

const handleEventPost = async (req, res) => {
    try {
        const body = await readJsonBody(req);
        const { type, detail } = body;
        if (!EVENT_TYPES.includes(type)) {
            sendJson(res, 400, { error: 'Unknown event type.' });
            return;
        }
        const cleaned = typeof detail === 'string' ? detail.trim() : '';
        tracker.emit(type, cleaned);
        sendJson(res, 200, { message: `${type} stored`, stats });
    } catch (err) {
        if (err.message === 'INVALID_JSON') {
            sendJson(res, 400, { error: 'Body must be JSON.' });
            return;
        }
        if (err.message === 'PAYLOAD_TOO_LARGE') {
            sendJson(res, 413, { error: 'Payload too large.' });
            return;
        }
        sendJson(res, 500, { error: 'Server error.' });
    }
};

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        serveIndex(res);
        return;
    }

    if (req.method === 'GET' && req.url === '/stats') {
        sendJson(res, 200, { stats });
        return;
    }

    if (req.method === 'GET' && req.url === '/summary') {
        tracker.emit('summary');
        sendJson(res, 200, { message: 'Summary logged to server console.' });
        return;
    }

    if (req.method === 'POST' && req.url === '/event') {
        handleEventPost(req, res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
});

const demoEvents = [
    ['user-login', 'Ava'],
    ['user-purchase', 'Headphones'],
    ['profile-update', 'Shipping Address'],
    ['user-login', 'Noah'],
    ['user-purchase', 'Keyboard'],
    ['user-logout', 'Ava'],
    ['profile-update', 'Payment Method'],
    ['user-logout', 'Noah']
];

const runDemoSequence = () => {
    demoEvents.forEach(([type, detail], index) => {
        setTimeout(() => tracker.emit(type, detail), 400 * (index + 1));
    });
    setTimeout(() => tracker.emit('summary'), 400 * (demoEvents.length + 2));
};

server.listen(PORT, () => {
    logLine(`Event server running at http://localhost:${PORT}`);
    runDemoSequence();
});
