

rand=$\{RANDOM+.$\{RANDOM\}\}
logfil=/tmp/.phiw$rand.log

: TODO: configurable
echo "phiwrapper wrapped batsh at shell"

echo "" >>$\{logfil\} || \{
    echo "can't write /tmp things (logfile), exiting" >&2
    exit 1
\}

type mkdir 2>&1 >>$\{logfil\} ||
type chmod 2>&1 >>$\{logfil\} || \{
    echo "mkdir or chmod command not found, cannot extract excutables, exiting" >&2
    exit 1
\}

type uname 2>&1 >>$\{logfil\} && \{
    kernel=`uname -s`
    arch=`uname -m`
\} || \{
    echo "WARN: no uname command found, cannot determine os type, assuming you are using linux at x86_64" >&2
    kernel=Linux
    arch="x86_64"
\}

type [ 2>&1 >>$\{logfil\} || \{
    echo "WARN no [ command found, cannot determine os type, assuming you are using linux at x86_64" >&2
    kernel=Linux
    arch="x86_64"
\}

supported=false
{for(var i in shvars) file("archvariant.sh", [i, shvars[i]]);}

echo dbg: kernel $\{kernel\} supported "$\{supported\}"
[ x$\{supported\} = "xfalse" ] && \{
    echo "this wrapped batsh cannot run at $\{kernel\} on $\{arch\}." >&2
    exit 1
\}

{if(usespliters.length>0) file("spliter.sh")}

if type dd 2>&1 >>$\{logfil\}
then
    ddskip=skip
    echo 1234 | dd bs=1 count=1 skip=1 || ddskip=iseek
    partcp()
    \{
        dd if=$1 of=$2 $ddskip=$3 bs=1 count=$4
        chmod 0755 $2
    \}
{if(usespliters.length>0) file("usespliter.sh")}
else
    echo "cannot extract self: dd and spliter not provided or not usable" >&2
    exit 1
fi

# extract toybox first
phiwtemp=/tmp/.phiw$\{rand\}
#  assume we dont have mkdir -p
mkdir /tmp 2>&1 >>$\{logfil\}
mkdir $\{phiwtemp\} || \{
    echo "cannot create phiwrapper tempdir $\{phiwtemp\}, is another phiwrapper running without \$RANDOM builtin bash variable?" >&2
    exit 1
\}
#  since not exit at above, it's ok no check here
mkdir $\{phiwtemp\}/bin
partcp $0 $\{phiwtemp\}/bin/toybox $\{tboffset\} $\{tbsize\}

# change to phiwtemp
export PATH=$\{phiwtemp\}/bin:$\{PATH\}
batsh=`toybox realpath $0`
cd $phiwtemp || \{
    echo "cannot cd to phiwrapper tempdir $\{phiwtemp\}, that's strange" >&2
    exit 1
\}

# extract unzip
if [ x$\{uzoffset\} != "x" ] && [ x$\{uzsize\} != "x" ]
then
    partcp $\{batsh\} bin/unzip $\{uzoffset\} $\{uzsize\}
fi

# remove spliter if exist
[ x$\{sptmp\} != "x" ] && toybox rm $\{sptmp\}

# extract ps things
unzip $\{batsh\} $\{pspath\}'/*' -d extracting
toybox mkdir -p {echo(config.psTarget)}/
toybox mv extracting/$\{pspath\}/* {echo(config.psTarget)}/

# extract pi things
unzip $\{batsh\} {echo(config.piPath)}'/*' -d extracting
toybox mkdir -p {echo(config.piTarget)}/
toybox mv extracting/{echo(config.piPath)}/* {echo(config.piTarget)}/

$\{cmdline\}

toybox rm $\{logfil\}

# TODO: configurable ask
while [ x$\{answer\} != xy ] && [ x$\{answer\} != xn ]
do
    echo "shall we remove all phiwrapper temp files? [y/n] "
    read answer
done
# fixme: refuse removing important files
[ x$\{answer\} = xy ] && toybox rm -rf .

exit
: << IAMEND
