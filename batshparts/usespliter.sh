elif type elf8 2>&1 >>$logfil
then
    $sptmp=/tmp/.phiw${rand}.spliter
    if [ "xLinux" = "x$kernel" ]
    then
        elf0 > $sptmp
        chmod 0755 $sptmp
        partcp()
        {
            $sptmp linu $@
        }
    elif [ "xFreeBSD" = "x$kernel" ]
    then
        elf8 > $sptmp
        chmod 0755 $sptmp
        partcp()
        {
            $sptmp fbsd $@
        }
    elif [ "xDarwin" = "x$kernel" ]
    then
        darwin > $sptmp
        chmod 0755 $sptmp
        partcp()
        {
            $sptmp $@
        }
    fi