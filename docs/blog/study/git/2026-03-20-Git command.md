---
title: Git command
date: 2026-03-20
authors:
  - name: 猫酒
    email: 2738035238@qq.com
categories:
  - git
  - command
hide:
  - footer
  - feedback
comments: true
---

# Git Bash

git bash是Windows下的命令行工具，基于msys GNU环境，有git分布式版本控制工具。主要用于git版本控制

> GNU环境，就是说如果你喜欢linux/unix的环境，就可以选择使用git bash

## Git配置（git config）

当安装Git后首先要做的事情是设置用户名称和email地址。这是非常重要的，因为每次Git提交都会使用该用户信息

- git配置内容设置用户信息

```Plain
git config --global user.name "catdrink"
git config --global user.email "2738035238@qq.com"


必须设置用户签名，不然提交代码的时候会报错的
签名的作用是区分不同操作者的身份。在每一个版本的提交信息中能够看得到，依此确认本次提交是谁做的。
注意：这里设置用户签名和将来登录github(或其他代码托管中心）的账号没有任何关系。
#查看配置信息
git config --list
git config user.name
git config -l 查看当前git环境详细配置

2.1、查看系统config
git config --system --list
配置文件在git安装目录/etc/gitconfig
2.2、查看当前用户配置
git config --global --list
配置文件在~/.gitconfig
2.3、查看当前仓库配置信息
git config --local --list
配置文件在当前项目的/.git/config
#通过上面的命令设置的信息会保存在~/.gitconfig文件中


级别优先级
1. 就近原则：项目级别优先于系统用户级别，二者都有时采用项目级别的签名
2. 如果只有系统用户级别的签名，就以系统用户级别的签名为准
3. 二者都没有不允许

2.4、修改git配置
git config [--local][--global][--system] section.key value


git config --global core.quotepath false 配置当前用户的编码项，可以解决中文编码问题
git config --local core.ignorecase false 配置当前项目不忽略文件大小写，git默认忽略文件名的大小写，这点值得注意

# 设置代理
$ git config --list
查看当前git设置

git config --global http.proxy 127.0.0.1:7890
# 127.0.0.1:7890 为系统全局代理的地址
```

## 本地库操作命令

##### 默认参数（`git --/-`）

- `--cached(-c)`显示暂存区中的文件**必须是有暂存区才可以查看**
- `--deleted(-d)`显示删除的文件
- `--modified(-m) `显示修改过的文件
- `--other(-o)`显示没有被git跟踪的文件
- `--stage(-s) `显示mode以及文件对应的Blob对象，进而我们可以获取暂存区中对应文件里面的内容
- `--version(-v)`查看git版本

##### git init                                                 初始化本地库（带工作区）

1. 新建一个文件夹作为分支，在该文件夹下打开`git bash`
2. 输入`git init`,即可初始化仓库

1. 在文件夹`查看隐藏的项目`，可见初始化后生成了`.git`文件

初始化的本地库不能直接推送文件，必须使用`pull`指令同步远程库和本地库的文件先，但是`clone`的远程库可以，因为已经相当于更新了

###### git init --bare                                        初始化仓库不带工作区

##### git status                                                查看本地库状态

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MWMzMTczZWZiYjEyNTYyMzcyM2VkYzIxMjI2M2U1MGRfWDQ5MVRoZGprb3hmbERGY0VEZE1LSkFsTG5rVVg3TVpfVG9rZW46RGE1ZWJxaWJ3b25BeU14eThYYmM1UUg3bkdlXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

###### git status –s                                        看状态 (使输出信息更加简洁)

##### git add 文件名.文件类型                        添加指定文件到暂存区

**未存暂存区的文件会变红，存放后会变绿**

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NzA2NmUwOWI3YjY1YjAwNDUzNjE2NmFhNmIzNWM4NjBfZ3Q0WkdSc3JFU0JYSWIyanc4OEJMNlNad2hEVVRYN2JfVG9rZW46TFhxRWJ1ZkVFb1pnb2h4dkVpUWNENThibkFjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTNhNzM1NGU5NTdkYWJmYzQ4MTk0Njc4ZTAxYTMwYzhfb25iaGY0OWRTOERoTWc5d3pEOHRCQlY5STl5R25rRnJfVG9rZW46S2hlQ2JWUjZSb0R4RHd4a3ZJQ2MxbVQ2bk1lXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### git add .                                                添加所有文件到暂存区

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MjhjODRkZWVjMDU1MTIyYjIyYzJiZTBiYTlmMDliODZfQ2tKdWlpcVJyUHh4R3k0S3pGR1Nmc2luQjFYQ3FWRlpfVG9rZW46T2tsZWI4aExFb1ROSTF4ekpsemNVelM1bmtnXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

