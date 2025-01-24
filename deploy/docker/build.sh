#!/usr/bin/env bash
# @name:   Jenkins构建脚本(springboot-mars项目)
# @author: duqian
# @date:   2024-07-10
# 代码提交或有新的标签提交时触发，构建docker镜像，推送到harbor，然后部署到183和61
# 最后一个提交上有标签时，会构建一个以此标签为tag的镜像，没有打标签时，镜像tag为"devp"
# v1.1.0 更新：开发时用镜像仓库222.30.195.183:10000，节约网络带宽
# v1.1.1 更新：可以指定部署到哪个开发平台
# v1.2.0 更新：代码重构、优化  ！！还有bug：jar包文件名修改后第一次构建会失败
# v1.2.1 更新：修复bug
# v1.2.2 更新：部署时只拷贝对应的configmap文件，而不是两个都拷贝
# v1.3.0 更新：使用docker buildx 同时构建多架构镜像
# v1.4.0 更新：正式版本镜像推送地址改为 http://222.30.195.212:10000/ ，由此再往harbor.yunzainfo.com和阿里云ACR推送
# v1.5.0 更新：增加部署的开发环境：66平台（master: 222.30.195.220）
# v1.6.0 更新：调用v2版本脚本
# v2.0.0 更新：1.更改脚本调用方式，使用getopt解析参数; 2.支持自定义部署目标; 3.支持配置是否启用热部署 4. 支持配置是否重新加载configmap

# --------------- 局部变量开始 --------------- #
# 打印日志前缀，方便查看
LOG_PREFIX="【MARS】---> "
LOG_SUCCESS="【SUCCESS】"
LOG_FAIL="【FAIL】"
DEVP_HARBOR="222.30.195.183:10000"
PROD_HARBOR="harbor.yunzainfo.com:10000"
PUSH_HARBOR="222.30.195.212:10000"
TARGET_SERVER_61="222.30.195.129"
TARGET_SERVER_ZZ="222.30.195.121"
TARGET_SERVER_DEV="222.30.195.220"
# docker镜像版本号，默认为devp，当前节点有标签时，为标签名
VERSION_DEVP=devp
VERSION_TAG=${VERSION_DEVP}
# 在局部变量区域添加默认平台配置
DEFAULT_PLATFORMS="linux/amd64,linux/arm64"

# 在参数变量区域添加平台变量
A_PLATFORMS="${DEFAULT_PLATFORMS}"
# --------------- 局部变量结束 --------------- #


printVersion(){
  echo "${LOG_PREFIX}Jenkins构建脚本 build-mars, 版本: v2.0.0 (2024-07-10)"
}

printHelp(){
  echo "${LOG_PREFIX}简单用法：/opt/tools/build-mars-v2.sh --project <PROJECT_NAME>"
  echo "${LOG_PREFIX}参数说明："
  echo "${LOG_PREFIX}  -p, --project  项目名，如果docker镜像名称一致，则可使用--project这一个参数，否则需要使用--image、--dir两个参数"
  echo "${LOG_PREFIX}简单示例: /opt/tools/build-mars-v2.sh --project mail"
  echo "${LOG_PREFIX}"
  echo "${LOG_PREFIX}复杂用法：/opt/tools/build-mars-v2.sh --image <IMAGE> --dir <REMOTE_YAML_DIR> [可选参数]"
  echo "${LOG_PREFIX}参数说明："
  echo "${LOG_PREFIX}  -i, --image    镜像地址，如：harbor.yunzainfo.com:10000/cloud/app-manager"
  echo "${LOG_PREFIX}  -d, --dir      远程服务器的yaml文件所在目录，如：/opt/work/mars-app-manager/"
  echo "${LOG_PREFIX}  -t, --target   （可选参数）部署目标，多个平台用逗号隔开，如：dev,61,zz，默认部署到dev,61,zz平台，传none表示不部署"
  echo "${LOG_PREFIX}      --hot      （可选参数）开启热部署模式，默认不开启，即先删pod再启动"
  echo "${LOG_PREFIX}      --platform （可选参数）构建平台，多个平台用逗号隔开，如：linux/amd64,linux/arm64，默认为：${DEFAULT_PLATFORMS}"
  echo "${LOG_PREFIX}复杂示例：/opt/tools/build-mars-v2.sh --image harbor.yunzainfo.com:10000/cloud/app-manager --dir /opt/work/mars-app-manager/ --target dev,61"
}


