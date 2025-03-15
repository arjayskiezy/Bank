const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bank"
});


const wss = new WebSocket.Server({ port: 8082 }); // Choose a port for WebSocket communication

wss.on('connection', function connection(ws) {
    console.log('WebSocket connection established');
    
    ws.on('message', function incoming(message) {
        console.log('Received message:', message);
        // Handle incoming messages if needed
    });
    
    ws.on('close', function close() {
        console.log('WebSocket connection closed');
    });
});

// Function to generate a random 6-digit code
function generateBankID() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a random number between 100000 and 999999
}

app.post('/signup', (req, res) => {
    // Check if the email already exists in the database
    db.query('SELECT * FROM login WHERE email = ?', [req.body.email], (err, rows) => {
        if (err) {
            return res.json({ success: false, message: "Error processing signup" });
        }
        
        if (rows.length > 0) {
            // If there are rows with the same email, return an error
            return res.json({ success: false, message: "Email already taken. Please use another email" });
        }

        // Check if the phone number already exists in the database
        db.query('SELECT * FROM login WHERE phoneNumber = ?', [req.body.phoneNumber], (phoneErr, phoneRows) => {
            if (phoneErr) {
                return res.json({ success: false, message: "Error processing signup" });
            }
            
            if (phoneRows.length > 0) {
                // If there are rows with the same phone number, return an error
                return res.json({ success: false, message: "Phone number already taken. Please use another phone number" });
            }

            // Continue with signup process
            // Generate a random 6-digit bank ID
            const bankID = generateBankID();
            const disabled = true;

            // Insert the new record into the database
            const sql = "INSERT INTO login(`name`, `email`, `password`, `balance`, `phoneNumber`, `bank_id`, `disabled`) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.password,
                req.body.balance,
                req.body.phoneNumber, // Add phoneNumber value
                bankID,
                disabled // Set disabled to true by default
            ];

            db.query(sql, values, (err, data) => {
                if (err) {
                    return res.json({ success: false, message: "Error processing signup" });
                }
                return res.json({ success: true, message: "Signup successful", bankID: bankID });
            });
        });
    });
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE `email`= ? AND BINARY `password` = ? ";
    
    db.query(sql, [email, password], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error processing login request" });
        }
        
        if (data.length > 0) {
            const user = data[0];
            if (user.disabled) {
                return res.json({ success: false, message: "WaitingForAdminApproval" });
            } else {
                return res.json({ success: true, message: "LoginSuccessful" });
            }
        } else {
            return res.json({ success: false, message: "IncorrectEmailOrPassword" });
        }
    });
});



app.get('/user/:email', (req, res) => {
    const { email } = req.params;
    const sql = "SELECT name, email, balance FROM signup.login WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error fetching user data" });
        }
        console.log('Fetched user data:', data); // Debugging line
        if (data.length > 0) {
            return res.json({ success: true, user: data[0] });
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    });
});

function updateBalance(email, amount, operation) {
    const sql = operation === 'deposit' ? 
        "UPDATE login SET balance = balance + ? WHERE email = ?" : 
        "UPDATE login SET balance = balance - ? WHERE email = ?";
    const values = [amount, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }
        console.log('Balance updated successfully');
    });
}

// Helper function to get the current date and time in local timezone as an ISO string
function getLocalISOTime() {
    const d = new Date();
    const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
}

app.post('/deposit', (req, res) => {
    const { email, amount } = req.body;

    if (!email || !amount) {
        return res.json({ success: false, message: "Amount is required" });
    }

    updateBalance(email, amount, 'deposit');

    const date = getLocalISOTime(); // Use the helper function to get the current date and time in local timezone
    const type = 'deposit';
    const sql = "INSERT INTO transactions (email, date, type, amount) VALUES (?, ?, ?, ?)";
    const values = [email, date, type, amount];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json({ success: false, message: "Error processing deposit" });
        }

        // Send message to all connected WebSocket clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Deposit successful');
            }
        });

        return res.json({ success: true, message: "Deposit successful" });
    });
});

app.post('/withdraw', (req, res) => {
    const { email, amount } = req.body;

    if (!email || !amount) {
        return res.json({ success: false, message: "Amount is required" });
    }

    db.query('SELECT balance FROM login WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error processing withdrawal" });
        }

        if (rows.length === 0 || rows[0].balance < amount) {
            return res.json({ success: false, message: "Insufficient balance" });
        }

        updateBalance(email, amount, 'withdraw');

        const date = getLocalISOTime(); // Use the helper function to get the current date and time in local timezone
        const type = 'withdraw';
        const sql = "INSERT INTO transactions (email, date, type, amount) VALUES (?, ?, ?, ?)";
        const values = [email, date, type, amount];

        db.query(sql, values, (err, data) => {
            if (err) {
                return res.json({ success: false, message: "Error processing withdrawal" });
            }

            // Send message to all connected WebSocket clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('Withdrawal successful');
                }
            });
            

            return res.json({ success: true, message: "Withdrawal successful" });
        });
    });
});


