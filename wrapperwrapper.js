/*
phiwrapper wrapperwrapper
used to generate a batsh wrapper

Copyright 2020 Longyan
Copyright 2020 Yun Dou(dixyes)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var println, runtime, readtext, filesize, writetext, listdir, concat, exec;

if(typeof WScript !== 'undefined'){
    runtime = "wsh";
    var fso = WScript.CreateObject("Scripting.FileSystemObject");
    var WshShell = WScript.CreateObject("WScript.Shell");
    function printobj(o, indent){
        switch (typeof o){
            case "string":
                WScript.StdOut.Write(o);
                break;
            case "undefined":
                WScript.StdOut.Write("undefined");
                break;
            case "function":
            case "number":
            case "boolean":
                WScript.StdOut.Write(o.toString());
                break;
            case "object":
                switch (true){
                    case o instanceof String:
                        WScript.StdOut.Write(o);
                        break
                    case o instanceof RegExp:
                        WScript.StdOut.Write("/"+o.source+"/"+(o.flags || ""));
                        break
                    case o === null:
                        WScript.StdOut.Write('null');
                        break
                    case o instanceof Array:
                        WScript.StdOut.Write(indent + '[\n');
                        for(var j=0; j<o.length; j++){
                            WScript.StdOut.Write(indent + "  ");
                            printobj(o[j], indent + "  ");
                            if(j<o.length-1){
                                WScript.StdOut.Write(',');
                            }
                            WScript.StdOut.Write('\n');
                        }
                        WScript.StdOut.Write(indent + ']');
                        break;
                    default:
                        WScript.StdOut.Write(indent + '{\n');
                        
                        var l = [];
                        for(var k in o){
                            l.push(k);
                        }

                        for(var j=0; j<l.length; j++){
                            WScript.StdOut.Write(indent + "  ");
                            printobj(l[j], indent + "  ");
                            WScript.StdOut.Write(": ");
                            printobj(o[l[j]], indent + "  ");
                            if(j<l.length-1){
                                WScript.StdOut.Write(',');
                            }
                            WScript.StdOut.Write("\n");
                        }
                        WScript.StdOut.Write(indent + '}');
                }
                break;
        }
    }
    println=function(){
        for(var argi=0; argi < arguments.length; argi++){
            printobj(arguments[argi], "");
            WScript.StdOut.Write(" ");
        }
        WScript.StdOut.WriteBlankLines(1);
    };
    readtext = function(fn){
        var f = fso.OpenTextFile(fn, 1/* ForReading */)
        var s = f.ReadAll();
        f.Close();
        return s;
    };
    filesize = function(fn){
        try{
            return fso.GetFile(fn).Size;
        }catch(e){
            return -1;
        }
    };
    writetext = function(fn, str){
        fso.CreateTextFile(fn);
        var f = fso.OpenTextFile(fn, 2/* ForWriting */)
        f.Write(str);
        f.Close();
    };
    listdir = function(path){
        var ret = [];
        var files = fso.GetFolder(path).Files;
        for(var file= new Enumerator(files); !file.atEnd(); file.moveNext()){
            ret.push(file.item().Name);
        }
        return ret;
    };

    exec = function(cmd){
        var ret = WshShell.Exec(cmd);
        while (ret.Status == 0){
            WScript.Sleep(100);
        }
        return ret;
    }

    concat = function(files, dest){
        println("concatenating batsh and bins");
        try{
            exec("CMD /C COPY /b " + (files.join(" + ") + " " + dest).replace(/\//g,"\\"));
        }catch(e){
            println("concat failed");
            println("COPY /b " + (files.join(" + ") + " " + dest).replace(/\//g,"\\"))
            println(e)
        }
        println(dest + " generated");
    }

    // shabby polyfills and shims
    String.prototype.endsWith = function(s) {
        return s == "" || this.indexOf(s) == this.length - s.length;
    };
    String.prototype.startsWith = function(s) {
        return s == "" || this.indexOf(s) == 0;
    };
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }

    // from MDN https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map, without commits
    Array.prototype.map = function(callback/*, thisArg*/) {
        var T, A, k;
        if (this == null) {
          throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
          T = arguments[1];
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
          var kValue, mappedValue;
          if (k in O) {
            kValue = O[k];
            mappedValue = callback.call(T, kValue, k, O);
            A[k] = mappedValue;
          }
          k++;
        }
        return A;
    };
    // TODO: refactor fors into map to make codes more readable
    
    // from MDN: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

            var result = [];

            for (var prop in obj) {
            if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }

            if (hasDontEnumBug) {
            for (var i=0; i < dontEnumsLength; i++) {
                if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
            }
            }
            return result;
        }
    })();

}else if(typeof module !== 'undefined' && module.exports){
    var fs=require("fs");
    var child_process = require("child_process");
    var os = require("os");
    var path = require("path");
    runtime = "node";
    println=console.log;
    readtext = function(fn){
        return fs.readFileSync(fn, {encoding:"utf8"});
    }
    writetext = function(fn, str){
        return fs.writeFileSync(fn, str, {encoding:"utf8"});
    }
    listdir = fs.readdirSync;
    filesize = function(fn){
        try{
            return fs.statSync(fn).size;
        }catch(e){
            return -1;
        }
    };
    exec = child_process.execSync;
    concat = function(files, dest){
        println("concatenating batsh and bins");
        var destf = fs.openSync(dest, "w", 493/*0o755*/);
        files.map(function(item){
            fs.writeSync(destf, fs.readFileSync(item));
        });
        fs.closeSync(destf);
        println(dest + " generated");
    };
}else{
    // yet only wsh or node
    throw "not supported environment";
}

