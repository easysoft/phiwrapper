elif type elf0x64 2>&1 >>$logfil
then
    sptmp=/tmp/.phiw$\{rand\}.spliter
    {
        echo(usespliters.map(function(item)\{
            var s = '[ "x' + item.unames + '" = x$\{kernel\} ] && ';
            //println(item.unamem)
            s += '\{ ' + item.unamem.map(function(it)\{
                return '[ "x' + it +'" = x$\{arch\} ]'
            \}).join(" || ") + ' ; \}';
            s += ' && ' + item.funcname + ' > $sptmp';
            return s;
        \}).join('\n'));
    }
    [ -f $sptmp ] && \{
        chmod 0755 $sptmp
        partcp()
        \{
            $sptmp linu $@
        \}
    \}