
if {
(function()\{
var l = [];
for(var i=0; i<unamemmap[v[0]].length; i++)
    l.push('[ x$\{arch\} = "x' + unamemmap[v[0]][i] + '" ]');
echo(l.join(" || "));
\})()
}
then
{
    for(k in v[1])
        file("osvariant.sh", v[1][k]);
}
fi