**提交所有文件（文件夹）到本地库(也不用写文件名)**，该命令必须在`.git`文件所在的目录下进行，且`.git`文件不可被`push`

```C++
git add -u . u指update，将工作区的被修改的文件和被删除的文件提交到暂存区，不包括新增的文件

git add -A . A指all，将工作区被修改、被删除、新增的文件都提交到暂存区
```

##### git rm --cached 文件名.文件类型        删除暂存区指定文件

##### git commit -m"日志信息"文件名                提交到本地库

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NWMzNDRlYTYxMjFlMjFkNTNkNzQ5YjZmNmYwMjk3MzRfN251NXpSVHBUb2FLOTV3UUdTU0RRbFNySzIxSUJXSWlfVG9rZW46VExTRmJyQnljb01BemN4blBYcWMwSzYzbmpmXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTJiMGVjNTBmYjhhNmNmZWY2MzE5MTU3ZjY2NGEyODRfOXdtVVpOVXh1ME5sTWpmV1pBbnI5RXNWYzBpUGZXWUlfVG9rZW46Qms4S2JybVhJb21lMTV4dTZDWGNQMjcyblZiXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

```C++
git commit -m [massage] 将暂存区所有文件添加到本地仓库

git commit [file-name-1] [file-name-2] -m [massage] 将暂存区指定文件添加到本地仓库

git commit -am [massage] 将工作区的内容直接加入本地仓库

git commit --amend 快速将当前文件修改合并到最新的commit，不会产生新的commit。在提交commit后发现还有部分文件修改忘记提交了可以是用该命令

加-m是指直接在后面写上版本的注释，不加-m的话会用一个vim打开文件让你写入massage，有未追踪的文件将会失败，需要add加入暂存区。
```

##### git reflog                                                查看精简版本信息（日志信息）

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTJhMmJiY2NjMTY5NGU0MjJkNTg3OTA0MzQyMTgzMTVfVjlQalRkelF2NVNWS3BFME1WTHAxb3RpZGtlTHI5RzNfVG9rZW46U09lMWJScmRubzVpNkJ4MzBGTWNncHpYbk5oXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### git log                                                查看详细版本信息

可以看到**完全版**的版本号和作者信息

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTRjZDRlYmU2YWQwNTk3YWYwMjE3ZDIzZmE2NTQzZThfQkdONXhEajBxdmJtcnN0UUxPUkY4RTVWV1BwUEhFVjNfVG9rZW46UGVmQWJONTlib2s4blJ4cTczZGNXc1labmRkXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

```Bash
git log --pretty=oneline                        将提交信息显示为一行
git log --all                                         显示所有分支
git log --abbrev-commit                         使得输出的commitId更简短
git log --graph                                 以图的形式显示

git log --pretty=oneline 将日志缩写为单行显示

git log --graph --pretty=oneline --abbrev-commit 查看分支合并情况

git log --oneline --decorate --graph --all 查看分叉历史，包括：提交历史、各个分支的指向以及项目的分支分叉情况。
```

##### git reflog

##### git reset "文件名.文件类型"                        将暂存区的文件取消暂存 (取消 add )

```Plain
reset 命令的三个参数对比

--soft 七位版本号
仅仅在本地库移动 HEAD 指针

--mixed 七位版本号
在本地库移动 HEAD 指针
重置暂存区

--hard 七位版本号
在本地库移动 HEAD 指针
重置暂存区
重置工作区         


git reset --{soft|(mixed)|hard} HEAD

--soft 其中可选参数soft表示单纯的切换HEAD指向的commit-id

--mixed 默认值mixed参数表示先执行上面一步，然后再将commit-id里面的内容更新到暂存区

--hard hard表示先执行上面两步，然后再将暂存区内容同步到工作区

git reset --hard HEAD^^ 用上两个版本里的所有文件撤回到暂工作区

git reset --hard [commit id] 用指定版本的所有文件撤回到工作区   
```

