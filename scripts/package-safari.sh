#!/bin/bash

# Safari 扩展一键打包脚本
# 自动完成从构建到 Xcode 项目配置的所有步骤
# 通过 pnpm build:safari 自动调用

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# 配置
SAFARI_DIR="$HOME/desktop/safari"
PROJECT_NAME="小黑 OmniBox for Safari"
TEAM_NAME="Hangzhou Xiaohei Intelligent Technology Co. Ltd"
DEPLOYMENT_TARGET="13.5"
APP_CATEGORY="Utilities"

# ============================================
# 读取版本号和生成 Build 号
# ============================================

# 从 dist/manifest.json 读取版本号
if [ ! -f "./dist/manifest.json" ]; then
    echo -e "${RED}错误: dist/manifest.json 不存在，请先运行 pnpm build:safari${NC}"
    exit 1
fi

VERSION=$(node -p "require('./dist/manifest.json').version")

# 自动生成 Build 号：基于 git commit 数量
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 git 仓库，无法生成 Build 号${NC}"
    echo -e "${YELLOW}请在 git 仓库中运行此命令${NC}"
    exit 1
fi

BUILD=$(git rev-list --count HEAD)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Safari 扩展自动打包${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}版本号:${NC} $VERSION (从 manifest.json)"
echo -e "${YELLOW}构建号:${NC} $BUILD (基于 git commits)"
echo ""

# ============================================
# 1. 生成图标
# ============================================

echo -e "${GREEN}[1/4] 生成 Safari App 图标...${NC}"

SOURCE_ICON="./dist/icon-128.png"
OUTPUT_DIR="./safari-app-icon/AppIcon.appiconset"

if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${RED}错误: 找不到源图标 $SOURCE_ICON${NC}"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# 生成各种尺寸的图标（静默输出）
for size in 16 32 64 128 256 512 1024; do
    sips -z $size $size "$SOURCE_ICON" --out "$OUTPUT_DIR/mac-icon-${size}@1x.png" > /dev/null 2>&1
    double_size=$((size * 2))
    sips -z $double_size $double_size "$SOURCE_ICON" --out "$OUTPUT_DIR/mac-icon-${size}@2x.png" > /dev/null 2>&1
done

