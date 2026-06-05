import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getActiveModels } from './client'
import { getSDKClient } from './sdk'

vi.mock('./sdk', () => ({
  getSDKClient: vi.fn(),
  unwrap: vi.fn((data: unknown) => data),
}))

vi.mock('../utils/directoryUtils', () => ({
  formatPathForApi: vi.fn((path: unknown) => path),
}))

describe('getActiveModels', () => {
  const mockSdkClient = {
    config: {
      providers: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getSDKClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSdkClient)
  })

  it('should override supportsImages for known multimodal models when backend reports false', async () => {
    mockSdkClient.config.providers.mockResolvedValue({
      providers: [
        {
          id: 'test-provider',
          name: 'Test Provider',
          models: {
            'gemini-3.1-pro-preview': {
              id: 'gemini-3.1-pro-preview',
              status: 'active',
              limit: { context: 1000, output: 1000 },
              capabilities: {
                reasoning: false,
                input: {
                  image: false,
                  pdf: false,
                  audio: false,
                  video: false,
                },
                toolcall: false,
              },
            },
            'gpt-4o-mini': {
              id: 'gpt-4o-mini',
              status: 'active',
              limit: { context: 1000, output: 1000 },
              capabilities: {
                reasoning: false,
                input: {
                  image: false,
                  pdf: false,
                  audio: false,
                  video: false,
                },
                toolcall: false,
              },
            },
            'regular-model': {
              id: 'regular-model',
              status: 'active',
              limit: { context: 1000, output: 1000 },
              capabilities: {
                reasoning: false,
                input: {
                  image: false,
                  pdf: false,
                  audio: false,
                  video: false,
                },
                toolcall: false,
              },
            },
          },
        },
      ],
    })

    const models = await getActiveModels()
    
    const gemini = models.find(m => m.id === 'gemini-3.1-pro-preview')
    expect(gemini?.supportsImages).toBe(true)
    expect(gemini?.supportsPdf).toBe(false) // other capabilities unchanged

    const gpt4o = models.find(m => m.id === 'gpt-4o-mini')
    expect(gpt4o?.supportsImages).toBe(true)

    const regular = models.find(m => m.id === 'regular-model')
    expect(regular?.supportsImages).toBe(false)
  })

  it('should preserve existing backend capabilities if true', async () => {
    mockSdkClient.config.providers.mockResolvedValue({
      providers: [
        {
          id: 'test-provider',
          models: {
            'any-model': {
              id: 'any-model',
              status: 'active',
              limit: { context: 1000, output: 1000 },
              capabilities: {
                reasoning: false,
                input: {
                  image: true,
                  pdf: true,
                  audio: false,
                  video: false,
                },
                toolcall: false,
              },
            },
          },
        },
      ],
    })

    const models = await getActiveModels()
    const anyModel = models.find(m => m.id === 'any-model')
    expect(anyModel?.supportsImages).toBe(true)
    expect(anyModel?.supportsPdf).toBe(true)
  })
})