git reset --hard                 版本穿梭

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MTc5MGMyNWM1Y2ZlZDQ4MDVjZTllMTNjYWZkYzQ4MjNfOWRUVGRaWGhhb1hzT0o4YnR2UHFYV2s5VGNjZTZIbDlfVG9rZW46WGpRQmJ6dmo2b2o5ZjF4Y09vN2M5UVV4bkxjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

- 穿梭后，在git文件夹->HEAD用vs2022打开可以看到指针指向ref->master(分支)
- 再在ref文件夹->master->vs2022打开即可看到指针指向的版本
- 打开文件夹.文件类型，已经变成穿梭后的文件

原理：**通过head指针的指向去修改看到的不同版本的文件**

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MjUyMTU1MGQxNmMzNzNmMTRkMjE5NjlhYjAzNjQ0MWFfUDhWanE4OXdNcDJ6SGN4UDhjRE1GUFBSeWpoUDh4OTZfVG9rZW46WmpuZ2J6aDZyb2Q0OG14VEhIU2NPOWJibkJiXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NmVkNTYxNDhkODc1YTc1ZjRlMjc0YTViNTYyNzg0ZDdfbEtMV0ZqZm1CZ1Z1ajAyMTB6bHRCMW01MWY5OHQ2T1BfVG9rZW46SmtGOWJWSGdVbzQ5ejZ4azA1c2NXYnlWbjRlXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### Git revert

```Bash
git revert -n [commit-id]

git revert -n HEAD^^

撤回版本的比较

reset 切换版本是会删除丢弃最新的版本的，HEAD会直接跳到指定版本，但是还是可以通过reflog找回。

revert 会将指定的bug版本视为bug版，会将当前版本中的bug版的代码删除，生成新的commit覆盖掉当前commit，但是commit-id是不会变的。
```

##### git diff                                                比较文件差异

```Plain
git diff [文件名]
        将工作区中的文件和暂存区进行比较
git diff [本地库中历史版本] [文件名]
        将工作区中的文件和本地库历史记录比较
不带文件名比较多个文件

git diff HEAD -- . 查看最新本地版本库和工作区所有文件的区别

git diff HEAD -- [file-name] 查看最新本地版本库和工作区文件的却别

git diff HEAD^ -- [file-name] 查看本地上一个版本和工作区文件的却别

git diff [local branch] origin/[remote branch] 比较本地分支和远程分支的区别
```

##### Git stash

```Bash
git stash 隐藏当前工作的修改

如果不隐藏自己修改的半成品代码，就会发生切换到别的分支后，将然后自己的半成品代码带入其他分支，这样就发生很多不必要的麻烦。
git stash save message 执行存储时，添加备注，方便查找，只有git stash 也要可以的，但查找时不方便识别。

git stash list 查看隐藏的工作信息列表

git stash drop 删除隐藏的工作信息

git stash pop 恢复隐藏的工作信息，同时删除隐藏的工作信息

git stash apply [stash@{0}] 恢复指定的隐藏工作信息，但是不会删除隐藏的工作信息

# 保存当前未commit的代码
git stash
# 保存当前未commit的代码并添加备注
git stash save "备注的内容"
# 列出stash的所有记录
git stash list
# 删除stash的所有记录
git stash clear
# 应用最近一次的stash
git stash apply
# 应用最近一次的stash，随后删除该记录
git stash pop
# 删除最近的一次stash
git stash drop
```

##### Git Cherry-pick

```Bash
git cherry-pick [commit-id] 这个是复制一次commit提交，然后在当前分支上重新提交一遍；也就是将指定commit的合并到当前分支；

这种适用于在其他分支上修复了bug，但是这个bug在当前分支上依然存在，所以可以复制这个commit的过程，不必重写代码。
```

##### **git ls-files                                        查看暂存区文件**

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ODBmMWE3ODQ4YmQ0MGVlMzY2YTkxZGM3ZmY4NDM2MjJfbVZnd1dGNXhTZG44UnFyUkpadVgxRXdsZDdPU1VUZFdfVG9rZW46SUVqTWIwOXY2b2QxSjd4cWQxMGNnQWVSbk1lXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

​                        

###### git ls-files -s -- 文件名.文件类型                查看暂存区文件的Blob对象

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NWNjYmUwYzMwYjkwMzFmMjBmNWQwMWE2M2RjMDRjN2NfeFNHUHc2RUZTdVdsWUtVYTJYaU4xQlIwTUk5Q3o4ODBfVG9rZW46QjJGb2JNM3hVb3V4WEF4SFNjSWNZRGFKbnNlXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