# 生成 Contents.json
cat > "$OUTPUT_DIR/Contents.json" << 'EOF'
{
  "images" : [
    {
      "size" : "16x16",
      "idiom" : "mac",
      "filename" : "mac-icon-16@1x.png",
      "scale" : "1x"
    },
    {
      "size" : "16x16",
      "idiom" : "mac",
      "filename" : "mac-icon-16@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "32x32",
      "idiom" : "mac",
      "filename" : "mac-icon-32@1x.png",
      "scale" : "1x"
    },
    {
      "size" : "32x32",
      "idiom" : "mac",
      "filename" : "mac-icon-32@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "128x128",
      "idiom" : "mac",
      "filename" : "mac-icon-128@1x.png",
      "scale" : "1x"
    },
    {
      "size" : "128x128",
      "idiom" : "mac",
      "filename" : "mac-icon-128@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "256x256",
      "idiom" : "mac",
      "filename" : "mac-icon-256@1x.png",
      "scale" : "1x"
    },
    {
      "size" : "256x256",
      "idiom" : "mac",
      "filename" : "mac-icon-256@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "512x512",
      "idiom" : "mac",
      "filename" : "mac-icon-512@1x.png",
      "scale" : "1x"
    },
    {
      "size" : "512x512",
      "idiom" : "mac",
      "filename" : "mac-icon-512@2x.png",
      "scale" : "2x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
EOF

echo -e "${GREEN}✓ 图标生成完成${NC}"

# ============================================
# 2. 生成 Safari 扩展项目
# ============================================

echo ""
echo -e "${GREEN}[2/4] 生成 Safari 扩展项目...${NC}"

# 清理旧项目
if [ -d "$SAFARI_DIR" ]; then
    rm -rf "$SAFARI_DIR"
fi

# 使用自定义图标生成项目
xcrun safari-web-extension-packager \
    --app-name "$PROJECT_NAME" \
    --bundle-identifier pro.omnibox.safari \
    --macos-only \
    --project-location ~/desktop/safari \
    ./dist > /dev/null 2>&1

echo -e "${GREEN}✓ Safari 扩展项目已创建${NC}"

# ============================================
# 3. 替换自定义图标
# ============================================

echo ""
echo -e "${GREEN}[3/5] 替换自定义图标...${NC}"

XCODE_ICON_DIR="$SAFARI_DIR/$PROJECT_NAME/Assets.xcassets/AppIcon.appiconset"

if [ -d "$XCODE_ICON_DIR" ] && [ -d "./safari-app-icon/AppIcon.appiconset" ]; then
    # 删除默认图标
    rm -rf "$XCODE_ICON_DIR"
    # 复制自定义图标
    cp -r "./safari-app-icon/AppIcon.appiconset" "$XCODE_ICON_DIR"
    echo -e "${GREEN}✓ 已替换为无白边自定义图标${NC}"
else
    echo -e "${YELLOW}⚠ 警告: 无法替换图标，将使用默认图标${NC}"
fi

# ============================================
# 4. 配置 Xcode 项目
# ============================================

echo ""
echo -e "${GREEN}[4/5] 配置 Xcode 项目...${NC}"

XCODEPROJ="$SAFARI_DIR/$PROJECT_NAME.xcodeproj"
PBXPROJ="$XCODEPROJ/project.pbxproj"

if [ ! -f "$PBXPROJ" ]; then
    echo -e "${RED}错误: 找不到 Xcode 项目文件${NC}"
    exit 1
fi

# 备份
cp "$PBXPROJ" "$PBXPROJ.backup"

# 修改 macOS Deployment Target
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/MACOSX_DEPLOYMENT_TARGET = [0-9.]*;/MACOSX_DEPLOYMENT_TARGET = $DEPLOYMENT_TARGET;/g" "$PBXPROJ"
else
    sed -i "s/MACOSX_DEPLOYMENT_TARGET = [0-9.]*;/MACOSX_DEPLOYMENT_TARGET = $DEPLOYMENT_TARGET;/g" "$PBXPROJ"
fi

# 修改所有 Info.plist 文件
find "$SAFARI_DIR" -name "Info.plist" -type f | while read -r plist; do
    # 设置版本号和 Build 号
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$plist" 2>/dev/null || \
        /usr/libexec/PlistBuddy -c "Add :CFBundleShortVersionString string $VERSION" "$plist"

    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD" "$plist" 2>/dev/null || \
        /usr/libexec/PlistBuddy -c "Add :CFBundleVersion string $BUILD" "$plist"

    # 删除转换工具版本信息
    /usr/libexec/PlistBuddy -c "Delete :SFSafariWebExtensionConverterVersion" "$plist" 2>/dev/null || true

    # 主应用设置 App Category
    if [[ "$plist" == *"$PROJECT_NAME/Info.plist" ]]; then
        /usr/libexec/PlistBuddy -c "Set :LSApplicationCategoryType $APP_CATEGORY" "$plist" 2>/dev/null || \
            /usr/libexec/PlistBuddy -c "Add :LSApplicationCategoryType string $APP_CATEGORY" "$plist"
    fi
done

echo -e "${GREEN}✓ Xcode 项目配置完成${NC}"

# ============================================
# 5. 完成并打开 Xcode
# ============================================

echo ""
echo -e "${GREEN}[5/5] 准备打开 Xcode...${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Safari 扩展打包完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}自动完成的配置:${NC}"
echo "  ✓ 版本号: $VERSION"
echo "  ✓ 构建号: $BUILD"
echo "  ✓ macOS Deployment Target: $DEPLOYMENT_TARGET"
echo "  ✓ App Category: Utilities"
echo "  ✓ 无白边图标"
echo ""
echo -e "${YELLOW}需要在 Xcode 中手动完成:${NC}"
echo "  1. 为所有 Target 设置 Signing Team:"
echo "     → $TEAM_NAME"
echo "  2. Product → Archive 开始打包"
echo ""
echo -e "${BLUE}项目位置:${NC} $SAFARI_DIR/$PROJECT_NAME.xcodeproj"
echo ""

# 自动打开 Xcode
echo -e "${YELLOW}正在打开 Xcode...${NC}"
open "$XCODEPROJ"

echo ""
echo -e "${GREEN}完成！Xcode 已打开，请按照上述步骤完成签名和打包。${NC}"
echo ""
