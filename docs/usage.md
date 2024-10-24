# Usage
---

## Running Webapp Locally Using React
1. Open a terminal and navigate to /client
2. Run `npm run start`
3. The React app should start-up on designated port and open the web page
4. Open a new terminal and navigate to /server
5. Inside server.js, add database credentials in pool variable (credentials found in discord)
6. Run `node server.js`
7. Everything should be running locally, access webpage locally through React specified port

## Running Webapp Locally Using Static Resources
1. Open a terminal and navigate to /client
2. Run `npm run build`
3. The build folder should contain the React build, copy this folder into the /server folder
4. Navigate to /server in the terminal
5. Run `node server.js`
6. Everything should be running locally, access webpage locally through webserver specified port

## Adding to Documentation
1. Ensure sphinx is installed (`pip install sphinx`)
2. In /docs, edit .md files to add documentation in markdown
3. Save files, run `sphinx-build -b html ./docs/ ./docs/_build/` (if that fails try `python -m sphinx.cmd.build ./docs/ ./docs/_buid`) in root directory to create a preview of docs
4. Commit and push to repo when ready