###### git ls-files -s                                         查看暂存区所有文件的Blob对象

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTM3MWQ1MGM2ZjFiODlkMDJkNTljOTZjYzZiZDVjMjVfNzEzZElaUVRTbFFDM2VDYktBbWxleDNnMFhKOTNWRGFfVG9rZW46SmJJdWJsT1ZrbzFlam94bkxaVmNRR0pUbnBoXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### **git cat-file -p 文件****Blob****对象                查看暂存区文件内容**

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YzhkNmUxMTQ1MmY2YzIxNzYzYjNjZTQ3ZTYzYTRkMjVfYVU5VWVlY0lMQlZEellUbmxSTHNNdUY2bUR4d3ZvVXpfVG9rZW46TUlTQmJud0Yyb1BmbG54TXlHSmNoV0tobjNjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### git help                                                显示git的帮助

##### git mv -f oldfolder newfolder                修改文件名

##### git rm                                                删除文件

```
git rm <文件名>  
```

##### git checkout head                                误删文件回退

```Plain
# 如果本工作区库误删, 想要回退
git checkout head <文件名>
```

##### Git clean

```C++
git clean -df 加-d是指包含目录，加-f是指强制，删除所有未跟踪的文件
```

##### cat 文件名.文件类型                                查看文件内容

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YWM4MGE4M2RhOGNjYzQ5N2Q5YTJmZGFmNDE4ZjViNjhfbm83bDg0S3o2YTJHdEdjQ3g2Q3FRY2NsYjZTU3NxRGVfVG9rZW46STdlcmJYQ1Fsb2htWm94WnhkWGNWelB1bmplXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### vim 文件名.文件类型                                新建文件/编辑文件

###### 新建文件

进入编辑界面

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ODk1ODVjZjYyMGNlODg1YmZhYjk5OWY5NTgxODE4OTNfN2Ria0pOTUI2dXo3UzE5RnBVVGs3TGVHbVdEcEJNYWtfVG9rZW46T01DUGJGSlVub1IwUXp4WEx2OWNZdlpYbkVlXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

###### 编辑文件且提交本地库

进入编辑

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MGJmN2VhNDU3Y2E4MjFjMGM3MjBlZTQwYTc3OTg3MDZfRkFaRkpOcVVsWWtnS0VaQkpaMGRjV24xTzBVNVJKbGRfVG9rZW46S0YxbWJYblg4b3lDVWx4U3daTWN1blBNbm5mXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

编辑后查看本地库状态

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTdjNjQwNGM3MDg4MGVmMTcwZjcxOTY2MDYxODBmNzlfUFg3aEZ2VVBETnI1VnZud1Z1MVA5b2VnbjZKZnRjY0ZfVG9rZW46T0ZOWmI4eldtbzE2Tjl4TjIwdGNnMWlCblhjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

添加暂存库后查看本地库状态

提交本地库（10 deletions即有10行被修改）

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTQ0YjQ0MTExYmY5Y2E2MmQ0NzQxOTFiZGVkYmNlYzBfWGxHek5lUjR1QWh5VEJpVnF4dnJPZHlzT29HVEttMnJfVG9rZW46Q2RYN2JxYm1mb1VyaFZ4TG14YWNtRmRqbllmXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### ll                                                        查看当前文档的所有文件

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OGY1NzYxZTVkYjNhZTEwNjEyY2JkYTY0MDIzMzkzYWNfZGVyVG5zSldtdVlrZnVxZ2Q0TjIyRW9zeFhaamJJcjZfVG9rZW46SjQ4SmJsWDc2b28xWlJ4b1BnOGN1SDNobmpmXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### ll -a                                                        查看隐藏文件

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MzU3ODFkYTk3MWIxMWVkNGE4YmE5NTExMzI0MTAyNTRfeDcyVGFmNTYxbjdPODBqZlpMclhQOG9zYW5uQmpTeHBfVG9rZW46TkxCbWJlbzZrb3NmbEF4SWxEZGN6UGJwbmpiXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### cd 文件夹名                                        可进入文件夹

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NDU5Mzk3OGM0ZjhiMjZlNzMyZmZmMTc0YjM1ZjJlNjZfQm1Qc0NIZEttUERFbzgxcjdTZHFKWjlwMWhEaUdIVkpfVG9rZW46SGRZOWJVTUNQb0tOYjh4RjhoemN3RVMzbnJjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### cd ..                                                        退出本级文件

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NDMxNGRkYTQ4MTU3NGJkNTc2NDlhYzI5NDI2YjU1ZDlfRzQ4dVJVemFxRkNhMkVpdUtkMzkwVW9lTUYzdEdIU3ZfVG9rZW46Q1B5ZWJYNjJqb25md2Z4aWFTV2Nra2NObjJiXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### tail -n 1 文件名.文件类型                         查看指定文件倒数第1行的文本（数字可改）

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NWFmMjMxZTRhMDA4MTIxMDAyNzI5YjUxNzk1YWE1MTJfam82bnhLN1Z1RGxGOXRCRFRhdk9KcVFQM3c2R1BoS1ZfVG9rZW46WkVmWmJLS0Vib0dsdmx4bjdGMWNBWEFtbnJnXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### history                                                最近历史执行过的命令

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MmI0OWE5NjI0ODNlMTI3ZWE2M2I1YWNhNGYzOWFkNmJfWDl1QjhaUXhsbUp6SnVZalpGeWtqWVZDcEo5NVZyZ3JfVG9rZW46TXlhTWJ4dElkbzRtSmd4eWRKQWM3TXdFbkxmXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### vi 文件名.文件类型                                编辑文件

