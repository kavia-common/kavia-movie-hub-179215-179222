#!/bin/bash
cd /home/kavia/workspace/code-generation/kavia-movie-hub-179215-179222/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

