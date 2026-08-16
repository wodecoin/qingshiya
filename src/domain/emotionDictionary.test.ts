import { describe, expect, it } from 'vitest'
import {
  bodySignalOptions,
  behaviorUrgeOptions,
  primaryEmotionOptions,
  secondaryReactionOptions,
} from './emotionDictionary'

describe('emotion dictionary', () => {
  it('exports the four option groups used by entry forms', () => {
    expect(primaryEmotionOptions).toEqual(expect.any(Array))
    expect(secondaryReactionOptions).toEqual(expect.any(Array))
    expect(bodySignalOptions).toEqual(expect.any(Array))
    expect(behaviorUrgeOptions).toEqual(expect.any(Array))
  })
})