##### **pwd                                                 显示当前目录路径**

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YjU3OTUwZjdmODgyNzgxN2IzMzUxOGY1MmQzNGJjYzdfUzdBMklNRmZjaUw3UnRLaE93S0Q3azNHUnhiTElXaHJfVG9rZW46QWRVeWJKdlVQb05zbG94d2lpdmNMaUNubjBmXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### touch 文件名.文件类型                         新建一个指定类型和指定名称的文件

##### rm 文件名.文件类型                                删除指定文件

##### rm -rf 目录名   强制删除目录                删除指定目录

##### mkdir 目录名                                         新建目录

##### mv ...                                                移动文件或者是更改文件名称

`mv index.html ./b.html`就是改名

`mv index.html ./aa`这就是将index.html移动到./aa目录下。

`mv index.html ./aa/bb.html`，这是就是将index.html移动到./aa目录下并改名为bb.html

##### reset                                                 重新初始化终端/清屏

##### clear                                                 清屏

##### help                                                 显示帮助

### git编辑器指令

###### 输入zz                                大写模式

###### 按i或insert                        进入编辑模式

###### 按Esc键                                退出编辑模式

###### shift+;+wq                        保存退出

###### shift+;+q!                                强制不保存退出

###### esc                                        退出编辑模式

###### yy                                        复制

###### p                                        粘贴

### commit 规范

```XML
<type>(<scope>) : <subject>
<空行>
<body>
<空行>
<footer>

  // 注意冒号 : 后有空格
type：本次提交的类别，必填
scope：影响范围，可以不填
subject：提交的标题，一句话概括提交的内容
body：详细描述提交的内容，可以不填
footer：放置写备注啥的，如果是 bug ，可以把bug id放入
```

如 `feat(miniprogram): 增加了小程序模板消息相关功能`

标题分为 **类型 type**、 **改动范围scope** 、 **精简总结subject** 三部分：

规范的主要类型如下：

- feat：新功能或功能变更相关
- fix：修复bug相关
- docs：改动了文档，注释相关
- style：修改了代码格式化相关，如删除空格、改变缩进、单双引号切换、增删分号等，并不会影响代码逻辑
- refactor：重构代码，代码结构的调整相关（理论上不影响现有功能）
- perf：性能改动，性能、页面等优化相关
- test：增加或更改测试用例，单元测试相关
- build： 影响编译的更改相关，比如打包路径更改、npm过程更改等
- ci：持续集成方面的更改。现在有些build系统喜欢把ci功能使用yml描述。如有这种更改，建议使用ci
- chore：其它改动相关，比如文件的删除、构建流程修改、依赖库工具更新增加等
- revert：回滚版本相关

其实实际开发中最常用的就是 feat、fix 和 perf，git提交基本上都是实现需求，更改bug，性能优化。除了上述这些主要类型，我们也可以根据团队要求定制类型，毕竟规范是死的，人是活的嘛。比如为了大家更易读，我们只留几个常用的，并且全改成中文，如：

功能更改：新功能或功能变更相关

修复bug：修复bug相关

优化：性能改动，性能、页面等优化相关

