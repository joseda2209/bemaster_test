echo CryptPass
if [ $# -gt 0 ];
then
    PASSWORD=$1
else
    echo ingrese la contraseña a encriptar
    read PASSWORD
fi
echo la contraseña encriptada es
node -p "require('crypto').createHash('sha256').update('$PASSWORD').digest('hex')"