# 打包，构建镜像，推送
build(){
  # docker镜像名(不带tag)
  A_IMAGE=$2
  
  devp_image="${A_IMAGE/${PROD_HARBOR}/${DEVP_HARBOR}}"
  push_image="${A_IMAGE/${PROD_HARBOR}/${PUSH_HARBOR}}"
  echo "${LOG_PREFIX}docker开发版本构建开始... （$devp_image:$VERSION_DEVP）"
  echo "${LOG_PREFIX}构建平台: ${A_PLATFORMS}"
  echo "${LOG_PREFIX}DOCKER_BUILDKIT=1 docker buildx build -f deploy/docker/Dockerfile --platform ${A_PLATFORMS} --provenance=false -t $devp_image:$VERSION_DEVP . --push"
  DOCKER_BUILDKIT=1 docker buildx build -f deploy/docker/Dockerfile --platform "${A_PLATFORMS}" --provenance=false -t "$devp_image:$VERSION_DEVP" . --push > /dev/null
  if [ $? -ne 0 ]; then
    echo "${LOG_PREFIX}${LOG_FAIL}docker开发版本构建或推送失败！（$devp_image:$VERSION_DEVP）"
    exit 1
  fi
  echo "${LOG_PREFIX}docker开发版本构建并推送完成. （$devp_image:$VERSION_DEVP）"

  # 看当前提交是否有标签，如果有，则按此标签名构建镜像版本并推送
  gitLastTag=$(git describe --tags $(git rev-list --tags --max-count=1))
  if [[ ! -n ${gitLastTag} ]]; then
      echo "${LOG_PREFIX}该项目尚未打过标签"
  else
      echo "${LOG_PREFIX}所有分支最后一个标签: ${gitLastTag}"
      hashTag=$(git describe --tags "${gitLastTag}")
      currentHeadTag=$(git describe --tags HEAD)
      if [[ ${hashTag} == "${currentHeadTag}" ]]; then
          echo "${LOG_PREFIX}当前节点标签: ${currentHeadTag}"
          VERSION_TAG=$currentHeadTag
          echo "${LOG_PREFIX}docker标签版本构建开始... （$push_image:$VERSION_TAG）"
          echo "${LOG_PREFIX}DOCKER_BUILDKIT=1 docker buildx build -f deploy/docker/Dockerfile --platform ${A_PLATFORMS} --provenance=false -t $push_image:$VERSION_TAG . --push"
          DOCKER_BUILDKIT=1 docker buildx build -f deploy/docker/Dockerfile --platform "${A_PLATFORMS}" --provenance=false -t "$push_image:$VERSION_TAG" . --push > /dev/null
          if [ $? -ne 0 ]; then
            echo "${LOG_PREFIX}${LOG_FAIL}docker标签版本构建或推送失败！"
            exit 1
          fi
          echo "${LOG_PREFIX}docker标签版本构建并推送完成.（$push_image:$VERSION_TAG）"
      else
          echo "${LOG_PREFIX}当前节点未打标签"
      fi
  fi
}


# 部署到开发服务器(使用183镜像仓库)
deployDevpServer() {
  remote_yaml_dir=$1
  host=$2
  hot=$3
  echo "${LOG_PREFIX}部署到 $host ..."
  ssh root@$host << EOF
    mkdir -p $remote_yaml_dir
EOF
  echo "${LOG_PREFIX}修改istio配置文件，加入一些配置"
  cp istio/istio-svc-dpt.yaml istio/_istio-svc-dpt_bak.yaml
  /opt/tools/add-affinity.py istio/istio-svc-dpt.yaml

  echo "${LOG_PREFIX}拷贝istio配置文件"
  scp istio/istio-*.yaml root@$host:$remote_yaml_dir

  mv -f istio/_istio-svc-dpt_bak.yaml istio/istio-svc-dpt.yaml

  echo "${LOG_PREFIX}执行远程命令"
  ssh root@$host << EOF
    cd $remote_yaml_dir
    if [ "$hot" = "false" ];then
      kubectl delete -f istio-svc-dpt.yaml
    fi
    if [ "$hot" = "true" ];then
      sed -i "s/-Dfile.encoding=UTF-8/-Dfile.encoding=UTF-8 -Dyzdeploydate=$(date +%Y%m%d_%H%M%S)/g" istio-svc-dpt.yaml
    fi
    sed -i "s/${PROD_HARBOR}/${DEVP_HARBOR}/g" istio-svc-dpt.yaml
    kubectl apply -f istio-svc-dpt.yaml
    kubectl delete -f istio-gateway.yaml
    kubectl apply -f istio-gateway.yaml
    exit
EOF
  echo "${LOG_PREFIX}${LOG_SUCCESS}部署到 $host 完成."
}


