/*
phiwrapper template.js
simple (shabby) template for generate batsh

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

(function (){
    function flatten(arr){
        var ret = "";
        for(var i = 0; i < arr.length; i++){
            if(typeof arr[i] !== "string"){
                switch(arr[i][0]){
                    case "lbrace":
                        ret += "{";
                        break;
                    case "rbrace":
                        ret += "}";
                        break;
                    case "endeval":
                    case "eval":
                        println("nested eval is not supported")
                        return;
                    default:
                        println("???")
                        return;
                }
            }else{
                ret += arr[i];
            }
        }
        return ret;
    }
    function trim(str){
        return str
            .replace(/\r\n(REM|#)[^\r]+/g,"\r\n")
            .replace(/\n#[^\n]+/g,"\n")
            .replace(/(\r\n){2,}/g, "\r\n")
            .replace(/\n{2,}/g, "\n");
    }
    function process (text, v){
        // split text into text/placeholders
        //println("processing "+ text);

        // we cant use backward regex things like /(?<=...)/ at wsh
        // capture marks "/()/" at wsh was also not working
        // so here's some dirty works

        var dict = [
            { tok: "\\{" , o:["lbrace"]},
            { tok: "\\}" , o:["rbrace"]},
            { tok: "{" , o:["eval"]},
            { tok: "}" , o:["endeval"]}
        ];
        var array = [trim(text)];

        for(var ti=0; ti<dict.length; ti++){
            var tok = dict[ti];
            for (var i = 0; i < array.length; i++){
                if(typeof array[i] == "string"){
                    // split string with token pattern
                    var arrayi = array[i].split(tok.tok);
                    // if on pattern found, skip
                    if(arrayi.length === 1){
                        continue;
                    }
                    // remove original string
                    array.splice(i,1);
                    for (var j = arrayi.length-1;j >= 0; ) {
                        //println("add", arrayi[j]);
                        array.splice(i, 0, arrayi[j]);
                        if(--j >=0){
                            array.splice(i, 0, tok.o);
                        }
                    }
                }
            }
            //println(array);
        }
        //println(array);
        
        for (var i=0; i<array.length; i++){
            if (array[i][0] == "eval"){
                for(var j = 0;
                    j<array.length-i && array[i+j][0] !== "endeval";
                    j++);
                if(j === array.length-i){
                    println("unexpected eof");
                    return ;
                }
                var str = flatten(array.slice(i+1,i+j))
                array.splice(i,j+1,["evalstr", str]);
            }else if (array[i][0] == "endeval"){
                println("bad brace match");
                return ;
            }else{
                for(var j = 0;
                    j<array.length-i && array[i+j][0] !== "eval";
                    j++);
                var str = flatten(array.slice(i,i+j));
                array.splice(i,j,["echo", str]);
            }
        }
        //println(array)

        var textparts = [];
        // functions for template use
        function echo(obj){
            //println("echo", obj)
            if(typeof obj == "object" && obj instanceof Array){
                //println("concat", obj)
                textparts.concat(obj);
            }else{
                if(typeof textparts[textparts.length-1] == "string"){
                    //println(textparts[textparts.length-1])
                    //println("appending", obj)
                    textparts[textparts.length-1] += obj.toString();
                }else{
                    textparts.push(obj);
                }
            }
            
        }
        function file(fn, v){
            textparts = textparts.concat(process(readtext("batshparts/"+fn), v));
        }
        function rawfile(fn){
            echo(readtext("batshparts/"+fn));
        }
        function trawfile(fn){
            echo(trim(readtext("batshparts/"+fn)));
        }
        function batshoffset(o){
            textparts.push(["placeholder", o || 0]);
        }

        // strange var domain on wsh, so use ___i
        for (var ___i=0; ___i<array.length; ___i++){
            switch(array[___i][0]){
                case "echo":
                    //println("appendstr", array[___i][1]);
                    echo(array[___i][1])
                    break;
                case "evalstr":
                    // /println("eval", array[___i][1]);
                    // eval is evil, so am I
                    eval(array[___i][1]);
                    break;
                case "endeval":
                    break;
                default:
                    println("bad template: no " + array[___i][0] + " here");
                    throw "bad template";
            }
        }

        //println(textparts)
        return textparts;
    }
    function processbatsh(data){
        // fix placeholders
        var textparts = process(data);
        //println(textparts)

        var textsize = 0;
        var placeholders = [];
        textparts.map(function(e){
            //println(typeof textparts[i])
            if(typeof e == "string"){
                textsize += e.length;
            }else{
                placeholders.push(e);
            }
        });

        //println(placeholders, textsize);

        // calc size
        var fakesize = textsize;

        for(var addsize = 1 ;textsize+addsize != fakesize && fakesize < 1048576; fakesize = textsize+addsize){
            addsize = 0;
            //println("assume fake is", fakesize);
            placeholders.map(function(e){
                addsize += (e[1] + fakesize).toString(10).length;
            });
            //println("real is", textsize+addsize);
        }

        var str = "";
        textparts.map(function(e){
            if(typeof e == "string"){
                str+=e;
            }else{
                str+=(e[1]+fakesize).toString(10);
            }
        });

        //println(str)
        if(str.length != fakesize){
            throw "error on size calc";
        }
        //println(sizestr);
        return str;
    }
    return {
        "processbatsh" : processbatsh
    };
}())