示例：`feat(nacos):Add spring.config.import for extension-config import`

#### Header

Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）

##### type

type用于说明 commit 的类别，只允许使用下面标识。

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
- merge：合并分支
- perf：优化相关，比如提升性能、体验
- revert：回滚到上一个版本
- build：构建

如果 type 为 feat 和 fix，则该 commit 将肯定出现在 Change log 之中。

##### scope

**scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。**

scope是范围的意思，主要指的是代码的影响面。

scope并没有要求强制，但团队可以按照自己的理解进行设计。通常由技术维度和业务维度两种划分方式。

- 按照技术分为：controller、dto、service、dao等。但因为一个功能提交，会涉及到多个scope（都不喜欢非常细粒度的提交），所以按照技术维度分的情况比较少。
- 按照业务模块进行划分，也是比较不错的选择。比如分为user、order等划分，可以很容易看出是影响用户模块还是order模块。

如果你实在不知道怎么填，那就留空。

##### subject

subject 是 commit 目的的简短描述，不超过50个字符。

#### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。

#### Footer

添加一些额外的hook，比如提交记录之后，自动关闭jira的工单（JIRA和gitlab等是可以联动的）,再比如触发一些文档编译或者其他动作。

这部分自定义行也是比较强的。

Footer 部分只用于两种情况。

1. **不兼容变动**

如果当前代码与上一个版本不兼容，则 Footer 部分以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动理由和迁移方法。

```YAML
BREAKING CHANGE: isolate scope bindings definition has changed.

  To migrate the code follow the example below:

  Before:

  scope: {
    myAttr: 'attribute',
  }

  After:

  scope: {
    myAttr: '@',  
  }

  The removed `inject` wasn't generaly useful for directives so   there should be no code using it.
```

1. **关闭 Issue**

如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。Closes #234 复制代码也可以一次关闭多个 issue 。Closes #123, #245, #992 复制代码

#### Skip CI

最后还有一个skip CI选项。一般的ci工具，都可以设置提交代码时自动触发编译。但你可以告诉它忽略本次提交。这可能是因为你提前预判到了一些构建风险，或者就是不想编译。

### commit辅助规范工具

##### Commitizen

1. 安装

```
$ npm install -g commitizen
```

1. 在项目目录里运行下面命令

```
$ commitizen init cz-conventional-changelog --save --save-exact
```

以后，凡是用到`git commit`命令，一律改为使用`git cz`。这时，就会出现选项，用来生成符合格式的 Commit message。

##### 插件：Git Commit Template

在IDEA的Marketplace中，搜索Git Commit Template，就可以安装这个插件。插件很小，很快就能下载下来。

## git基本原理

### 哈希

哈希是一个系列的加密算法，各个不同的哈希算法虽然加密强度不同，但是有以下

几个共同点：

1. 不管输入数据的数据量有多大，输入同一个哈希算法，得到的加密结果长度固定。
2. 哈希算法确定，输入数据确定，输出数据能够保证不变
3. 哈希算法确定，输入数据有变化，输出数据一定有变化，而且通常变化很大
4. 哈希算法不可逆

Git 底层采用的是 SHA-1 算法。哈希算法可以被用来验证文件。原理如下图所示：

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTk2ZWIzMjlhODNiMjBmOGYwOGMzZjJiYWQ5YWMzZWNfbGREYWZoUUg3ZFJjQk01Y1Njend6djdMZExYSkpmeDRfVG9rZW46SWNxUWJIeWVkb3MwczN4andoUGNRQlJhbjZtXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

### Git 保存版本的机制

- 集中式版本控制工具的文件管理机制

以文件变更列表的方式存储信息。这类系统将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异

- Git 的文件管理机制

git把数据看作是小型文件系统的一组快照。每次提交更新时 Git 都会对当前的全部文件制作一个快照并保存这个快照的索引。为了高效，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。所以 Git 的工作方式可以称之为快照流。

### Git工作流

在项目开发过程中使用 Git 的方式

#### 分类

##### 集中式工作流

像 SVN 一样，集中式工作流以中央仓库作为项目所有修改的单点实体。所有修改都提交到 Master 这个分支上。这种方式与 SVN 的主要区别就是开发人员有本地库。Git 很多特性并没有用到。

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTJlZTgyN2IxMWU1MTE3OTE3OTQ4NzI2ODc4OWE4NjhfbUdmUGMwTjJqYmREVTRvQmdEd25qSXo5YWphNjBURTZfVG9rZW46SFBNNWJ0NlZxb3lNOFJ4ZWFzMWNMT09zbkFoXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### GitFlow 工作流