// Add a new route to fetch transactions for a user
app.get('/transactions/:email', (req, res) => {
    const { email } = req.params;
    const sql = "SELECT * FROM transactions WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error fetching transactions" });
        }
        console.log('Fetched transactions:', data); // Debugging line
        return res.json({ success: true, transactions: data });
    });
});


app.post('/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    // Check if the email, currentPassword, and newPassword are provided
    if (!email || !currentPassword || !newPassword) {
        return res.json({ success: false, message: "Email, current password, and new password are required" });
    }

    // Check if the current password matches the password in the database
    const checkPasswordQuery = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(checkPasswordQuery, [email, currentPassword], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error checking password" });
        }

        if (rows.length === 0) {
            return res.json({ success: false, message: "Incorrect current password" });
        }

        // Update the password in the database
        const updatePasswordQuery = "UPDATE login SET password = ? WHERE email = ?";
        db.query(updatePasswordQuery, [newPassword, email], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.json({ success: false, message: "Error updating password" });
            }
            return res.json({ success: true, message: "Password updated successfully" });
        });
    });
});


app.post('/share-balance', (req, res) => {
    const { senderEmail, bankId, amount } = req.body;

    // Check if the sender's email, bank ID, and amount are provided
    if (!senderEmail || !bankId || !amount) {
        return res.json({ success: false, message: "Sender's email, recipient bank ID, and amount are required" });
    }

    // Fetch the sender's current balance
    const senderBalanceQuery = "SELECT balance FROM login WHERE email = ?";
    db.query(senderBalanceQuery, [senderEmail], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error fetching sender's balance" });
        }

        if (rows.length === 0) {
            return res.json({ success: false, message: "Sender not found" });
        }

        const senderBalance = rows[0].balance;

        // Check if the amount to be shared is greater than the sender's balance
        if (amount > senderBalance) {
            return res.json({ success: false, message: "Insufficient balance to share" });
        }

        // Retrieve the recipient's email using their bank ID
        const recipientEmailQuery = "SELECT email FROM login WHERE bank_id = ?";
        db.query(recipientEmailQuery, [bankId], (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.json({ success: false, message: "Error retrieving recipient's email" });
            }

            if (rows.length === 0) {
                return res.json({ success: false, message: "Recipient not found" });
            }

            const recipientEmail = rows[0].email;

            // Update the balance of the recipient
            const updateBalanceQuery = "UPDATE login SET balance = balance + ? WHERE email = ?";
            db.query(updateBalanceQuery, [amount, recipientEmail], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.json({ success: false, message: "Error updating recipient's balance" });
                }
                
                // Deduct the amount from the sender's balance
                const updateSenderBalanceQuery = "UPDATE login SET balance = balance - ? WHERE email = ?";
                db.query(updateSenderBalanceQuery, [amount, senderEmail], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.json({ success: false, message: "Error updating sender's balance" });
                    }

                    // Insert the transaction record into the transactions table
                    const date = getLocalISOTime(); // Use the helper function to get the current date and time in local timezone
                    const type = 'share';
                    const transactionSql = "INSERT INTO transactions (email, date, type, amount) VALUES (?, ?, ?, ?)";
                    const transactionValues = [senderEmail, date, type, amount];

                    db.query(transactionSql, transactionValues, (err, data) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.json({ success: false, message: "Error storing transaction record" });
                        }

                        wss.clients.forEach(function each(client) {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send('Share successful');
                            }
                        });

                        return res.json({ success: true, message: "Balance shared successfully" });
                    });
                });
            });
        });
    });
});





// API endpoint to fetch the list of accounts
app.get('/accounts', (req, res) => {
    const sql = "SELECT bank_id, name, email, password, balance, PhoneNumber FROM login";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ success: false, message: "Error fetching accounts" });
        }
        return res.json({ success: true, accounts: data });
    });
});

// Approve account
app.post('/accounts/approve/:bankId', (req, res) => {
    const bankId = parseInt(req.params.bankId);
    const sql = "UPDATE login SET disabled = FALSE WHERE bank_id = ?";
    db.query(sql, [bankId], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Error approving account" });
        }
        return res.json({ success: true, message: "Account approved successfully" });
    });
});

// Disable account
app.post('/accounts/disable/:bankId', (req, res) => {
    const bankId = parseInt(req.params.bankId);
    const sql = "UPDATE login SET disabled = TRUE WHERE bank_id = ?";
    db.query(sql, [bankId], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Error disabling account" });
        }
        return res.json({ success: true, message: "Account disabled successfully" });
    });
});


