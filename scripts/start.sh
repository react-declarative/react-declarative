#!/usr/bin/env bash
npm install
npm run build
cd demo
npm install
npm run cleanup
npm start
