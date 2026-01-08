#!/bin/bash

# Safari Extension One-Click Packaging Script
# Automatically completes all steps from build to Xcode project configuration
# Called automatically by pnpm build:safari

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Configuration
SAFARI_DIR="$HOME/desktop/safari"
PROJECT_NAME="小黑 OmniBox for Safari"
TEAM_ID="SWWN7SR369"
TEAM_NAME="Hangzhou Xiaohei Intelligent Technology Co. Ltd"
DEPLOYMENT_TARGET="13.5"
BUNDLE_ID="pro.omnibox.safari"
APP_CATEGORY="public.app-category.utilities"

# ============================================
# Read version and generate build number
# ============================================

# Read version from dist/manifest.json
if [ ! -f "./dist/manifest.json" ]; then
    echo -e "${RED}Error: dist/manifest.json not found, please run pnpm build:safari first${NC}"
    exit 1
fi

VERSION=$(node -p "require('./dist/manifest.json').version")

# Auto-generate build number based on git commit count
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Current directory is not a git repository, cannot generate build number${NC}"
    echo -e "${YELLOW}Please run this command in a git repository${NC}"
    exit 1
fi

BUILD=$(git rev-list --count HEAD)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Safari Extension Auto Packaging${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Version:${NC} $VERSION (from manifest.json)"
echo -e "${YELLOW}Build:${NC} $BUILD (based on git commits)"
echo ""

# ============================================
# 1. Generate Safari extension project
# ============================================

echo -e "${GREEN}[1/4] Generating Safari extension project...${NC}"

# Clean old project
if [ -d "$SAFARI_DIR" ]; then
    rm -rf "$SAFARI_DIR"
fi

# Generate project without --app-icon (not supported)
xcrun safari-web-extension-packager \
    --app-name "$PROJECT_NAME" \
    --bundle-identifier pro.omnibox.safari \
    --macos-only \
    --project-location ~/desktop/safari \
    ./dist

echo -e "${GREEN}✓ Safari extension project created${NC}"

# ============================================
# 2. Replace with custom icons
# ============================================

echo ""
echo -e "${GREEN}[2/4] Replacing with custom icons...${NC}"

SOURCE_ICON="./scripts/safari-icon.png"
XCODE_ICON_DIR="$SAFARI_DIR/$PROJECT_NAME/$PROJECT_NAME/Assets.xcassets/AppIcon.appiconset"

if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${RED}Error: Source icon not found $SOURCE_ICON${NC}"
    exit 1
fi

if [ -d "$XCODE_ICON_DIR" ]; then
    # Generate icons directly in Xcode project (silent output)
    for size in 16 32 64 128 256 512 1024; do
        sips -z $size $size "$SOURCE_ICON" --out "$XCODE_ICON_DIR/mac-icon-${size}@1x.png" > /dev/null 2>&1
        double_size=$((size * 2))
        sips -z $double_size $double_size "$SOURCE_ICON" --out "$XCODE_ICON_DIR/mac-icon-${size}@2x.png" > /dev/null 2>&1
    done
    echo -e "${GREEN}✓ Replaced with custom icons (no white border)${NC}"
else
    echo -e "${YELLOW}⚠ Warning: AppIcon directory not found${NC}"
fi

# ============================================
# 3. Configure Xcode project
# ============================================

echo ""
echo -e "${GREEN}[3/4] Configuring Xcode project...${NC}"

XCODEPROJ="$SAFARI_DIR/$PROJECT_NAME/$PROJECT_NAME.xcodeproj"
PBXPROJ="$XCODEPROJ/project.pbxproj"

if [ ! -f "$PBXPROJ" ]; then
    echo -e "${RED}Error: Xcode project file not found${NC}"
    exit 1
fi

# Backup
cp "$PBXPROJ" "$PBXPROJ.backup"

# Modify project.pbxproj settings
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS Deployment Target
    sed -i '' "s/MACOSX_DEPLOYMENT_TARGET = [0-9.]*;/MACOSX_DEPLOYMENT_TARGET = $DEPLOYMENT_TARGET;/g" "$PBXPROJ"

    # Marketing Version (Version String)
    sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PBXPROJ"

    # Current Project Version (Build Number)
    sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD;/g" "$PBXPROJ"

    # Bundle Identifier - fix the auto-generated one
    sed -i '' "s/PRODUCT_BUNDLE_IDENTIFIER = \"pro.omnibox.---OmniBox-for-Safari\";/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID;/g" "$PBXPROJ"
    sed -i '' "s/PRODUCT_BUNDLE_IDENTIFIER = [^;]*---[^;]*;/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID;/g" "$PBXPROJ"

    # Add Development Team (only for main app target sections)
    # This adds DEVELOPMENT_TEAM right after CODE_SIGN_STYLE = Automatic;
    sed -i '' "/CODE_SIGN_STYLE = Automatic;/a\\
		DEVELOPMENT_TEAM = $TEAM_ID;
" "$PBXPROJ"

    # Add App Category (only appears in main app sections)
    # This adds the key after INFOPLIST_KEY_CFBundleDisplayName
    sed -i '' "/INFOPLIST_KEY_CFBundleDisplayName = /a\\
				INFOPLIST_KEY_LSApplicationCategoryType = \"$APP_CATEGORY\";
" "$PBXPROJ"
else
    # Linux sed syntax (if needed)
    sed -i "s/MACOSX_DEPLOYMENT_TARGET = [0-9.]*;/MACOSX_DEPLOYMENT_TARGET = $DEPLOYMENT_TARGET;/g" "$PBXPROJ"
    sed -i "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PBXPROJ"
    sed -i "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD;/g" "$PBXPROJ"
    sed -i "s/PRODUCT_BUNDLE_IDENTIFIER = \"pro.omnibox.---OmniBox-for-Safari\";/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID;/g" "$PBXPROJ"
    sed -i "s/PRODUCT_BUNDLE_IDENTIFIER = [^;]*---[^;]*;/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID;/g" "$PBXPROJ"
fi

# Clean up Info.plist files (remove converter version info)
find "$SAFARI_DIR" -name "Info.plist" -type f | while read -r plist; do
    /usr/libexec/PlistBuddy -c "Delete :SFSafariWebExtensionConverterVersion" "$plist" 2>/dev/null || true
done

echo -e "${GREEN}✓ Xcode project configured${NC}"

# ============================================
# 4. Complete and open Xcode
# ============================================

echo ""
echo -e "${GREEN}[4/4] Preparing to open Xcode...${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Safari extension packaging complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Automatically completed configurations:${NC}"
echo "  ✓ Version: $VERSION"
echo "  ✓ Build: $BUILD"
echo "  ✓ Bundle Identifier: $BUNDLE_ID"
echo "  ✓ Development Team: $TEAM_NAME ($TEAM_ID)"
echo "  ✓ macOS Deployment Target: $DEPLOYMENT_TARGET"
echo "  ✓ App Category: $APP_CATEGORY"
echo "  ✓ Custom icons (no white border)"
echo ""
echo -e "${YELLOW}Next steps in Xcode:${NC}"
echo "  1. Verify signing settings (should be auto-configured)"
echo "  2. Product → Archive to start packaging"
echo ""
echo -e "${BLUE}Project location:${NC} $SAFARI_DIR/$PROJECT_NAME.xcodeproj"
echo ""

# Auto open Xcode
echo -e "${YELLOW}Opening Xcode...${NC}"
open "$XCODEPROJ"

echo ""
echo -e "${GREEN}Done! Xcode has opened, please follow the steps above to complete signing and packaging.${NC}"
echo ""
