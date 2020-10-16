
if [ "x{echo(v.unames)}" = "x$kernel" ]
then
tboffset="{if(v.tboffset) batshoffset(v.tboffset)}"
tbsize="{echo(v.tbsize || "")}"
uzoffset="{if(v.uzoffset) batshoffset(v.uzoffset)}"
uzsize="{echo(v.uzsize || "")}"
pspath="{echo(v.pspath)}"
cmdline="{echo(v.cmdline)}"
supported=1
fi