# 部署到开发服务器(使用183镜像仓库)
deploy() {
  remote_yaml_dir=$1
  target=$2
  hot=$3
  if [[ "$target" ]];then
    if [ "$target" = "none" ]; then
      echo "${LOG_PREFIX}不进行部署."
    else
      target_array=(${target//,/ })
      for var in "${target_array[@]}"
      do
         if [ "$var" = "dev" ]; then
            deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_DEV "$hot"
         elif [ "$var" = "66" ]; then
            deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_DEV "$hot"
         elif [ "$var" = "61" ]; then
            deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_61 "$hot"
         elif [ "$var" = "zz" ]; then
            deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_ZZ "$hot"
         fi
      done
    fi
  else
    deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_61 "$hot"
    deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_DEV "$hot"
    deployDevpServer "$remote_yaml_dir" $TARGET_SERVER_ZZ "$hot"
  fi
}



# ------------ 变量开始，参数从脚本传入，用getopt解析后赋值给变量 ------------ #

# docker镜像名(不带tag)
A_IMAGE=""
# 服务器上的yaml所在目录
A_REMOTE_YAML_DIR=""
# 部署目标
A_TARGET="dev,61,zz"
# 是否热部署
A_HOT="false"

# -o或--options选项后面接可接受的短选项，如ab:c::，表示可接受的短选项为-a -b -c，其中-a选项不接参数，-b选项后必须接参数，-c选项的参数为可选的
# -l或--long选项后面接可接受的长选项，用逗号分开，冒号的意义同短选项。
# -n选项后接选项解析错误时提示的脚本名字
TEMP=$(getopt -o hp:i:d:t: -l help,project:,image:,dir:,target:,hot,platform: -n 'build-mars-v2.sh' -- "$@")

if [ $? != 0 ] ; then
  echo "${LOG_PREFIX}-----------------[ 参数错误 ]-----------------" 1>&2;
  printVersion
  printHelp
  exit 1 ;
fi

eval set -- "$TEMP"

while true ; do
  case "$1" in
    -h|--help)
      echo "${LOG_PREFIX}getopt 获得参数：help" ;
      printVersion
      printHelp
      exit ;;
    -p|--project)
      echo "${LOG_PREFIX}getopt 获得参数：project=\`$2\`" ;
      A_IMAGE="harbor.yunzainfo.com:10000/cloud/$2"
      A_REMOTE_YAML_DIR="/opt/work/$2/"
      shift 2 ;;
    -i|--image)
      echo "${LOG_PREFIX}getopt 获得参数：image=\`$2\`" ;
      A_IMAGE="$2"
      shift 2 ;;
    -d|--dir)
      echo "${LOG_PREFIX}getopt 获得参数：dir=\`$2\`" ;
      A_REMOTE_YAML_DIR="$2"
      shift 2 ;;
    -t|--target)
      echo "${LOG_PREFIX}getopt 获得参数：target=\`$2\`" ;
      A_TARGET="$2";
      shift 2 ;;
    --hot)
      echo "${LOG_PREFIX}getopt 获得参数：hot" ;
      A_HOT="true"
      shift;;
    --platform)
      echo "${LOG_PREFIX}getopt 获得参数：platform=\`$2\`" ;
      A_PLATFORMS="$2"
      shift 2 ;;
    --) shift ; break ;;
    *)
      echo "${LOG_PREFIX}-----------------[ 参数错误 ]-----------------" 1>&2;
      printVersion
      printHelp
      exit 1 ;;
  esac
done

echo "${LOG_PREFIX}解析后变量值: A_IMAGE=${A_IMAGE}"
echo "${LOG_PREFIX}解析后变量值: A_REMOTE_YAML_DIR=${A_REMOTE_YAML_DIR}"
echo "${LOG_PREFIX}解析后变量值: A_TARGET=${A_TARGET}"
echo "${LOG_PREFIX}解析后变量值: A_HOT=${A_HOT}"

# ----------------- 变量结束 ----------------- #



# -------- 开始调用方法 --------- #
printVersion
printHelp
echo "${LOG_PREFIX}调用方法: build ${A_IMAGE}"
build "" "${A_IMAGE}"
deploy "${A_REMOTE_YAML_DIR}" "${A_TARGET}" "${A_HOT}"
echo "${LOG_PREFIX}脚本执行完毕."

