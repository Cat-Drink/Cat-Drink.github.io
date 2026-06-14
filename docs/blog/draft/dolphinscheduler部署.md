# 3.3.1

> 综合官网文档：https://dolphinscheduler.apache.org/zh-cn/docs/3.3.1/guide/installation/pseudo-cluster

- JDK：下载[JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8 或者 11)，安装并配置 `JAVA_HOME` 环境变量，并将其下的 `bin` 目录追加到 `PATH` 环境变量中。如果你的环境中已存在，可以跳过这步。
- 二进制包：在[下载页面](https://dolphinscheduler.apache.org/zh-cn/download)下载 DolphinScheduler 二进制包
- 数据库：[PostgreSQL](https://www.postgresql.org/download/) (8.2.15+) 或者 [MySQL](https://dev.mysql.com/downloads/mysql/) (5.7+)，两者任选其一即可，如 MySQL 则需要 JDBC Driver 8.0.33
- 注册中心：当前支持 [ZooKeeper](https://zookeeper.apache.org/releases.html) (3.8.0)，[MYSQL](https://www.mysql.com/)(8.0.33)，[ETCD](https://etcd.io/)
- 进程树分析
  - macOS 安装`pstree`
  - Fedora/Red/Hat/CentOS/Ubuntu/Debian 安装`psmisc`

## 伪分布式

### 下载插件依赖

先把插件中的datasource部分的链接源给保留到只剩mysql，然后执行安装插件

```Shell
bash ./bin/install-plugins.sh 3.3.1
```

### 配置用户免密及权限

```Shell
# 创建用户需使用root登录
useradd dolphinscheduler
# 添加密码
echo "dolphinscheduler" | passwd --stdin dolphinscheduler
# 配置sudo（系统管理命令）免密
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults   requirett/#Defaults   requirett/g' /etc/sudoers

# 修改目录权限，使得部署用户对二进制包解压后的 apache-dolphinscheduler-*-bin 目录有操作权限
chown -R dolphinscheduler:dolphinscheduler apache-dolphinscheduler-*-bin
chmod -R 755 apache-dolphinscheduler-*-bin

# 可以先解压再授权解压出来的文件夹
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-3.3.1
chmod -R 755 dolphinscheduler-3.3.1
```

***注意:***

- 因为任务执行服务是以 `sudo -u {linux-user} -i` 切换不同 linux 用户的方式来实现多租户运行作业，所以部署用户需要有 sudo 权限，而且是免密的。初学习者不理解的话，完全可以暂时忽略这一点
- 如果发现 `/etc/sudoers` 文件中有 "Defaults requiretty" 这行，也请注释掉

### 启动注册中心和数据源

1. 启动zookeeper
2. 启动mysql

### 修改配置文件

```Bash
vim /opt/module/dolphinscheduler-3.3.1/master-server/conf/application.yaml

vim /opt/module/dolphinscheduler-3.3.1/worker-server/conf/application.yaml

vim /opt/module/dolphinscheduler-3.3.1/api-server/conf/application.yaml

vim /opt/module/dolphinscheduler-3.3.1/alert-server/conf/application.yaml

vim /opt/module/dolphinscheduler-3.3.1/tools/conf/application.yaml

-------


# 只需要修改文档中的下述部分
datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://tag1:3306/dolphinscheduler2204?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 000000

registry:
    type: zookeeper
    zookeeper:
        namespace: dolphinscheduler2204
        connect-string: tag1:2181,tag2:2181,tag3:2181

# ----可加可不加----
max-cpu-load-avg: 3
reserved-memory: 0.1
max-waiting-time: 150s
# JAVA_HOME, will use it to start DolphinScheduler server
export JAVA_HOME=${JAVA_HOME:-/opt/module/jdk1.8}

# Database related configuration, set database type, username and password
export DATABASE=${DATABASE:-mysql}
export SPRING_PROFILES_ACTIVE=${DATABASE}
export SPRING_DATASOURCE_URL="jdbc:mysql://tag1:3306/dolphinscheduler2204?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=000000

# DolphinScheduler server related configuration
export SPRING_CACHE_TYPE=${SPRING_CACHE_TYPE:-none}
export SPRING_JACKSON_TIME_ZONE=${SPRING_JACKSON_TIME_ZONE:-UTC}

# Registry center configuration, determines the type and link of the registry center
export REGISTRY_TYPE=${REGISTRY_TYPE:-zookeeper}
export REGISTRY_ZOOKEEPER_CONNECT_STRING=${REGISTRY_ZOOKEEPER_CONNECT_STRING:-tag1:2181,tag2:2181,tag3:2181}

# Tasks related configurations, need to change the configuration if you use the related tasks.
export HADOOP_HOME=${HADOOP_HOME:-/opt/module/hadoop-3.3.4}
export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-/opt/module/hadoop-3.3.4/etc/hadoop}
export SPARK_HOME=${SPARK_HOME:-/opt/soft/spark}
export PYTHON_LAUNCHER=${PYTHON_LAUNCHER:-/opt/soft/python}
export HIVE_HOME=${HIVE_HOME:-/opt/soft/hive}
export FLINK_HOME=${FLINK_HOME:-/opt/soft/flink}
export DATAX_LAUNCHER=${DATAX_LAUNCHER:-/opt/soft/datax/bin/python3}

export 
PATH=$HADOOP_HOME/bin:$SPARK_HOME/bin:$PYTHON_LAUNCHER:$JAVA_HOME/bin:$HIVE_HOME/bin:$FLINK_HOME/bin:$DATAX_LAUNCHER:$PATH
```

> 必须根据具体环境更改 `JAVA_HOME`、注册中心和数据库相关配置。

### 数据源配置

1. 选择对应的版本和系统下载连接器:https://downloads.mysql.com/archives/c-j/
   1. ```SQL
      rpm -ql mysql-connector-j 查看是否已经安装
      
      然后用
      rpm -ivh mysql-connector-java.rpm
      来安装驱动
      ```
2. 将连接器复制到各个模块
   1. ```Bash
      cp /usr/share/java/mysql-connector-j.jar /opt/module/dolphinscheduler-3.3.1/master-server/libs/
      cp /usr/share/java/mysql-connector-j.jar /opt/module/dolphinscheduler-3.3.1/worker-server/libs/
      cp /usr/share/java/mysql-connector-j.jar /opt/module/dolphinscheduler-3.3.1/api-server/libs/
      cp /usr/share/java/mysql-connector-j.jar /opt/module/dolphinscheduler-3.3.1/alert-server/libs/
      cp /usr/share/java/mysql-connector-j.jar /opt/module/dolphinscheduler-3.3.1/tools/libs/
      ```
3. 创建元数据的数据库
   1. ```SQL
      CREATE DATABASE dolphinscheduler2204 DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
      ```
4. 加载元数据数据库
   1. ```SQL
      sh /opt/module/dolphinscheduler-3.3.1/tools/bin/upgrade-schema.sh
      ```

### 解决trace缺失导致worker启动失败问题

把`./master-server/libs`中的hbase-trace插件复制到各个模块

### 启动 DolphinScheduler

部署后的运行日志将存放在 `xxx-server/logs` 文件夹内

```Python
# 启动 api-server
bash ./bin/dolphinscheduler-daemon.sh start api-server

# 启动 master-server
bash ./bin/dolphinscheduler-daemon.sh start master-server

# 启动 worker-server
bash ./bin/dolphinscheduler-daemon.sh start worker-server

# 启动 alert-server
bash ./bin/dolphinscheduler-daemon.sh start alert-server
```

浏览器访问地址 http://localhost:12345/dolphinscheduler/ui 即可登录系统 UI。默认的用户名和密码是 **admin 和dolphinscheduler123**按照配置所说，分发安装包，并分别启动脚本

## 分布式

在分布式主机上安装相同的配置，如何将伪分布式主机的安装包分发过去即可

```Bash
#!/bin/bash

ssh tag1 "/opt/module/dolphinscheduler-3.3.1/bin/dolphinscheduler-daemon.sh start master-server"
ssh tag1 "/opt/module/dolphinscheduler-3.3.1/bin/dolphinscheduler-daemon.sh start worker-server"
ssh tag1 "/opt/module/dolphinscheduler-3.3.1/bin/dolphinscheduler-daemon.sh start api-server"

ssh tag2 "/opt/module/dolphinscheduler-3.3.1/bin/dolphinscheduler-daemon.sh start worker-server"

ssh tag3 "/opt/module/dolphinscheduler-3.3.1/bin/dolphinscheduler-daemon.sh start alert-server"                   
```

# 开发部署

nodejs和pnpm

```Markdown
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
curl -fsSL https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh" # 启动node 的shell窗口

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.19.0".

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```