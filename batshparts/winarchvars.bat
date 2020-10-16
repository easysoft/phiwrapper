IF %arch%=={echo(v.archname)} (
    SET "uzoffset={batshoffset(v.uzoffset)}"
    SET "uzsize={echo(v.uzsize)}"
    SET "cmdline={echo(v.cmdline)}"
    SET "pspath={echo(v.pspath)}"
    SET "winpspath={echo(v.pspath.replace("/", "\\"))}"
    SET "archsupport=ok"
)
