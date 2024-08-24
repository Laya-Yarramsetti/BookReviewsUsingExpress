const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Authentication route (example)
app.post('/customer/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Add your authentication logic here
    if (username === 'validUser' && password === 'validPass') {
        const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });
        req.session.token = token; // Store JWT in session
        res.json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to protect authenticated routes
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access: No session token' });
    }
    try {
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        req.user = decoded; // Add decoded token data to request object
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access: Invalid session token' });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
