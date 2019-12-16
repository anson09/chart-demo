#!/usr/bin/env bash
set -eu

. ./scripts/loadenv.sh
echo '<< sync info >>'
echo 'HOST: '$HOST
echo 'SSH_PORT:' $SSH_PORT
echo 'REMOTE_USER: '$REMOTE_USER
echo 'REMOTE_PATH: '$REMOTE_PATH
echo ''

time rsync -rvzh --stats --delete -e "ssh -p $SSH_PORT" dist/ $REMOTE_USER@$HOST:$REMOTE_PATH
