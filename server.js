const express = require('express');
const cors = require('cors');
const http = require('http');

// Import logic files
const hitbanxanh = require('./hitbanxanh_logic');
const hitmd5 = require('./hitmd5_logic');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// --- API HITCLUB BÀN XANH ---
app.get('/api/hithu/taixiu', (req, res) => {
    res.json(hitbanxanh.getCurrentData());
});

app.get('/api/hithu/history', (req, res) => {
    const limit = req.query.limit;
    res.json(hitbanxanh.getHistory(limit));
});

// --- API HITCLUB MD5 ---
app.get('/api/hitmd5/taixiu', (req, res) => {
    res.json(hitmd5.getCurrentData());
});

app.get('/api/hitmd5/history', (req, res) => {
    const limit = req.query.limit;
    res.json(hitmd5.getHistory(limit));
});

// Màn hình chính
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Hitclub API Tool</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    h1 { color: #333; text-align: center; }
                    .group { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    h2 { color: #007bff; margin-top: 0; }
                    a { color: #28a745; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Hitclub Consolidated API</h1>
                    <div class="group">
                        <h2>🟢 Bàn Xanh</h2>
                        <ul>
                            <li><a href="/api/hithu/taixiu">Dữ liệu hiện tại</a></li>
                            <li><a href="/api/hithu/history?limit=100">Lịch sử (100 phiên)</a></li>
                        </ul>
                    </div>
                    <div class="group">
                        <h2>🔴 MD5</h2>
                        <ul>
                            <li><a href="/api/hitmd5/taixiu">Dữ liệu hiện tại</a></li>
                            <li><a href="/api/hitmd5/history?limit=100">Lịch sử (100 phiên)</a></li>
                        </ul>
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`[🚀] Hitclub API Server đang chạy tại http://localhost:${PORT}`);

    // Khởi động kết nối
    hitbanxanh.startConnection();
    hitmd5.startConnection();

    // Tự ping để chống ngủ (Render)
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(() => {
        http.get(RENDER_EXTERNAL_URL, () => { }).on('error', () => { });
    }, 120000);
});
