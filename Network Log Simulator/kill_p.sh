ps -axo pid,etime,command | grep Server.js | while read -r pid etime cmd ; do
    echo "Killing pid: $pid, cmd: $cmd"
    kill -9 $pid
done