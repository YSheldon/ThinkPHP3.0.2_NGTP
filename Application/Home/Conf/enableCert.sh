#! /bin/bash

if [ ! -f "/usr/local/apache2/bin/tmp/ca.key.pem" -a ! -f "/usr/local/apache2/bin/ca.key.pem" ];then
exit 11
fi

if [ ! -f "/usr/local/apache2/bin/tmp/ca.csr" -a ! -f "/usr/local/apache2/bin/ca.csr" ];then
exit 22
fi

if [ ! -f "/usr/local/apache2/bin/tmp/ca.cer" -a ! -f "/usr/local/apache2/bin/ca.cer" ];then
exit 33
fi

if [ ! -f "/usr/local/apache2/bin/tmp/server.key.pem" -a ! -f "/usr/local/apache2/bin/server.key.pem" ];then
exit 4
fi

if [ ! -f "/usr/local/apache2/bin/tmp/server.csr" -a ! -f "/usr/local/apache2/bin/server.csr" ];then
exit 5
fi

if [ ! -f "/usr/local/apache2/bin/tmp/server.cer" -a ! -f "/usr/local/apache2/bin/server.cer" ];then
exit 6
fi

if [ ! -f "/usr/local/apache2/bin/tmp/client.key.pem" -a ! -f "/usr/local/apache2/bin/client.key.pem" ];then
exit 7
fi

if [ ! -f "/usr/local/apache2/bin/tmp/client.csr" -a ! -f "/usr/local/apache2/bin/client.csr" ];then
exit 8
fi

if [ ! -f "/usr/local/apache2/bin/tmp/client.cer" -a ! -f "/usr/local/apache2/bin/client.cer" ];then
exit 9
fi

cp /usr/local/apache2/bin/tmp/ca.key.pem /usr/local/apache2/bin/ca.key.pem
cp /usr/local/apache2/bin/tmp/ca.csr /usr/local/apache2/bin/ca.csr
cp /usr/local/apache2/bin/tmp/ca.cer /usr/local/apache2/bin/ca.cer
cp /usr/local/apache2/bin/tmp/ca.srl /usr/local/apache2/bin/ca.srl
cp /usr/local/apache2/bin/tmp/server.key.pem /usr/local/apache2/bin/server.key.pem
cp /usr/local/apache2/bin/tmp/server.csr /usr/local/apache2/bin/server.csr
cp /usr/local/apache2/bin/tmp/server.cer /usr/local/apache2/bin/server.cer
cp /usr/local/apache2/bin/tmp/client.key.pem /usr/local/apache2/bin/client.key.pem
cp /usr/local/apache2/bin/tmp/client.csr /usr/local/apache2/bin/client.csr
cp /usr/local/apache2/bin/tmp/client.cer /usr/local/apache2/bin/client.cer

mkdir -p /data/apache2
cp /usr/local/apache2/bin/tmp/ca.key.pem /data/apache2/ca.key.pem
cp /usr/local/apache2/bin/tmp/ca.csr /data/apache2/ca.csr
cp /usr/local/apache2/bin/tmp/ca.cer /data/apache2/ca.cer
cp /usr/local/apache2/bin/tmp/ca.srl /data/apache2/ca.srl
cp /usr/local/apache2/bin/tmp/server.key.pem /data/apache2/server.key.pem
cp /usr/local/apache2/bin/tmp/server.csr /data/apache2/server.csr
cp /usr/local/apache2/bin/tmp/server.cer /data/apache2/server.cer
cp /usr/local/apache2/bin/tmp/client.key.pem /data/apache2/client.key.pem
cp /usr/local/apache2/bin/tmp/client.csr /data/apache2/client.csr
cp /usr/local/apache2/bin/tmp/client.cer /data/apache2/client.cer

rm -rf /usr/local/apache2/bin/tmp/
exit 0