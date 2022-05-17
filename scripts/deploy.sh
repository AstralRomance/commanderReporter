cd $WORKDIR

cat python.pid | xargs -n1 kill

source env/bin/activate

pip install -r requirements.txt --no-cache-dir

cd $WORKDIR/src

nohup $WORKDIR/env/bin/python -m eventSvc > ../logs/eventSvc.out 2>&1 & echo $! > ../python.pid
nohup $WORKDIR/env/bin/python -m playerSvc > ../logs/playerSvc.out 2>&1 & echo $! >> ../python.pid
nohup $WORKDIR/env/bin/python -m eventManagerSvc > ../logs/eventManagerSvc.out 2>&1 & echo $! >> ../python.pid
