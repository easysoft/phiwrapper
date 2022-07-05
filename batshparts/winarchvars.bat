if ($arch -eq \"{echo(v.archname)}\") \{ ^
    $uzoffset={batshoffset(v.uzoffset)}; ^
    $uzsize={echo(v.uzsize)}; ^
    $cmdline=\"{echo(v.cmdline)}\"; ^
    $pspath=\"{echo(v.pspath)}\"; ^
    $winpspath=\"{echo(v.pspath.replace("/", "\\"))}\"; ^
    $archsupport=$true; ^
\}