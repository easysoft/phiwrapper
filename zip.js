/*
phiwrapper zip.js
zip packing lib

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
    function wshzip(dest, dlist){
        println("wsh: creating zip archive");
        // TODO: -9 -> modifiable
        // TODO: arch-specific
        var cmd = ".\\tools\\zip.x86.exe -9 " + dest + " " + dlist.join(" ");
        try{
            exec(cmd);
        }catch(e){
            if (e.number == -2147024894){
                println("no zip binary found, skipping zip");
                return;
            }else{
                println("failed to execute " + cmd +", skiping");
                //println(e);
                return;
            }
        }
    }
    function nodezip(dest, dlist){
        var binname, cmd;
        println("node: creating zip archive");
        switch(os.platform()){
            case "win32":
                binname = "zip.x86.exe";
                break;
            case "linux":
                switch(os.arch()){
                    case "x64":
                        binname = "zip.x64.linux";
                        break;
                }
                break;
        }
        // TODO: -9 -> modifiable
        println(binname);
        if(!binname){
            println("this platform is not supported, trying \"zip\" command");
            cmd = "zip -9 " + dest + " " + dlist.join(" ");
        }else{
            cmd = "." + path.sep + "tools" + path.sep + binname + " -9 " + dest + " " + dlist.join(" ");
        }
        
        try{
            exec(cmd);
        }catch(e){
            println("failed to execute " + cmd +", skiping");
            //println(e);
        }
    }
    if("wsh" == runtime){
        return {
            "zip" : wshzip
        };
    }else{
        return {
            "zip" : nodezip
        };
    }
}())
