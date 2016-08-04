#! /bin/bash

path=/usr/local/ssl/openssl.cnf
if [ ! -f $path ];then
exit 11
fi

if [ ! -d "/usr/local/apache2/bin/tmp" ];then
mkdir -p /usr/local/apache2/bin/tmp
fi

#create CA private key
openssl genrsa -out /usr/local/apache2/bin/tmp/ca.key.pem 1024 -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/ca.key.pem" -a `ls -l /usr/local/apache2/bin/tmp/ca.key.pem | awk '{print $5}'` -eq 0 ];then
exit 1
fi

#create CA req
openssl req -new -key /usr/local/apache2/bin/tmp/ca.key.pem -out /usr/local/apache2/bin/tmp/ca.csr -subj "/C=CN/ST=BEIJING/L=BEIJING/O=Beijing Topsec Network Security Technology Co., Ltd./OU=Engineering Department/CN=TOPSEC WEBUI*" -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/ca.csr" -a `ls -l /usr/local/apache2/bin/tmp/ca.csr | awk '{print $5}'` -eq 0 ];then
exit 2
fi


#create CA cert
openssl x509 -req -days 3650 -extensions v3_ca -signkey /usr/local/apache2/bin/tmp/ca.key.pem -in /usr/local/apache2/bin/tmp/ca.csr -out /usr/local/apache2/bin/tmp/ca.cer

if [ ! -f "/usr/local/apache2/bin/tmp/ca.cer" -a `ls -l /usr/local/apache2/bin/tmp/ca.cer | awk '{print $5}'` -eq 0 ];then
exit 3
fi

#create server key
openssl genrsa -out /usr/local/apache2/bin/tmp/server.key.pem 1024 -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/server.key.pem" -a `ls -l /usr/local/apache2/bin/tmp/server.key.pem | awk '{print $5}'` -eq 0 ];then
exit 4
fi

#create server req
openssl req -new -key /usr/local/apache2/bin/tmp/server.key.pem -out /usr/local/apache2/bin/tmp/server.csr -subj "/C=CN/ST=BEIJING/L=BEIJING/O=Beijing Topsec Network Security Technology Co., Ltd./OU=Engineering Department/CN=TOPSEC WEBUI PRODUCTS" -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/server.csr" -a `ls -l /usr/local/apache2/bin/tmp/server.csr | awk '{print $5}'` -eq 0 ];then
exit 5
fi

#create server cert
openssl x509 -req -days 3650 -extensions v3_req -CA /usr/local/apache2/bin/tmp/ca.cer -CAkey /usr/local/apache2/bin/tmp/ca.key.pem -CAserial /usr/local/apache2/bin/tmp/ca.srl -CAcreateserial -in /usr/local/apache2/bin/tmp/server.csr -out /usr/local/apache2/bin/tmp/server.cer
if [ ! -f "/usr/local/apache2/bin/tmp/server.cer" -a `ls -l /usr/local/apache2/bin/tmp/server.cer | awk '{print $5}'` -eq 0 ];then
exit 6
fi

#create client key
openssl genrsa -out /usr/local/apache2/bin/tmp/client.key.pem 1024 -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/client.key.pem" -a `ls -l /usr/local/apache2/bin/tmp/client.key.pem | awk '{print $5}'` -eq 0 ];then
exit 7
fi

#create client req
openssl req -new -key /usr/local/apache2/bin/tmp/client.key.pem -out /usr/local/apache2/bin/tmp/client.csr -subj "/C=CN/ST=BEIJING/L=BEIJING/O=Beijing Topsec Network Security Technology Co., Ltd./OU=Engineering Department/CN=TOPSEC WEBUI" -config $path

if [ ! -f "/usr/local/apache2/bin/tmp/client.csr"  -a `ls -l /usr/local/apache2/bin/tmp/client.csr | awk '{print $5}'` -eq 0 ];then
exit 8
fi

#create client cert
openssl x509 -req -days 3650 -extensions v3_req -CA /usr/local/apache2/bin/tmp/ca.cer -CAkey /usr/local/apache2/bin/tmp/ca.key.pem -CAserial /usr/local/apache2/bin/tmp/ca.srl -CAcreateserial -in /usr/local/apache2/bin/tmp/client.csr -out /usr/local/apache2/bin/tmp/client.cer
if [ ! -f "/usr/local/apache2/bin/tmp/client.cer" -a `ls -l /usr/local/apache2/bin/tmp/client.cer | awk '{print $5}'` -eq 0 ];then
exit 9
fi

#create client p12
openssl pkcs12 -export -clcerts -inkey /usr/local/apache2/bin/tmp/client.key.pem -in /usr/local/apache2/bin/tmp/client.cer -out /usr/local/apache2/bin/tmp/client.p12 -password pass:talent
if [ ! -f "/usr/local/apache2/bin/tmp/client.p12" -a `ls -l /usr/local/apache2/bin/tmp/client.p12 | awk '{print $5}'` -eq 0 ];then
exit 10
fi

exit 0

