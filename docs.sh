#!/bin/bash

echo "🚀 Yurba.js Documentation Generator"
echo "=================================="

case "$1" in
  "build")
    echo "📚 Building documentation..."
    pnpm run docs
    echo "✅ Documentation built successfully!"
    ;;
  "serve")
    echo "🌐 Starting documentation server..."
    pnpm run docs:serve
    ;;
  "clean")
    echo "🧹 Cleaning documentation..."
    pnpm run docs:clean
    echo "✅ Documentation cleaned!"
    ;;
  "watch")
    echo "👀 Watching for changes..."
    pnpm run docs:watch
    ;;
  *)
    echo "Usage: ./docs.sh [build|serve|clean|watch]"
    echo ""
    echo "Commands:"
    echo "  build  - Generate documentation"
    echo "  serve  - Build and serve documentation"
    echo "  clean  - Remove generated documentation"
    echo "  watch  - Watch for changes and rebuild"
    ;;
esac