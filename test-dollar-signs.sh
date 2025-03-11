#!/bin/bash

# This script helps test the dollar sign handling in the Google Charts API replacement

echo "Starting the server..."
node server.js &
SERVER_PID=$!

# Wait for the server to start
sleep 2

echo "Opening test page in browser..."
xdg-open http://localhost:3000/test-dollar.html

echo "Press Ctrl+C to stop the server"
trap "kill $SERVER_PID; echo 'Server stopped'; exit 0" INT
wait $SERVER_PID