app.post('/checkout', (req, res) => {
    const { email, password, subtotal } = req.body;

    // Check if email, password, and subtotal are provided and valid
    if (!email || !password || !subtotal || isNaN(subtotal) || subtotal <= 0) {
        return res.status(400).json({ success: false, message: "Invalid email, password, or subtotal" });
    }

    // Query the database to find the user with the provided email and password
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: "Error processing checkout" });
        }

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const user = rows[0];

        // Check if the user has enough balance
        if (user.balance < subtotal) {
            return res.status(403).json({ success: false, message: "Insufficient balance" });
        }

        // Deduct the subtotal from the user's balance
        const newBalance = user.balance - subtotal;
        const updateBalanceQuery = "UPDATE login SET balance = ? WHERE email = ?";
        db.query(updateBalanceQuery, [newBalance, email], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: "Error updating balance" });
            }

            // Insert a transaction record into the transactions table
            const date = getLocalISOTime();
            const type = 'shop';
            const transactionSql = "INSERT INTO transactions (email, date, type, amount) VALUES (?, ?, ?, ?)";
            const transactionValues = [email, date, type, subtotal];

            db.query(transactionSql, transactionValues, (err, data) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: "Error storing transaction record" });
                }

                // Send message to all connected WebSocket clients (frontend tabs)
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send('Checkout successful');
                        }
                    });

                return res.json({ success: true, message: "Checkout successful", newBalance: newBalance });
            });
        });
    });
});



app.post('/promo-data', (req, res) => {
    const { phoneNumber, promoType, amount, date } = req.body;

    // Debugging: Log the phone number before validation
    console.log(`Phone number before validation: '${phoneNumber}'`);

    // Validate phone number
    if (!/^\d{11}$/.test(phoneNumber)) {
        // Debugging: Log when validation fails
        console.log(`Validation failed for phone number: '${phoneNumber}'`);
        return res.status(400).json({ success: false, message: "Invalid phone number format. Please enter exactly 11 digits." });
    }

    // Debugging: Log when validation passes
    console.log(`Validation passed for phone number: '${phoneNumber}'`);

    console.log(`Received promoType: ${promoType}, date: ${date}`);

    // Query the database to find the user with the provided phone number   
    const sql = "SELECT * FROM login WHERE PhoneNumber = ?";
    db.query(sql, [phoneNumber], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: "Error processing promo data" });
        }

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid phone number" });
        }

        const user = rows[0];

        // Ensure both balance and amount are numbers
        const userBalance = Number(user.balance);
        const promoAmount = Number(amount);

        // Log the balance and amount for debugging
        console.log(`User balance: ${userBalance}, Promo amount: ${promoAmount}`);

        // Check if the user has enough balance
        if (userBalance < promoAmount) {
            return res.status(403).json({ success: false, message: "Insufficient balance" });
        }

        // Deduct the amount from the user's balance
        const newBalance = userBalance - promoAmount;
        const updateBalanceQuery = "UPDATE login SET balance = ? WHERE PhoneNumber = ?";
        db.query(updateBalanceQuery, [newBalance, phoneNumber], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: "Error updating balance" });
            }

            // Insert data into the database
            const insertSql = `INSERT INTO salessummary (item_name, total_amount, sale_date) 
                               VALUES (?, ?, ?)`;
            const values = [promoType, amount, date]; // You can adjust the default values for least/frequent quantities and total amount as needed

            db.query(insertSql, values, (error, results) => {
                if (error) {
                    console.error('Error inserting promo data:', error);
                    res.status(500).json({ success: false, message: 'Failed to store promo data' });
                } else {
                    console.log('Promo data inserted successfully');

                    // Insert a transaction record into the transactions table
                        const transactionDate = getLocalISOTime(); // Assuming getLocalISOTime() is a function that returns the current date in ISO format
                        const transactionType = 'Load'; // Assuming 'Load' is the transaction type for promo data
                        const transactionAmount = amount; // Assuming the transaction amount is the same as the promo amount
                        
                        // First, find the email associated with the phone number from the login table
                        const findEmailSql = "SELECT email FROM login WHERE phoneNumber = ?";
                        db.query(findEmailSql, [phoneNumber], (err, data) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ success: false, message: "Error fetching email" });
                            }
                        
                            // Check if an email was found for the phone number
                            if (data.length > 0) {
                                const email = data[0].email; // Assuming the email is the first field in the returned data
                        
                                // Now, insert the transaction record with the email
                                const transactionSql = "INSERT INTO transactions (email, phoneNumber, date, type, amount) VALUES (?, ?, ?, ?, ?)";
                                const transactionValues = [email, phoneNumber, transactionDate, transactionType, transactionAmount];
                        
                                db.query(transactionSql, transactionValues, (err, data) => {
                                    if (err) {
                                        console.error('Database error:', err);
                                        return res.status(500).json({ success: false, message: "Error storing transaction record" });
                                    }
                        
                                    // Send message to all connected WebSocket clients (frontend tabs)
                                    wss.clients.forEach(function each(client) {
                                        if (client.readyState === WebSocket.OPEN) {
                                            client.send('Load successful');
                                        }
                                    });
                        
                                    // Optionally, send a response back to the client indicating success
                                    return res.status(200).json({ success: true, message: "Transaction record stored successfully" });
                                });
                            } else {
                                // Handle the case where no email was found for the phone number
                                console.error('No email found for the provided phone number');
                                return res.status(404).json({ success: false, message: "No email found for the provided phone number" });
                            }
                        });
                        
                }
            });
        });
    });
});






app.listen(8081, () => {
    console.log("CONNECTED");
});