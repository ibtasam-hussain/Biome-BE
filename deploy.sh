#!/bin/bash

# PASSWORD : q&/65FMFJE'Vnu@H7V8H

# === SSH CONFIG ===
SSH_USER="root"
SSH_HOST="72.60.175.234"
REMOTE_DIR="/var/www/biome/BE/"

echo "🧹 Cleaning up local node_modules and lock file..."
rm -rf node_modules
rm -f package-lock.json

echo "🚀 Uploading backend files to $SSH_HOST:$REMOTE_DIR..."
scp -r ./* $SSH_USER@$SSH_HOST:$REMOTE_DIR

echo "🔐 Logging into server to deploy frontend..."
ssh -t $SSH_USER@$SSH_HOST <<EOF
cd $REMOTE_DIR

echo "📦 Installing frontend dependencies..."
npm install 

echo "🔁 Restarting PM2 process ID 8 ..."
pm2 restart 20
pm2 save
EOF

echo "✅ Deployment completed!"
read -p "Press Enter to exit..."