// minimal "import" implementation
var include = function(fn){
    //println("eval", fn)
    return eval(readtext(fn));
}

println("start wrapper generation with " + runtime);

var config = include("config.js");
var template = include("template.js");
var zip = include("zip.js");

// make packing infomations and pass it by global vars.

// find out which binaries we have
var bininfo = {};
var toolsfiles = listdir("tools");
for(var i=0; i< toolsfiles.length; i++){
    var fn = toolsfiles[i].toString();
    if (fn.endsWith(".exe") || fn.endsWith(".linux") || fn.endsWith(".darwin") || fn.endsWith(".fbsd")){
        bininfo[fn] = {
            size: filesize("tools/" + fn)
        };
    }
}

// mapping things
var winvarsmap = {
    "win_x86":{archname:"x86", uzfile:"unzip.x86.exe"},
    "win_x86_64":{archname:"AMD64", uzfile:"unzip.x86.exe"},
    "win_arm":{archname:"ARM", uzfile:"unzip.arm.exe"},
    "win_arm64":{archname:"ARM64", uzfile:"unzip.arm64.exe"}
};
var shvarsmap = {
    "linux": {
        unames:"Linux",
        archfiles:{
            "x86_64": {
                unzip: "unzip.x64.linux",
                toybox: "toybox.x64.linux"
            },
            "arm64": {
                unzip:"unzip.arm64.linux",
                toybox:"toybox.arm64.linux"
            }
        }
    },
    "darwin": {
        unames:"Darwin",
        archfiles:{
            "arm64": {
                toybox:"toybox.arm64.darwin"
            },
            "x86_64": {
                toybox:"toybox.x86s.darwin"
            },
            "x86": {
                toybox:"toybox.x86s.darwin"
            }
        }
    },
    "fbsd": {
        unames:"FreeBSD",
        archfiles:{
            "x86_64": {
                unzip: "unzip.x64.fbsd",
                toybox: "toybox.x64.fbsd"
            }
        }
    }
};

var winvars = [];
var shvars = {};

// bins used array
var binused = [];
var offset = 0;

// check windows ps variants
for (var k in winvarsmap){
    if(config.psPaths[k] && // ps bin provided
        bininfo[winvarsmap[k].uzfile] ){ // unzip bin provided
        if (binused.indexOf(winvarsmap[k].uzfile) === -1){ // unique
            // add to binused
            binused.push(winvarsmap[k].uzfile);
            // update offset
            bininfo[winvarsmap[k].uzfile].offset = offset;
            offset+=bininfo[winvarsmap[k].uzfile].size;
        }
        winvars.push({
            archname: winvarsmap[k].archname,
            cmdline: config.command[k] || config.command.win_,
            uzoffset: bininfo[winvarsmap[k].uzfile].offset,
            uzsize: bininfo[winvarsmap[k].uzfile].size,
            pspath: config.psPaths[k]
        });
    }
}

