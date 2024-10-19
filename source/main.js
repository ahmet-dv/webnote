const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const notesDir = path.join(__dirname, 'notes');

// Middleware to handle JSON and static files (if any)
app.use(express.json());
app.use(express.static(__dirname));

// Main route for displaying the list of notes
app.get('/', (req, res) => {
    fs.readdir(notesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error loading pages');
        }
        const pageLinks = files.map(file => {
            const pageName = path.basename(file, '.txt');
            return `
                <div class="page-item">
                    <a href="/page/${pageName}" target="_blank">${pageName}</a>
                    <div class="actions">
                        <button onclick="renamePage('${pageName}')">Rename</button>
                        <button onclick="confirmDelete('${pageName}')">Delete</button>
                    </div>
                </div>`;
        }).join('');

        const mainPageHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Notepad - Main Page</title>
                <style>
                    body {
                        background-color: black;
                        color: white;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start; /* Aligns content to the top */
                        align-items: flex-start;   /* Aligns content to the left */
                    }
                    .add-page {
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                    }
                    .add-page input {
                        height: 40px; /* Matches button height */
                        font-size: 16px;
                        padding: 0 10px;
                        margin-right: 10px;
                    }
                    .add-page button {
                        height: 40px;
                        padding: 0 15px;
                        font-size: 16px;
                        cursor: pointer;
                    }
                    .page-list {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        width: 60%;
                    }
                    .page-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background-color: #444;
                        border-radius: 10px;
                        width: 100%;
                    }
                    .page-item a {
                        color: white;
                        text-decoration: none;
                        font-weight: bold;
                        flex-grow: 1;
                    }
                    .actions {
                        display: flex;
                        gap: 10px; /* Ensures buttons are next to each other */
                    }
                    button {
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 10px;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                    button:hover {
                        background-color: #d32f2f;
                    }
                </style>
            </head>
            <body>
                <div class="add-page">
                    <input type="text" id="newPageName" placeholder="New Page Name" />
                    <button onclick="addPage()">Add Page</button>
                </div>
                <div class="page-list">
                    ${pageLinks}
                </div>

                <script>
                    function addPage() {
                        const pageName = document.getElementById('newPageName').value;
                        if (pageName) {
                            fetch('/addPage', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pageName })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error adding page');
                                }
                                return response.text();
                            })
                            .then(() => window.location.reload())
                            .catch(error => console.error(error));
                        }
                    }

                    function confirmDelete(pageName) {
                        const confirmed = confirm("Are you sure you want to delete this page?");
                        if (confirmed) {
                            removePage(pageName);
                        }
                    }

                    function removePage(pageName) {
                        fetch('/removePage/' + pageName, { method: 'DELETE' })
                            .then(() => window.location.reload())
                            .catch(error => console.error('Error:', error));
                    }

                    function renamePage(pageName) {
                        const newName = prompt("Enter new name for the page:", pageName);
                        if (newName && newName !== pageName) {
                            fetch('/renamePage', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ oldName: pageName, newName: newName })
                            })
                            .then(() => window.location.reload())
                            .catch(error => console.error('Error:', error));
                        }
                    }
                </script>
            </body>
            </html>
        `;
        res.send(mainPageHtml);
    });
});

// Add a new page route
app.post('/addPage', (req, res) => {
    const { pageName } = req.body;
    const filePath = path.join(notesDir, `${pageName}.txt`);

    fs.writeFile(filePath, '', (err) => {
        if (err) {
            return res.status(500).send('Error creating page');
        }
        res.send('Page created');
    });
});

// Delete a page route
app.delete('/removePage/:pageName', (req, res) => {
    const pageName = req.params.pageName;
    const filePath = path.join(notesDir, `${pageName}.txt`);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).send('Error deleting page');
        }
        res.send('Page deleted');
    });
});

// Rename a page route
app.post('/renamePage', (req, res) => {
    const { oldName, newName } = req.body;
    const oldPath = path.join(notesDir, `${oldName}.txt`);
    const newPath = path.join(notesDir, `${newName}.txt`);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).send('Error renaming page');
        }
        res.send('Page renamed');
    });
});

// Export the app instance
module.exports = app;