Gitflow 工作流通过为功能开发、发布准备和维护设立了独立的分支，让发布迭代过程更流畅。严格的分支模型也为大型项目提供了一些非常必要的结构。

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YTYxNDQ0MmE2ODM2NDQ5Mjg2MThiNzViZDZiYzYwMzRfaGlwZjRCd2ZUMGRIT3JMa0lIdTVkZzBxdWF2RVI1bFVfVG9rZW46UThaVmJDWEdNb29Ua0V4a2dXUmNzMW1ubnhoXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

##### Forking 工作流

Forking 工作流是在 GitFlow 基础上，充分利用了 Git 的 Fork 和 pull request 的功能以达到代码审核的目的。更适合安全可靠地管理大团队的开发者，而且能接受**不信任贡献者的提交**。

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YWMxNDQ0MmZmNWQ1NTk1NDIxNDg3ODg1N2MyNzA5MjNfQ3R4ZWFXUEk4UGRwREtzNzlNTjh0c3YzWWdvcDF2a3VfVG9rZW46TmNxNWJKVUFpb2tEU3V4RjljeGNRVlVwbjFjXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

#### GitFlow 工作流详解

##### 分支种类

1. 主干分支 master

主要负责管理正在运行的生产环境代码。永远保持与正在运行的生产环境完全一致。

1. 开发分支develop

主要负责管理正在开发过程中的代码。一般情况下应该是最新的代码。bug 修理分支 hotfix

1. 主要负责管理生产环境下出现的紧急修复的代码。 从主干分支分出，修理完毕并测试上线后，并回主干分支。并回后，视情况可以删除该分支。
2. 准生产分支（预发布分支） release

较大的版本上线前，会从开发分支中分出准生产分支，进行最后阶段的集成测试。该版本上线后，会合并到主干分支。生产环境运行一段阶段较稳定后可以视情况删除。

1. 功能分支feature

为了不影响较短周期的开发工作，一般把中长期开发模块，会从开发分支中独立出来。 开发完成后会合并到开发分支。

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YzA0OGU4NDVjMzkwYTQyZDUxZmM4MjhjNjYxOWFhOTZfMU9GOHgxZ1p3VlN6dEpFZHpTaUZtcDdkN2JrelE4ZjJfVG9rZW46WE9tTmJLeTZKbzdtSDB4aHk1VWNDZkN2bkpiXzE3NzAxMDc2OTU6MTc3MDExMTI5NV9WNA)

## `.gitignore`文件

Git管理中的项目中，有一些文件夹或者文件是没有必要同步到仓库中的。比如JavaWeb中的target文件夹，通过到仓库中反而会浪费一些时间。所以我们需要通过设置进行忽略特定的文件。

### 添加`.gitignore`

```Plain
1. 添加.gitignore文件
                        touch .gitignore
2. 配置忽略的文件或者文件夹，通过vim命令来编辑，文件内容如下：
      /target/
      .idea
      # 所有以.a 结尾的文件讲被忽略(递归)
      *.a
      # 不管其他规则怎样,强制不忽略  lib.a
      !lib.a
      # 只忽略 文件 TODO (注意这里是文件)
      /TODO
      # 忽略 build文件夹下所有内容(递归) 这里是文件夹
      build/
      # 忽略 doc 目录下以 *.txt 结尾的文件 (不递归)
      doc/*.txt
      # 忽略 doc 目录下以 *.pdf 结尾的文件 (递归)
      doc/**/*.pdf
3. 使用命令git config配置忽略配置文件.gitignore
                        git config core.excludesfile .gitignore
```

### 配置忽略文件规则

