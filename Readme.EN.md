# phiwrapper

phiwrapper is a tool for wrapping multi-arch/platform binaries into fat "binary".

phiwrapper make same file running at Windows and unix like systems by using batsh. For example: you can pack you PHP codes, Windows PHP binaries downloaded from windows.php.net and static compiled PHP binaries for linux, then double-click packed file on Windows or `sh thatfile.bat` on linux to run same service written in same PHP file at two different platform.

phiwrapper now support Windows 7+ and linux on x86_64 and macOS on x86_64, this support list will be extend in future.

## TODOs && WIPs

- [x] zip.js -- zip.js is WIP, you need pack bins and code dir into build/build.zip youself.
- [ ] cliargs, cleanup, sudo/runas...
- [ ] tests and continuous test
- [ ] x86 unix-like compatibility
- [ ] more platforms
- [ ] shrink unzip size

## Packing

### Dependencies (Windows)

phiwrapper using wsh to run its code, so there's no dependency.

### Dependencies (Unix-like)

nodejs needed.

### Prepare binaries

Fetch binaries tools form github to tools dir:
```
git clone https://github.com/longyan/phiwrapper_binaries tools
```

Prepare platform-specified binaries:

For example : Download Windows PHP binaries from windows.php.net, static compile PHP at linux (If you dont want provide huge glibc together), then put them in bin/win and bin/linuxx64

### Prepare codes

Put platform-independent codes on code dir:

For example : echo '<?php phpinfo();' > code/info.php

### Configure

Copy config.js.example to config.js then modify it as you like, option is explained in that file.

### Pack-up

```batsh
mkwrapper.bat
```
```bash
./mkwrapper.sh
```

## Limitions

phiwrapper simply concatenate files together, it's not native fat binary format like Mach-O, so the packed file will be large, you may want to shrink size of binaries used.

## OSS License

phiwrapper using Apache License 2.0 with exceptions

that meaning you need not append full license into packed binaries.

```
Copyright 2020 Longyan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

As an exception, if, as a result of your packing your files, portions
of this Software are embedded into an partial form of such source code,
you may redistribute such embedded portions in such partial form without
complying with the conditions of Sections 4(a), 4(b) and 4(d) of the License.
```
