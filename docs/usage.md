# Usage
---

## Running Webapp Locally
1. Open a terminal and navigate to /client
2. Run `npm run start`
3. The React app should start-up on designated port and open the web page
4. Open a new terminal and navigate to /server
5. Run `node server.js`
6. Everything should be running locally

## Adding to Documentation
1. Ensure sphinx is installed (`pip install sphinx`)
2. In /docs, edit .md files to add documentation in markdown
3. Save files, run `sphinx-build -b html ./docs/ ./docs/_build/` in root directory to create a preview of docs
4. Commit and push to repo when ready