```Plain
# 注释用"#"

# 忽略指定路径下的文件，注意需要加前面的"/"，如果不加"/"，那么所有路径包含这个名字的文件都会被忽略
/node_modules

#忽略指定格式的文件
*.json

#"!"表示例外，所有的.json文件都会被忽略但是除了package.json文件
*.json
!package.json

# 的
以”#”号开头表示注释，开头的文件标识注释，可以使用反斜杠进行转义
空格不匹配任意文件，可作为分隔符，可用反斜杠转义
以斜杠“/”开头表示目录,/ 结束的模式只匹配文件夹以及在该文件夹路径下的内容，但是不匹配该文件
                / 开始的模式匹配项目跟目录
   如果一个模式不包含斜杠，则它匹配相对于当前 .gitignore 文件路径的内容，如果该模式不在 .gitignore 文件中，则相对于项目根目录
以星号“*”匹配零个或多个字符
以问号“?”通配单个字符
以方括号“[]”包含单个字符的匹配列表；
以叹号“!”表示不忽略(跟踪)匹配到的文件或目录,开头的模式标识否定，该文件将会再次被包含，
        如果排除了该文件的父级目录，则使用 ! 也不会再次被包含。可以使用反斜杠进行转义
 匹配多级目录，可在开始，中间，结束，意思是所有文件夹及其子文件夹




*.txt  ，*.xls  表示过滤某种类型的文件
target/ ：表示过滤这个文件夹下的所有文件
/test/a.txt ，/test/b.xls  表示指定过滤某个文件下具体文件
!*.java , !/dir/test/     !开头表示不过滤
*.[ab]    支持通配符：过滤所有以.a或者.b为扩展名的文件
/test  仅仅忽略项目根目录下的 test 文件，不包括 child/test等非根目录的test目录
# Compiled class file
*.class
 
# Eclipse
.project
.classpath
.settings/
 
# Intellij
*.ipr
*.iml
*.iws
.idea/
 
# Maven
target/
 
# Gradle
build
.gradle
 
# Log file
*.log
log/
 
# out
**/out/
 
# Mac
.DS_Store
 
# others
*.jar
*.war
*.zip
*.tar
*.tar.gz
*.pid
*.orig
temp/
# Prerequisites
*.d
 
# Compiled Object files
*.slo
*.lo
*.o
*.obj
 
# Precompiled Headers
*.gch
*.pch
 
# Compiled Dynamic libraries
*.so
*.dylib
*.dll
 
# Fortran module files
*.mod
*.smod
 
# Compiled Static libraries
*.lai
*.la
*.a
*.lib
 
# Executables
*.exe
*.out
*.app
 
build/
.vscode/
```

### `.gitignore`不生效

`.gitignore`只能忽略原来没有被跟踪的文件，因此跟踪过的文件是无法被忽略的。因此在网页上可以看到target等目录的存在。

解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:

```Plain
1. 
git rm -r --cached .
2. 
git add .
3. 
git commit -m 'add .gitignore file'
4. 推送
git push origin master
```

### IDEA中的`gitignore`插件

IDEA中的.ignore插件

一般来说，每一种项目都会有一些特定的ignore模板，比如Java会产生class文件，node会产生node_modules模块；如果每种项目都有一个gitignore模板那该多好啊；正好，IDEA就有这样一个插件：.ignore插件；不过它不止适用于gitignore，还适用于其他的ignore

不过我们这里只介绍.gitignore；

安装插件:直接在插件市场搜索 ignore，安装即可

## git命令拓展操作

### `git reflog` 彻底删除 本地提交历史记录

首先reset 然而知道id（那串哈希码）的情况下还是可以恢复 而git reflog可以看到历史

然后调时间（调成几个月后）然后`git gc`

很好 git reflog也看不到历史了 但是知道id的话 还是可以恢复回来。。有没有办法彻底删除呢

1. 首先确保所有分支都没有引用该提交，包括HEAD也不指向这个提交。
2. 然后 `git reflog expire --expire=now --all `(这会清除分支变更历史)
3. 然后` git gc --prune=now` (不用调整时间，加上–prune=now命令即可)

### 从GitHub远程仓库中删除文件夹或文件

在上传项目到github时,忘记忽略了某个文件夹target,就直接push上去了, 最后意识到了此问题,决定删除掉远程仓库中的target文件夹

在github上只能删除仓库,却无法删除文件夹或文件, 所以只能通过命令来解决

首先进入你的master文件夹下, Git Bash Here ,打开命令窗口

```Plain
$ git --help 帮助命令

$ git pull origin master 将远程仓库里面的项目拉下来

$ dir 查看有哪些文件夹

$ git rm -r --cached target 删除target文件夹
$ git commit -m '删除了target'  提交,添加操作说明
$ git push -u origin master 将本次更改更新到github项目上去

操作完成.

注:本地项目中的target文件夹不收操作影响,删除的只是远程仓库中的target, 可放心删除

每次增加文件或删除文件，都要commit 然后直接 git push -u origin master，就可以同步到github上了
```