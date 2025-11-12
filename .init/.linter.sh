#!/bin/bash
cd /home/kavia/workspace/code-generation/thirukural-explorer-223287-223303/thirukural_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

