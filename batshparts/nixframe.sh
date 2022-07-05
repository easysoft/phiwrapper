

test_ts() \{
    dst_file=$1
    src_file=$2
    
    if [ ! -e $\{dst_file\} ];  then
        return 1
    fi

    dst_ts=$(stat -c %Y $\{dst_file\})
    src_ts=$(stat -c %Y $\{src_file\})

    ret=$(($((dst_ts))-$((src_ts))))
    return $\{ret#-\}
\}
modify_ts_as_src_file() \{
    dst_file=$1
    src_file=$2
    
    dst_ts=$(stat -c %Y $\{dst_file\})
    src_ts=$(stat -c %Y $\{src_file\})
    date_fmt="+%Y%m%d%H%M.%S"
    src_date=$(date -d @$\{src_ts\} $\{date_fmt\})

    touch -c -t $\{src_date\} $\{dst_file\}
\}
# extract toybox first
phiwtemp=~/ztool
#  since not exit at above, it's ok no check here
if [ ! -d $\{phiwtemp\} ]; then \
mkdir -p $\{phiwtemp\}
fi

logfil=$\{phiwtemp\}/phiw-$(date +%Y-%m-%d).log

: TODO: configurable
echo "phiwrapper wrapped batsh at shell"

echo "" >>$\{logfil\} || \{
    echo "can't write /tmp things (logfile: $logfil), exiting" >&2
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

#echo dbg: kernel $\{kernel\} supported "$\{supported\}"
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
        modify_ts_as_src_file $2 $1
        chmod 0755 $2
    \}
{if(usespliters.length>0) file("usespliter.sh")}
else
    echo "cannot extract self: dd and spliter not provided or not usable" >&2
    exit 1
fi

bin_toybox=$\{phiwtemp\}/$\{pspath\}toybox
bin_unzip=$\{phiwtemp\}/$\{pspath\}unzip
bin_command=$\{phiwtemp\}/$\{pspath\}$cmdline

if [ ! -d $\{phiwtemp\}/$\{pspath\} ]; then \
mkdir -p $\{phiwtemp\}/$\{pspath\}
fi

# test toybox
test_ts $\{bin_toybox\} $0
ts=$?
if [ $\{ts\} != 0 ]; then
    partcp $0 $\{bin_toybox\} $\{tboffset\} $\{tbsize\}
fi

batsh=`$\{bin_toybox\} realpath $0`
# extract unzip
# test unzip
test_ts $\{bin_unzip\} $0
ts=$?
if [ $\{ts\} != 0 ] && [ x$\{uzoffset\} != "x" ] && [ x$\{uzsize\} != "x" ]
then
    partcp $\{batsh\} $\{bin_unzip\} $\{uzoffset\} $\{uzsize\}
fi

# remove spliter if exist
[ x$\{sptmp\} != "x" ] && $\{bin_toybox\} rm $\{sptmp\}

# extract ps things
# teset ps etc...
test_ts $\{bin_command\} $0
ts=$?
if [ $\{ts\} != 0 ]; then
$\{bin_unzip\} -o $\{batsh\} $\{pspath\}'*' -d $\{phiwtemp\}
modify_ts_as_src_file $\{bin_command\} $0
# extract pi things
$\{bin_unzip\} -o $\{batsh\} {echo(config.piPath)}'*' -d $\{phiwtemp\}
fi
# make exec mode
$\{bin_toybox\} chmod 0755 $\{phiwtemp\}/$\{pspath\}/*

eval $\{phiwtemp\}/$\{pspath\}$cmdline

$\{bin_toybox\} rm $\{logfil\}

exit
: << IAMEND
