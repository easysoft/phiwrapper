
# check if printf oct escape work
if [ x`printf '\061'` = "x1" ]
then
p()
\{
printf $@
\}

z2()
\{
printf '\0\0\0\0'
\}

z3()
\{
printf '\0\0\0\0\0\0\0\0'
\}

z7()
\{
printf '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
printf '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
printf '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
printf '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
\}

z10()
\{
z7;z7;z7;z7;z7;z7;z7;z7
\}

{spliterfiles.map(function(name)\{
    echo(readtext(name))
\});}
else
echo "WARN: printf not work like expected, spliter will be not usable" >&2
fi