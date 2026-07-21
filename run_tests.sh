#!/bin/bash
# run_tests.sh — Run all backend and frontend tests
#
# Usage: ./run_tests.sh
# Exit code: 0 = all passed, non-zero = some failed
#
# Backend tests: pytest (Python unit + integration tests)
# Frontend tests: Vitest (i18n dictionary validation)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "  Resume-to-Website Test Suite"
echo "=========================================="
echo ""

# ── Backend Tests ──────────────────────────────────────────
echo "--- Backend Tests (pytest) ---"
cd "$SCRIPT_DIR/backend"
./venv/bin/python -m pytest tests/ -v --tb=short
echo ""
echo "✓ Backend tests passed"
echo ""

# ── Frontend Tests ─────────────────────────────────────────
echo "--- Frontend Tests (Vitest) ---"
cd "$SCRIPT_DIR/frontend"
npx vitest run
echo ""
echo "✓ Frontend tests passed"
echo ""

echo "=========================================="
echo "  ALL TESTS PASSED"
echo "=========================================="
