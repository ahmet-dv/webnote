const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const notesDir = path.join(__dirname, 'notes');

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve individual pages (with text box and buttons)
app.get('/page/:pageName', (req, res) => {
    const pageName = req.params.pageName;
    const notePath = path.join(notesDir, `${pageName}.txt`);

    const pageHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageName}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body, html {
                    height: 100%;
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                .buttons {
                    display: flex;
                    justify-content: flex-start;
                    padding: 10px;
                    background-color: #f0f0f0;
                }
                button {
                    padding: 10px 20px;
                    margin-right: 10px;
                    font-size: 16px;
                    cursor: pointer;
                }
                textarea {
                    flex-grow: 1;
                    border: 2px solid gray;
                    padding: 10px;
                    font-size: 16px;
                    width: 100%;
                    resize: none;
                    outline: none;
                    box-sizing: border-box;
                }
            </style>
        </head>
        <body>
            <div class="buttons">
                <button id="editButton" onclick="editNote()">Edit</button>
                <button id="saveButton" onclick="saveNote()">Save</button>
                <button onclick="exportNote()">Export</button>
                <button onclick="window.location.href='/'">Back</button>
            </div>

            <textarea id="notepad" readonly></textarea>
            
            <script>
                fetch('/notes/${pageName}.txt')
                    .then(response => response.text())
                    .then(data => { document.getElementById('notepad').value = data; });

                function editNote() {
                    document.getElementById('notepad').removeAttribute('readonly');
                    document.getElementById('editButton').disabled = true;
                }

                function saveNote() {
                    const note = document.getElementById('notepad').value;
                    fetch('/save/${pageName}', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: note })
                    }).then(() => {
                        document.getElementById('notepad').setAttribute('readonly', 'true');
                        document.getElementById('editButton').disabled = false;
                        alert('Note saved!');
                    });
                }

                function exportNote() {
                    const note = document.getElementById('notepad').value;
                    const blob = new Blob([note], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = '${pageName}.txt';
                    link.click();
                }
            </script>
        </body>
        </html>
    `;
    res.send(pageHtml);
});

// Save notes for a specific page
app.post('/save/:pageName', (req, res) => {
    const { pageName } = req.params;
    const note = req.body.content;
    const notePath = path.join(notesDir, `${pageName}.txt`);

    fs.writeFile(notePath, note, (err) => {
        if (err) {
            return res.status(500).send('Failed to save note');
        }
        res.send('Note saved successfully');
    });
});

module.exports = app;
