# phiwrapper

phiwrapper是一个用于打包胖“二进制”的工具

phiwrapper可以通过batsh使得同一文件包含不同平台的二进制，可以在不同平台运行：例如，使用phiwrapper打包Windows的PHP PE二进制和，linux的ELF二进制以及php代码，在Windows下可以双击运行file.bat文件开启服务，linux下可以用`sh ./file.bat`运行相同的PHP代码

目前phiwrapper支持Windows 7+和x86_64的linux、macOS系统

## TODOs && WIPs

- [ ] 支持命令行参数、完整的清理、提升权限...
- [ ] 测试和自动化测试
- [ ] x86 unix-like系统兼容
- [ ] 更多架构系统兼容
- [ ] unzip体积裁剪

## 打包用法

### 依赖（Windows）

没有依赖

### 依赖（Unix-like）

需要nodejs

### 准备二进制文件

自行准备需要的二进制放置于任意子目录

例如从windows.php.net下载windows PHP二进制包，解压到bin/win

静态编译linux的php，放在bin/linuxx64

### 准备代码

将平台无关的代码放在任意子目录（例如code/index.html, code/hello.php）

### 配置

复制config.js.example未config.js, 参照文件内容创建配置

### 打包

```batsh
mkwrapper.bat
```
```bash
./mkwrapper.sh
```

## 限制

phiwrapper仅仅是将多个二进制文件置于压缩包中，并非类似Mach-O的原生胖二进制，因此文件体积较大，建议针对性对要包含的二进制文件进行裁剪。

## 开源许可

phiwrapper使用带例外的Apache许可证2.0

这代表着你不需要在使用它生成的二进制内加入许可证文本。

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