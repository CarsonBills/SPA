apt-get update -y
apt-get install -y apache2
a2enmod rewrite
sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/default

#if [ -d '/var/www' ];then
   rm -fr /var/www
   ln -s /vagrant /var/www
#fi

apt-get install -y php5
apt-get install -y php5-curl

# install nfs
apt-get install -y nfs-common portmap

# restart apache2
service apache2 restart
IP=`/sbin/ifconfig eth1 | grep "inet addr" | awk -F: '{print $2}' | awk '{print $1}'`
printf "\n\nVM IP Address: %s\n\n" $IP