
# check if printf oct escape work
if [ x"`printf '\062'`" = "x1" ]
then
p()
\{
printf $@
\}

elf0()
\{
printf '\177ELF\002\001\001\000'
\}

elf8()
\{
printf '\177ELF\002\001\001\008'
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

{usespliters.map(function(name)\{
    echo(readtext(name))
\});}
else
echo "WARN: printf not work like expected, spliter will be not usable" >&2
fi