// map uname -m var to our name
var unamemmap = {
    "x86_64": ["amd64", "x86_64"],
    "arm64": ["aarch64", "arm64"],
    "x86": ["`echo $arch | ./bin/toybox grep -o 'i[3-6]86'`"] // fixme: use full map
}

// check unix ps variants
for (var sk in shvarsmap){
    for (var ak in shvarsmap[sk].archfiles){
        var binsok = true;
        // check if we have all uz+tb bins
        for(var akfn in shvarsmap[sk].archfiles[ak]){
            if(! bininfo[shvarsmap[sk].archfiles[ak][akfn]]){
                binsok = false;
                break;
            }
        }
        if(config.psPaths[sk + "_" + ak] && // ps bin provided
            binsok ){// uz+tb bins provided
            if(binused.indexOf(winvarsmap[k].uzfile) === -1){ // unique
                // add all uz+tb bins
                for(var akfn in shvarsmap[sk].archfiles[ak]){
                    println("add",akfn,"for",sk,ak);
                    // add to binused
                    binused.push(shvarsmap[sk].archfiles[ak][akfn]);
                    // update offset
                    bininfo[shvarsmap[sk].archfiles[ak][akfn]].offset = offset;
                    offset+=bininfo[shvarsmap[sk].archfiles[ak][akfn]].size;
                }
            }

            var tbinfo = bininfo[shvarsmap[sk].archfiles[ak].toybox];
            var uzinfo = bininfo[shvarsmap[sk].archfiles[ak].unzip];

            if (!shvars[ak]){
                shvars[ak] = {};
            }
            shvars[ak][sk] ={
                tboffset: tbinfo && tbinfo.offset,
                tbsize: tbinfo && tbinfo.size,
                uzoffset: uzinfo && uzinfo.offset,
                uzsize: uzinfo && uzinfo.size,
                unames: shvarsmap[sk].unames,
                pspath: config.psPaths[sk + "_" + ak] ||
                    onfig.psPaths[sk + "_"] || "",
                cmdline: config.command[sk + "_" + ak] || 
                    config.command[sk + "_"] ||
                    config.command.unixlike_
            };
        }
    }
}

var splitermap = [
    /* arch, os, tools/spliter.?.sh, funcname */
    ["x86_64", "linux", "elfx64", "elf0x64"],
    ["x86_64", "fbsd", "elfx64", "elf9x64"],
    ["arm64", "fbsd", "elfaa64", "elf9aa64"],
    ["arm64", "linux", "elfaa64", "elf0aa64"],
    ["x86_64", "darwin", "darwin", "darwin"]
];
var spliterfiles = [];
var usespliters = [];

splitermap.map(function(sv){
    if ( shvars[sv[0]] && shvars[sv[0]][sv[1]] &&
        filesize("tools/spliter." + sv[2] + ".sh") >0 ){
        usespliters.push({
            unames: shvarsmap[sv[1]].unames,
            unamem: unamemmap[sv[0]],
            funcname: sv[3]
        });
        if(!(usespliters.indexOf("tools/spliter." + sv[2] + ".sh") >0)){
            println("use","tools/spliter." + sv[2] + ".sh");
            spliterfiles.push("tools/spliter." + sv[2] + ".sh");
        }
    }
});

//println(binused);
//println(bininfo);
//println(winvars);
//println(shvars);

// start generation.
var str = template.processbatsh(readtext("batshparts/frame.batsh"));
writetext("build/wrapper.batsh", str);

zip.zip("build/build.zip",
    Object.keys(config.psPaths)
        .map(function(x){return config.psPaths[x] + "/*";})
        .concat([config.piPath + "/*"])
);
writetext("build/heredoctail", "\nIAMEND\n"); // TODO: changable

var filelist = ["build/wrapper.batsh"]
    .concat(binused.map(function(x){return "tools/"+x;}))
    .concat(["build/build.zip"])
    .concat(["build/heredoctail"]);
concat(filelist, "build/wrapped.bat");
