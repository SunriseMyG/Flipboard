const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

//   _____  ______ _____ _____  _____ _______ ______ _____
//  |  __ \|  ____/ ____|_   _|/ ____|__   __|  ____|  __ \
//  | |__) | |__ | |  __  | | | (___    | |  | |__  | |__) |
//  |  _  /|  __|| | |_ | | |  \___ \   | |  |  __| |  _  /
//  | | \ \| |___| |__| |_| |_ ____) |  | |  | |____| | \ \
//  |_|  \_\______\_____|_____|_____/   |_|  |______|_|  \_\

// route to register a user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    const username = email.split('@')[0];

    try {
        db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la requête SQL: ' + err.stack);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
            if (results.length > 0) {
                return res.status(409).json({ message: 'Email déjà utilisé' });
            }
            const creationDate = new Date();
            db.query('INSERT INTO user (email, password, username, created_at) VALUES (?, ?, ?, ?)', [email, password, username, creationDate], (insertErr) => {
                if (insertErr) {
                    console.error('Erreur lors de l\'insertion de l\'utilisateur: ' + insertErr.stack);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }
                res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

//   _      ____   _____ _____ _   _ 
//  | |    / __ \ / ____|_   _| \ | |
//  | |   | |  | | |  __  | | |  \| |
//  | |   | |  | | | |_ | | | | . ` |
//  | |___| |__| | |__| |_| |_| |\  |
//  |______\____/ \_____|_____|_| \_|


// route to register a user and login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    try {
        console.log('Login attempt with:', { email, password });

        db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la requête SQL: ' + err.stack);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
            if (results.length === 0) {
                console.log('No user found with email:', email);
                return res.status(401).json({ message: 'Email ou mot de passe invalide' });
            }

            const user = results[0];

            if (password !== user.password) {
                console.log('Invalid password for email:', email);
                return res.status(401).json({ message: 'Email ou mot de passe invalide' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            return res.json({ accessToken: token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

//   _    _  _____ ______ _____  
//  | |  | |/ ____|  ____|  __ \ 
//  | |  | | (___ | |__  | |__) |
//  | |  | |\___ \|  __| |  _  / 
//  | |__| |____) | |____| | \ \ 
//   \____/|_____/|______|_|  \_\                        


// route to get all users using SQL query
router.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs: ' + err.stack);
            return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
        res.json(results);
    });
});

// route to get userid by email
router.get('/users/:email', (req, res) => {
    const email = req.params.email;
    db.query('SELECT id FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur: ' + err.stack);
            return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
        }
        res.json(results);
    });
});

//   ______ __      ______  _____  _____ _______ ______  _____
//  |  ____/\ \    / / __ \|  __ \|_   _|__   __|  ____|/ ____|
//  | |__ /  \ \  / / |  | | |__) | | |    | |  | |__  | (___
//  |  __/ /\ \ \/ /| |  | |  _  /  | |    | |  |  __|  \___ \
//  | | / ____ \  / | |__| | | \ \ _| |_   | |  | |____ ____) |
//  |_|/_/    \_\/   \____/|_|  \_\_____|  |_|  |______|_____/

// route to add a favorite article
router.post('/favorites/:userId', (req, res) => {
    const userId = req.params.userId;
    const { author, title, description, content, url, urlToImage, published_at } = req.body;

    const query = `
        INSERT INTO favorite (user_id, author, title, description, content, url, urlToImage, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, author, title, description, content, url, urlToImage, published_at], (err, result) => {
        if (err) {
            console.error('Error inserting favorite:', err);
            return res.status(500).json({ error: 'Failed to add favorite' });
        }
        res.status(201).json({ message: 'Favorite added successfully', favoriteId: result.insertId });
    });
});

// route to get all favorites for a user
router.get('/favorites/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT * FROM favorite WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorites:', err);
            return res.status(500).json({ error: 'Failed to fetch favorites' });
        }
        res.status(200).json(results);
    });
});

// route to delete a favorite article
router.post('/favorites/:userId/delete', (req, res) => {
    const userId = req.params.userId;
    const { favoriteId } = req.body;

    const query = `
        DELETE FROM favorite WHERE user_id = ? AND id = ?
    `;

    db.query(query, [userId, favoriteId], (err) => {
        if (err) {
            console.error('Error deleting favorite:', err);
            return res.status(500).json({ error: 'Failed to delete favorite' });
        }
        res.status(200).json({ message: 'Favorite deleted successfully' });
    });
});

module.exports = router;