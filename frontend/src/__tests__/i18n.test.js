/**
 * Tests for frontend i18n dictionary completeness and quality.
 *
 * Principles:
 * - EN and ZH dictionaries must have the same keys (no missing translations)
 * - All values should be non-empty strings
 * - No hardcoded "Gemini" references (should use generic provider names)
 */
import { describe, it, expect } from 'vitest'
import { translations } from '../i18n.js'

const { en, zh } = translations

describe('i18n translations', () => {
  const enKeys = Object.keys(en)
  const zhKeys = Object.keys(zh)

  it('should have both en and zh dictionaries', () => {
    expect(en).toBeDefined()
    expect(zh).toBeDefined()
  })

  it('should have the same keys in both languages', () => {
    const missingInZh = enKeys.filter(k => !zhKeys.includes(k))
    const missingInEn = zhKeys.filter(k => !enKeys.includes(k))

    expect(missingInZh).toEqual([])
    expect(missingInEn).toEqual([])
  })

  it('should have the same number of keys', () => {
    expect(enKeys.length).toBe(zhKeys.length)
  })

  it('all EN values should be non-empty strings', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('all ZH values should be non-empty strings', () => {
    for (const [key, value] of Object.entries(zh)) {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('should not contain hardcoded "Gemini" in user-facing strings', () => {
    const geminiKeys = []
    for (const [key, value] of Object.entries(en)) {
      if (typeof value === 'string' && value.toLowerCase().includes('gemini')) {
        // Allow apiKeyStep* (guide steps) to mention provider names
        if (!key.startsWith('apiKeyStep')) {
          geminiKeys.push(key)
        }
      }
    }
    expect(geminiKeys).toEqual([])
  })

  it('bilingual toggle should use "second language" not "Chinese"', () => {
    // EN: should not say "Chinese"
    expect(en.bilingualTitle?.toLowerCase()).not.toContain('chinese')
    expect(en.bilingualDesc?.toLowerCase()).not.toContain('chinese')
    // ZH: should not say "中文翻译"
    expect(zh.bilingualDesc).not.toContain('中文翻译')
  })

  it('should have at least 50 translation keys', () => {
    expect(enKeys.length).toBeGreaterThanOrEqual(50)
  })
})
