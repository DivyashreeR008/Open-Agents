import { describe, it, expect } from 'vitest'
import {
  tokenizeFreeText,
  hasTerm,
  normalizeScore,
  scoreAgent,
  getMaxPossibleScore,
  recommendAgents,
} from './scoring.js'
import { buildRecommendationReasons } from './explanations.js'
import {
  DEFAULT_RECOMMENDATION_WEIGHTS,
  MIN_CONFIDENT_SCORE,
  RESULT_LIMIT,
  STOP_WORDS,
} from './constants.js'

describe('Recommendation Engine Test Suite (Issue #175)', () => {
  describe('hasTerm', () => {
    it('rejects keywords embedded inside unrelated words', () => {
      expect(hasTerm('rapid response', 'api')).toBe(false)
      expect(hasTerm('blog writer', 'log')).toBe(false)
      expect(hasTerm('javascript helper', 'script')).toBe(false)
      expect(hasTerm('latest release', 'test')).toBe(false)
    })

    it('matches whole terms, phrases, hyphen boundaries, and simple plurals', () => {
      expect(hasTerm('API design reviewer', 'api')).toBe(true)
      expect(hasTerm('blog-post-seo', 'blog')).toBe(true)
      expect(hasTerm('smart contract auditor', 'smart contract')).toBe(true)
      expect(hasTerm('incident reports', 'report')).toBe(true)
    })

    it('escapes technical punctuation and handles empty values', () => {
      expect(hasTerm('C++ and node.js tooling', 'c++')).toBe(true)
      expect(hasTerm('C++ and node.js tooling', 'node.js')).toBe(true)
      expect(hasTerm('nodeXjs tooling', 'node.js')).toBe(false)
      expect(hasTerm('', 'api')).toBe(false)
      expect(hasTerm('api', '')).toBe(false)
    })
  })

  // =========================================================================
  // 1. Tokenization: tokenizeFreeText
  // =========================================================================
  describe('tokenizeFreeText', () => {
    it('returns empty array for empty string, whitespace, null, or undefined', () => {
      expect(tokenizeFreeText('')).toEqual([])
      expect(tokenizeFreeText('   ')).toEqual([])
      expect(tokenizeFreeText(null)).toEqual([])
      expect(tokenizeFreeText(undefined)).toEqual([])
      expect(tokenizeFreeText()).toEqual([])
    })

    it('normalizes case and extracts valid words', () => {
      expect(tokenizeFreeText('BUILD A REACT COMPONENT')).toEqual(['build', 'react', 'component'])
    })

    it('preserves allowed technical punctuation (+, #, ., -)', () => {
      const tokens = tokenizeFreeText('C++ and Node.js with web-scraping')
      expect(tokens).toContain('c++')
      expect(tokens).toContain('node.js')
      expect(tokens).toContain('web-scraping')
    })

    it('splits on disallowed punctuation and delimiters', () => {
      const tokens = tokenizeFreeText('docker/kubernetes,python&fastapi!cloud;infra')
      expect(tokens).toEqual(['docker', 'kubernetes', 'python', 'fastapi', 'cloud', 'infra'])
    })

    it('filters out configured stop words using STOP_WORDS set', () => {
      // Test mixed valid tokens and actual stop words from STOP_WORDS
      const input = 'build docker container for the developer with please'
      const tokens = tokenizeFreeText(input)
      expect(tokens).toEqual(['build', 'docker', 'container', 'developer'])
      expect(tokens).not.toContain('for')
      expect(tokens).not.toContain('the')
      expect(tokens).not.toContain('with')
      expect(tokens).not.toContain('please')

      // Confirm all configured stop words (each length >= 3) are filtered
      const allStopWords = Array.from(STOP_WORDS).join(' ')
      expect(tokenizeFreeText(allStopWords)).toEqual([])
    })

    it('filters out short tokens of length 2 or less independently of stop words', () => {
      const tokens = tokenizeFreeText('run a bot in my db to do it')
      expect(tokens).toEqual(['run', 'bot'])
      // 'a', 'in', 'my', 'db', 'to', 'do', 'it' are all length <= 2
      expect(tokens).not.toContain('a')
      expect(tokens).not.toContain('in')
      expect(tokens).not.toContain('my')
      expect(tokens).not.toContain('db')
      expect(tokens).not.toContain('to')
      expect(tokens).not.toContain('do')
      expect(tokens).not.toContain('it')
    })

    it('enforces FREE_TEXT_TOKEN_LIMIT ceiling (12 tokens)', () => {
      const longInput = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen'
      const tokens = tokenizeFreeText(longInput)
      expect(tokens).toHaveLength(12)
      expect(tokens).toEqual([
        'one', 'two', 'three', 'four', 'five', 'six',
        'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
      ])
    })
  })

  // =========================================================================
  // 2. Score Normalization: normalizeScore
  // =========================================================================
  describe('normalizeScore', () => {
    it('scales normal fractional scores to rounded integers (0 - 100)', () => {
      expect(normalizeScore(50, 100)).toBe(50)
      expect(normalizeScore(100, 100)).toBe(100)
      expect(normalizeScore(25, 100)).toBe(25)
    })

    it('rounds standard fractions correctly using Math.round', () => {
      expect(normalizeScore(1, 3)).toBe(33) // 33.333% -> 33
      expect(normalizeScore(2, 3)).toBe(67) // 66.666% -> 67
      expect(normalizeScore(1, 200)).toBe(1) // 0.5% -> 1
      expect(normalizeScore(1, 400)).toBe(0) // 0.25% -> 0
    })

    it('strictly clamps scores exceeding maxScore to 100 (percentage ceiling)', () => {
      expect(normalizeScore(120, 100)).toBe(100)
      expect(normalizeScore(250, 50)).toBe(100)
    })

    it('returns 0 for zero or negative score values', () => {
      expect(normalizeScore(0, 100)).toBe(0)
      expect(normalizeScore(-10, 100)).toBe(0)
      expect(normalizeScore(-0.01, 100)).toBe(0)
    })

    it('returns 0 for zero or negative maxScore values (prevents division by zero)', () => {
      expect(normalizeScore(50, 0)).toBe(0)
      expect(normalizeScore(50, -100)).toBe(0)
      expect(normalizeScore(0, 0)).toBe(0)
    })

    it('returns 0 for invalid or non-finite inputs', () => {
      expect(normalizeScore(NaN, 100)).toBe(0)
      expect(normalizeScore(50, NaN)).toBe(0)
      expect(normalizeScore(Infinity, 100)).toBe(0)
      expect(normalizeScore(50, Infinity)).toBe(0)
      expect(normalizeScore(null, 100)).toBe(0)
      expect(normalizeScore(undefined, 100)).toBe(0)
      expect(normalizeScore('50', 100)).toBe(0) // String not coerced by Number.isFinite
      expect(normalizeScore(50, '100')).toBe(0)
    })
  })

  // =========================================================================
  // 3. Agent Scoring: scoreAgent and getMaxPossibleScore
  // =========================================================================
  describe('scoreAgent', () => {
    const baseAgent = {
      id: 'agent-devops-1',
      name: 'DeployBot',
      description: 'Automates cloud deployments and kubernetes pipelines.',
      category: 'DevOps',
      provider: 'openai',
    }

    it('returns score 0 and empty signal collections for a zero-signal agent', () => {
      const unrelatedAgent = {
        id: 'agent-cooking-1',
        name: 'ChefRecipe',
        description: 'Bakes cakes and prepares dinner.',
        category: 'Culinary',
        provider: 'custom',
      }
      const preferences = {
        primaryGoal: 'coding-development',
        categories: ['DevOps'],
        providerPreference: 'anthropic',
      }

      const result = scoreAgent(unrelatedAgent, preferences)
      expect(result.agentId).toBe('agent-cooking-1')
      expect(result.score).toBe(0)
      expect(result.matchedSignals.exactCategory).toBeUndefined()
      expect(result.matchedSignals.goalCategory).toBeUndefined()
      expect(result.matchedSignals.provider).toBeUndefined()
      expect(result.matchedSignals.taskTypes).toEqual([])
      expect(result.matchedSignals.capabilities).toEqual([])
      expect(result.matchedSignals.freeTextTerms).toEqual([])
    })

    it('awards exactCategory points (+30) when agent category matches preferences.categories', () => {
      const preferences = {
        primaryGoal: 'writing-content', // categories: Marketing, Productivity, Sales
        categories: ['DevOps'], // Explicit preference category match
      }
      const result = scoreAgent(baseAgent, preferences)
      expect(result.matchedSignals.exactCategory).toBe(true)
      expect(result.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.exactCategory) // 30
    })

    it('awards goalCategory points (+20) cleanly when agent category matches goal categories', () => {
      // Use an agent without task keywords in its text to isolate the goalCategory signal
      const idleDevOpsAgent = {
        id: 'agent-idle',
        name: 'SilentService',
        description: 'Standby worker instance.',
        category: 'DevOps',
      }
      const preferences = {
        primaryGoal: 'coding-development', // goal categories include 'DevOps'
        categories: [], // no explicit category match
      }
      const result = scoreAgent(idleDevOpsAgent, preferences)
      expect(result.matchedSignals.goalCategory).toBe(true)
      expect(result.matchedSignals.exactCategory).toBeUndefined()
      expect(result.matchedSignals.taskTypes).toEqual([])
      expect(result.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.goalCategory) // exactly 20
    })

    it('awards taskType points (+18 per task) when agent text matches task keywords', () => {
      const codeAgent = {
        id: 'agent-coder',
        name: 'CodeReviewer',
        description: 'Performs code review and quality checks.',
        category: 'Other',
        provider: 'any',
      }
      const preferences = {
        primaryGoal: 'coding-development', // taskTypes: code, debug, review, technical
        categories: [],
      }
      const result = scoreAgent(codeAgent, preferences)
      // Matches 'code' (from 'code') and 'review' (from 'review')
      expect(result.matchedSignals.taskTypes).toContain('code')
      expect(result.matchedSignals.taskTypes).toContain('review')
      expect(result.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.taskType * 2) // 18 * 2 = 36
    })

    it('awards capabilityKeyword points (+6) for extra preferences', () => {
      const toolAgent = {
        id: 'agent-tools',
        name: 'ToolMaster',
        description: 'Executes tools and external API workflows with structured JSON schemas.',
        category: 'Engineering',
        provider: 'openai',
      }
      const preferences = {
        extraPreferences: ['tool-calling', 'structured-output'],
      }
      const result = scoreAgent(toolAgent, preferences)
      expect(result.matchedSignals.capabilities).toContain('tool-calling')
      expect(result.matchedSignals.capabilities).toContain('structured-output')
      expect(result.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.capabilityKeyword * 2) // 6 * 2 = 12
    })

    it('handles provider matching: exact provider (+8), compatible provider (+4), and mismatch (+0)', () => {
      // 1. Exact provider match
      const exactResult = scoreAgent(baseAgent, { providerPreference: 'openai' })
      expect(exactResult.matchedSignals.provider).toBe('exact')
      expect(exactResult.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.providerExact) // 8

      // 2. Compatible ('any' provider) match
      const flexibleAgent = { ...baseAgent, provider: 'any' }
      const compatibleResult = scoreAgent(flexibleAgent, { providerPreference: 'anthropic' })
      expect(compatibleResult.matchedSignals.provider).toBe('compatible')
      expect(compatibleResult.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.providerAny) // 4

      // 3. Provider mismatch
      const mismatchResult = scoreAgent(baseAgent, { providerPreference: 'anthropic' })
      expect(mismatchResult.matchedSignals.provider).toBeUndefined()
      expect(mismatchResult.score).toBe(0)

      // 4. Provider preference is 'any' -> no bonus
      const anyPrefResult = scoreAgent(baseAgent, { providerPreference: 'any' })
      expect(anyPrefResult.matchedSignals.provider).toBeUndefined()
      expect(anyPrefResult.score).toBe(0)
    })

    it('awards freeTextName (+10) vs freeTextDescription (+5)', () => {
      // Name match
      const nameMatchResult = scoreAgent(baseAgent, { freeTextGoal: 'deploybot' })
      expect(nameMatchResult.matchedSignals.freeTextTerms).toContain('deploybot')
      expect(nameMatchResult.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.freeTextName) // 10

      // Description-only match
      const descMatchResult = scoreAgent(baseAgent, { freeTextGoal: 'pipelines' })
      expect(descMatchResult.matchedSignals.freeTextTerms).toContain('pipelines')
      expect(descMatchResult.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.freeTextDescription) // 5
    })

    it('awards experience points (+3) for beginner and advanced guidance preferences', () => {
      const beginnerAgent = {
        id: 'agent-guide',
        name: 'StepGuidance',
        description: 'A friendly step-by-step explainer and checklist creator.',
      }
      const advancedAgent = {
        id: 'agent-pro',
        name: 'CloudArch',
        description: 'Deep architecture and kubernetes cluster optimization.',
      }

      const beginnerRes = scoreAgent(beginnerAgent, { experienceLevel: 'beginner' })
      expect(beginnerRes.matchedSignals.experience).toBe('beginner')
      expect(beginnerRes.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.experience) // 3

      const advancedRes = scoreAgent(advancedAgent, { experienceLevel: 'advanced' })
      expect(advancedRes.matchedSignals.experience).toBe('advanced')
      expect(advancedRes.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.experience) // 3

      // 'any' experience adds 0
      const anyExpRes = scoreAgent(beginnerAgent, { experienceLevel: 'any' })
      expect(anyExpRes.matchedSignals.experience).toBeUndefined()
      expect(anyExpRes.score).toBe(0)
    })

    it('characterizes intermediate guidance preference matching beginner terms', () => {
      // Production quirk: preferences.experienceLevel === 'advanced' ? advancedTerms : beginnerTerms
      // When experienceLevel is 'intermediate', it matches beginner terms in implementation.
      const beginnerAgent = {
        id: 'agent-guide',
        name: 'StepGuidance',
        description: 'A friendly step-by-step explainer and checklist creator.',
      }
      const intermediateRes = scoreAgent(beginnerAgent, { experienceLevel: 'intermediate' })
      expect(intermediateRes.matchedSignals.experience).toBe('intermediate')
      expect(intermediateRes.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.experience) // 3
    })

    it('awards urgency points (+3) for fast vs capable budget preferences', () => {
      const fastAgent = {
        id: 'agent-quick',
        name: 'QuickSummarizer',
        description: 'Provides rapid summary and regex generator.',
      }
      const capableAgent = {
        id: 'agent-deep',
        name: 'DeepAudit',
        description: 'Comprehensive code audit, architecture, and plan report.',
      }

      const fastRes = scoreAgent(fastAgent, { budgetPreference: 'fast' })
      expect(fastRes.matchedSignals.preference).toBe('fast')
      expect(fastRes.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.urgency) // 3

      const capableRes = scoreAgent(capableAgent, { budgetPreference: 'capable' })
      expect(capableRes.matchedSignals.preference).toBe('capable')
      expect(capableRes.score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.urgency) // 3

      // 'balanced' or 'any' adds 0
      const balancedRes = scoreAgent(fastAgent, { budgetPreference: 'balanced' })
      expect(balancedRes.matchedSignals.preference).toBeUndefined()
      expect(balancedRes.score).toBe(0)
    })

    it('accumulates composite score across all active signals', () => {
      const fullAgent = {
        id: 'agent-full',
        name: 'FullStackDeployer',
        description: 'Complete kubernetes architecture, automated pipelines, with tool calling and structured json reports.',
        category: 'Engineering',
        provider: 'anthropic',
      }
      const preferences = {
        primaryGoal: 'coding-development',
        categories: ['Engineering'],
        extraPreferences: ['tool-calling', 'structured-output'],
        providerPreference: 'anthropic',
        freeTextGoal: 'fullstackdeployer',
        experienceLevel: 'advanced',
        budgetPreference: 'capable',
      }

      const result = scoreAgent(fullAgent, preferences)
      // exactCategory (30) + goalCategory (20)
      // taskTypes: 'code' (kubernetes matches code keyword) + 'technical' (architecture) = 18 * 2 = 36
      // capabilities: tool-calling (6) + structured-output (6) = 12
      // provider: exact (8)
      // freeText: name match 'fullstackdeployer' (10)
      // experience: advanced (3)
      // urgency: capable (3)
      // Total expected = 30 + 20 + 36 + 12 + 8 + 10 + 3 + 3 = 122
      expect(result.score).toBe(122)
      expect(result.matchedSignals.exactCategory).toBe(true)
      expect(result.matchedSignals.goalCategory).toBe(true)
      expect(result.matchedSignals.taskTypes).toEqual(['code', 'technical'])
      expect(result.matchedSignals.capabilities).toEqual(['tool-calling', 'structured-output'])
      expect(result.matchedSignals.provider).toBe('exact')
      expect(result.matchedSignals.experience).toBe('advanced')
      expect(result.matchedSignals.preference).toBe('capable')
    })

    it('respects custom weight overrides', () => {
      const customWeights = {
        ...DEFAULT_RECOMMENDATION_WEIGHTS,
        exactCategory: 100,
        providerExact: 50,
      }
      const preferences = {
        categories: ['DevOps'],
        providerPreference: 'openai',
      }
      const result = scoreAgent(baseAgent, preferences, customWeights)
      expect(result.score).toBe(150) // 100 + 50
    })

    it('handles empty or undefined agent objects safely in scoreAgent', () => {
      expect(() => scoreAgent({})).not.toThrow()
      expect(() => scoreAgent(undefined)).not.toThrow()

      const res = scoreAgent({})
      expect(res.score).toBe(0)
      expect(res.agentId).toBeUndefined()
    })

    it('characterizes internal scoreAgent(null) behavior when called directly', () => {
      // Calling internal scoreAgent(null) throws a TypeError because searchableText
      // accesses agent.id directly without nullish coalescing.
      // (Public caller recommendAgents shields this boundary by filtering falsy agents).
      expect(() => scoreAgent(null)).toThrow(TypeError)
    })
  })

  describe('getMaxPossibleScore', () => {
    it('calculates the theoretical maximum score from the preferences that were actually chosen', () => {
      const preferences = {
        primaryGoal: 'coding-development', // 4 taskTypes
        categories: ['Engineering'],
        extraPreferences: ['tool-calling', 'vision-support'], // 2 extras
        providerPreference: 'openai',
        freeTextGoal: 'build fast web app', // 4 tokens: 'build', 'fast', 'web', 'app'
        experienceLevel: 'beginner',
        budgetPreference: 'fast',
      }
      // exactCategory (30) + goalCategory (20) + 4 * taskType (18*4=72)
      // + 2 * capabilityKeyword (6*2=12) + providerExact (8)
      // + freeTextName * 4 (10*4=40) + experience (3) + urgency (3)
      // Total = 30 + 20 + 72 + 12 + 8 + 40 + 3 + 3 = 188
      const maxScore = getMaxPossibleScore(preferences)
      expect(maxScore).toBe(188)
    })

    it('does not count weights whose preference is absent or set to any', () => {
      expect(getMaxPossibleScore({})).toBe(0)
      expect(
        getMaxPossibleScore({
          categories: ['Engineering'],
          providerPreference: 'any',
          experienceLevel: 'any',
          budgetPreference: 'balanced',
        })
      ).toBe(30)
    })

    it('counts goal categories and task types without requiring a category selection', () => {
      expect(getMaxPossibleScore({ primaryGoal: 'coding-development' })).toBe(92)
    })
  })

  // =========================================================================
  // 4. Recommendation Ranking and Public Boundary: recommendAgents
  // =========================================================================
  describe('recommendAgents', () => {
    const agentsList = [
      { id: 'agent-1', name: 'Alpha Agent', category: 'DevOps', provider: 'openai', description: 'kubernetes pipeline' },
      { id: 'agent-2', name: 'Beta Agent', category: 'Design', provider: 'anthropic', description: 'visual design' },
      { id: 'agent-3', name: 'Gamma Agent', category: 'Engineering', provider: 'gemini', description: 'code review' },
    ]

    it('returns empty array when agents array is empty, null, or undefined', () => {
      expect(recommendAgents([])).toEqual([])
      expect(recommendAgents(null)).toEqual([])
      expect(recommendAgents(undefined)).toEqual([])
      expect(recommendAgents('invalid')).toEqual([])
    })

    it('public boundary safely filters null, undefined, or missing id agent entries', () => {
      const mixedAgents = [
        null,
        undefined,
        { name: 'No ID Agent' },
        { id: 'valid-agent', name: 'Valid Agent', category: 'Engineering' },
      ]
      const results = recommendAgents(mixedAgents, { categories: ['Engineering'] })
      expect(results).toHaveLength(1)
      expect(results[0].agentId).toBe('valid-agent')
    })

    it('deduplicates duplicate agents by id', () => {
      const duplicates = [
        { id: 'dup-1', name: 'Agent 1', category: 'DevOps' },
        { id: 'dup-1', name: 'Agent 1 Clone', category: 'DevOps' },
      ]
      const results = recommendAgents(duplicates, { categories: ['DevOps'] })
      expect(results).toHaveLength(1)
      expect(results[0].agentId).toBe('dup-1')
    })

    it('drops entries that matched no signal instead of filling the ranking', () => {
      const results = recommendAgents(agentsList, { categories: ['DevOps'] })
      expect(results.map((result) => result.agentId)).toEqual(['agent-1'])

      expect(recommendAgents(agentsList, {})).toEqual([])
    })

    it('can report a perfect match as one hundred percent', () => {
      const preferences = {
        primaryGoal: 'coding-development',
        categories: ['Engineering'],
        extraPreferences: ['tool-calling', 'vision-support'],
        providerPreference: 'openai',
        freeTextGoal: 'build fast web app',
        experienceLevel: 'beginner',
        budgetPreference: 'fast',
      }
      const agent = {
        id: 'perfect-match',
        name: 'build fast web app',
        category: 'Engineering',
        provider: 'openai',
        description: 'code debug review technical tool calling vision guide summary',
      }

      const [result] = recommendAgents([agent], preferences)

      expect(result.score).toBe(getMaxPossibleScore(preferences))
      expect(result.matchPercentage).toBe(100)
      expect(result.isConfident).toBe(true)
    })

    describe('Confidence threshold boundary', () => {
      it('requires more than one task-type hit before the list is confident', () => {
        expect(MIN_CONFIDENT_SCORE).toBeGreaterThan(DEFAULT_RECOMMENDATION_WEIGHTS.taskType)
        const taskOnly = {
          id: 'task-only',
          name: 'Incident Helper',
          category: 'Other',
          description: 'Handles incident reports.',
        }

        const results = recommendAgents([taskOnly], { primaryGoal: 'coding-development' })

        expect(results[0].score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.taskType)
        expect(results[0].isConfident).toBe(false)
      })

      it('marks a direct category match as confident', () => {
        const agent = { id: 'category-match', name: 'Category Match', category: 'DevOps' }

        const results = recommendAgents([agent], { categories: ['DevOps'] })

        expect(results[0].score).toBe(DEFAULT_RECOMMENDATION_WEIGHTS.exactCategory)
        expect(results[0].isConfident).toBe(true)
      })

      it('allows overriding minScore option', () => {
        const agent = { id: 'a-1', name: 'Agent One', category: 'DevOps' }
        // exactCategory score = 30
        const confidentDefault = recommendAgents([agent], { categories: ['DevOps'] })
        expect(confidentDefault[0].isConfident).toBe(true)

        const nonConfidentCustom = recommendAgents([agent], { categories: ['DevOps'] }, { minScore: 50 })
        expect(nonConfidentCustom[0].isConfident).toBe(false)
      })
    })

    describe('Deterministic 4-level sorting tie-breakers', () => {
      it('Level 1: sorts higher scores before lower scores', () => {
        const higher = { id: 'high', name: 'High', category: 'DevOps' } // score 30
        const lower = { id: 'low', name: 'Low', category: 'Other', provider: 'openai' } // score 8
        const results = recommendAgents([lower, higher], { categories: ['DevOps'], providerPreference: 'openai' })
        expect(results[0].agentId).toBe('high')
        expect(results[1].agentId).toBe('low')
      })

      it('Level 2: breaks score ties by preferring exactCategory match', () => {
        const agentA = { id: 'agent-a', name: 'Category Matcher', category: 'TargetCategory' }
        const agentB = {
          id: 'agent-b',
          name: 'Task Matcher',
          category: 'OtherCategory',
          description: 'code tool calling fast',
        }

        const prefs = {
          categories: ['TargetCategory'],
          primaryGoal: 'coding-development', // code task = 18
          extraPreferences: ['tool-calling', 'fast-responses'], // 6 + 6 = 12
        }

        // Agent A: categories.includes('TargetCategory') => +30 (exactCategory: true)
        // Agent B: no exactCategory, task code (+18) + tool calling (+6) + fast (+6) = 30
        const results = recommendAgents([agentB, agentA], prefs)
        expect(results[0].score).toBe(30)
        expect(results[1].score).toBe(30)
        expect(results[0].matchedSignals.exactCategory).toBe(true)
        expect(results[1].matchedSignals.exactCategory).toBeUndefined()
        expect(results[0].agentId).toBe('agent-a')
        expect(results[1].agentId).toBe('agent-b')
      })

      it('Level 3: breaks equal score and category ties by preferring provider match', () => {
        // Agent A: provider 'openai' (+8) => score 8, provider: 'exact'
        // Agent B: description freeText 'deploy' (+5) + experience (+3) => score 8, provider: none
        // Alphabetically, 'FreeText Agent' comes before 'Provider Agent' ('F' < 'P'),
        // so Agent A ranking first proves Level 3 tie-breaker broke the tie.
        const agentA = { id: 'agent-a', name: 'Provider Agent', provider: 'openai', category: 'CatX' }
        const agentB = { id: 'agent-b', name: 'FreeText Agent', provider: 'other', category: 'CatX', description: 'deploy guide' }

        const prefs = {
          providerPreference: 'openai',
          freeTextGoal: 'deploy',
          experienceLevel: 'beginner',
        }

        const results = recommendAgents([agentB, agentA], prefs)
        expect(results[0].score).toBe(8)
        expect(results[1].score).toBe(8)
        expect(results[0].matchedSignals.provider).toBe('exact')
        expect(results[1].matchedSignals.provider).toBeUndefined()
        expect(results[0].agentId).toBe('agent-a')
        expect(results[1].agentId).toBe('agent-b')
      })

      it('Level 4: breaks all equal signals alphabetically by agent name', () => {
        const agentZ = { id: 'agent-z', name: 'Zeta Agent', category: 'Common' }
        const agentA = { id: 'agent-a', name: 'Alpha Agent', category: 'Common' }
        const agentM = { id: 'agent-m', name: 'Beta Agent', category: 'Common' }

        const results = recommendAgents([agentZ, agentA, agentM], { categories: ['Common'] })
        expect(results.map((r) => r.agentId)).toEqual(['agent-a', 'agent-m', 'agent-z'])
      })
    })

    it('enforces RESULT_LIMIT default (10) and custom options.limit', () => {
      const agents = Array.from({ length: 15 }, (_, i) => ({
        id: `agent-${i + 1}`,
        name: `Agent ${String(i + 1).padStart(2, '0')}`,
        category: 'Engineering',
      }))

      // Default limit 10
      const defaultResults = recommendAgents(agents, { categories: ['Engineering'] })
      expect(defaultResults).toHaveLength(RESULT_LIMIT)

      // Custom limit 3
      const customResults = recommendAgents(agents, { categories: ['Engineering'] }, { limit: 3 })
      expect(customResults).toHaveLength(3)
    })

    it('calculates valid matchPercentage clamped within [0, 100]', () => {
      const results = recommendAgents(agentsList, { categories: ['DevOps'] })
      results.forEach((r) => {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0)
        expect(r.matchPercentage).toBeLessThanOrEqual(100)
      })
    })

    it('returns result objects conforming to expected schema without leaking agent reference', () => {
      const results = recommendAgents(agentsList, { categories: ['DevOps'] })
      expect(results.length).toBeGreaterThan(0)
      const first = results[0]
      expect(first).toHaveProperty('agentId')
      expect(first).toHaveProperty('score')
      expect(first).toHaveProperty('matchedSignals')
      expect(first).toHaveProperty('reasons')
      expect(first).toHaveProperty('isConfident')
      expect(first).toHaveProperty('matchPercentage')
      expect(first).not.toHaveProperty('agent')
    })
  })

  // =========================================================================
  // 5. Explanation Integrity: buildRecommendationReasons
  // =========================================================================
  describe('buildRecommendationReasons', () => {
    const defaultAgent = {
      id: 'agent-test',
      name: 'TestAgent',
      category: 'Engineering',
      description: 'Test agent description.',
      provider: 'openai',
    }

    it('generates primary goal reason when exactCategory or goalCategory or taskTypes match', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        { primaryGoal: 'coding-development' },
        { exactCategory: true }
      )
      expect(reasons).toContain('Matches your coding and development workflow.')
    })

    it('generates fallback workflow reason when primaryGoal is unknown but category matches', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        { primaryGoal: 'unknown-goal-id' },
        { exactCategory: true }
      )
      expect(reasons).toContain('Matches your selected workflow.')
    })

    it('generates related goalCategory explanation when goalCategory matched', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        { primaryGoal: 'coding-development' },
        { goalCategory: true }
      )
      expect(reasons).toContain('Listed in Engineering, a category related to this goal.')
    })

    it('generates specific task type explanations for matched task types', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        {},
        { taskTypes: ['code', 'debug'] }
      )
      expect(reasons).toContain('Its metadata relates to coding tasks.')
      expect(reasons).toContain('Its stated focus includes debugging or troubleshooting.')
    })

    it('generates capability preference explanations for matched extra preferences', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        {},
        { capabilities: ['tool-calling', 'vision-support'] }
      )
      expect(reasons).toContain('Its metadata suggests relevance to your tool calling preference.')
      expect(reasons).toContain('Its metadata suggests relevance to your vision support preference.')
    })

    it('generates exact provider explanation when provider is exact', () => {
      const reasons = buildRecommendationReasons(defaultAgent, {}, { provider: 'exact' })
      expect(reasons).toContain('Aligns with your preferred provider.')
    })

    it('generates compatible provider explanation when provider is compatible', () => {
      const reasons = buildRecommendationReasons(defaultAgent, {}, { provider: 'compatible' })
      expect(reasons).toContain('Uses flexible provider metadata compatible with your preference.')
    })

    it('generates free-text terms explanation listing at most 3 matched terms', () => {
      const reasons = buildRecommendationReasons(
        defaultAgent,
        {},
        { freeTextTerms: ['docker', 'deploy', 'kubernetes', 'extra-term'] }
      )
      expect(reasons).toContain('Matched terms from your goal: docker, deploy, kubernetes.')
    })

    it('generates fast budget preference explanation in isolation', () => {
      const reasons = buildRecommendationReasons(defaultAgent, {}, { preference: 'fast' })
      expect(reasons).toContain('Its focused scope aligns with your fast, lightweight preference.')
    })

    it('generates capable budget preference explanation in isolation', () => {
      const reasons = buildRecommendationReasons(defaultAgent, {}, { preference: 'capable' })
      expect(reasons).toContain('Its detailed scope aligns with your capability preference.')
    })

    it('generates experience guidance explanation in isolation', () => {
      const beginnerReasons = buildRecommendationReasons(defaultAgent, {}, { experience: 'beginner' })
      expect(beginnerReasons).toContain('Its metadata aligns with your beginner guidance preference.')

      const advancedReasons = buildRecommendationReasons(defaultAgent, {}, { experience: 'advanced' })
      expect(advancedReasons).toContain('Its metadata aligns with your advanced guidance preference.')
    })

    it('does not pad a short reason list with generic metadata claims', () => {
      const customAgent = { id: 'a1', category: 'Productivity', description: 'A productivity helper.' }
      const reasons = buildRecommendationReasons(customAgent, {}, { provider: 'exact' })

      expect(reasons).toEqual(['Aligns with your preferred provider.'])
      expect(reasons).not.toContain('Agent metadata identifies its focus as Productivity.')
      expect(reasons).not.toContain('Its published description is relevant to the selected workflow.')
    })

    it('deduplicates and limits reasons to maximum of 4', () => {
      const agent = { id: 'a1', category: 'Engineering', description: 'Desc' }
      const matchedSignals = {
        exactCategory: true,
        goalCategory: true,
        taskTypes: ['code', 'debug', 'review', 'technical'],
        capabilities: ['tool-calling'],
        provider: 'exact',
      }
      const reasons = buildRecommendationReasons(agent, { primaryGoal: 'coding-development' }, matchedSignals)
      expect(reasons).toHaveLength(4)
      const uniqueReasons = new Set(reasons)
      expect(uniqueReasons.size).toBe(reasons.length)
    })
  })

  // =========================================================================
  // 6. Characterization Tests for Known Defects (Issue #175)
  // These tests pin and document existing production behavior for known defects
  // cited in Issue #175 (keyword matching, invented explanations) awaiting
  // future product-level fixes, without endorsing them as intended specifications.
  // =========================================================================
  describe('Characterization Tests for Known Defects (Issue #175)', () => {
    it('Defect Characterization 1: two-letter technical acronyms (ai, ml, go, js, db, c#) are dropped by token.length > 2 filter', () => {
      // Documenting existing behavior for known defect around keyword matching in Issue #175.
      // In an AI/dev agent registry, two-letter technical keywords are critical, but
      // tokenizeFreeText currently drops them because of the `token.length > 2` check.
      const query = 'AI agent in Go with DB for ML and C#'
      const tokens = tokenizeFreeText(query)
      // 'ai', 'go', 'db', 'ml', 'c#' dropped by length <= 2; 'agent', 'with', 'for', 'and' dropped as stop words.
      expect(tokens).toEqual([])

      // Conversely, 3-character token 'c++' is preserved while 2-character 'c#' is dropped
      expect(tokenizeFreeText('c++ c#')).toEqual(['c++'])
    })

    it('Explanation integrity: an agent with no matched signals carries no justification', () => {
      const unrelatedAgent = {
        id: 'zero-1',
        name: 'PastryChef',
        category: 'Culinary',
        description: 'Bakes artisan croissants and pastries.',
      }
      const preferences = {
        primaryGoal: 'coding-development',
      }
      const zeroSignals = {
        taskTypes: [],
        capabilities: [],
        freeTextTerms: [],
      }

      expect(buildRecommendationReasons(unrelatedAgent, preferences, zeroSignals)).toEqual([])
    })

    it('Boundary Pin 3: Normalization clamping strictly at 100% (percentage ceiling)', () => {
      // Documenting normalizeScore percentage ceiling pinning
      expect(normalizeScore(999, 100)).toBe(100)
      expect(normalizeScore(100, 100)).toBe(100)
    })

    it('Boundary Pin 4: Zero and negative denominator in normalizeScore safely returns 0', () => {
      expect(normalizeScore(100, 0)).toBe(0)
      expect(normalizeScore(100, -50)).toBe(0)
      expect(normalizeScore(-10, -50)).toBe(0)
    })
  })
})
