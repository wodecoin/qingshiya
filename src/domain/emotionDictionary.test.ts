import { describe, expect, it } from 'vitest'
import {
  bodySignalOptions,
  behaviorUrgeOptions,
  primaryEmotionOptions,
  secondaryReactionOptions,
} from './emotionDictionary'
import {
  behaviorUrgeDescription,
  bodySignalDescription,
  highRiskNotice,
  primaryEmotionDescription,
  safetyNotice,
  secondaryReactionDescription,
} from '../content/copy'

describe('emotion dictionary', () => {
  it('exports the four option groups used by entry forms', () => {
    expect(primaryEmotionOptions).toEqual(expect.any(Array))
    expect(secondaryReactionOptions).toEqual(expect.any(Array))
    expect(bodySignalOptions).toEqual(expect.any(Array))
    expect(behaviorUrgeOptions).toEqual(expect.any(Array))
  })

  it('includes the required primary and secondary labels', () => {
    expect(primaryEmotionOptions).toEqual(expect.arrayContaining([
      '焦虑', '恐惧', '愤怒', '悲伤', '羞耻', '内疚', '孤独', '挫败', '无助', '兴奋', '平静', '喜悦',
    ]))
    expect(secondaryReactionOptions).toEqual(expect.arrayContaining([
      '自责', '羞愧', '麻木', '逃避', '反复思考', '拖延', '冲动', '否定自己', '过度控制',
    ]))
  })

  it('includes the required body and behavior labels', () => {
    expect(bodySignalOptions).toEqual(expect.arrayContaining([
      '心跳加快', '呼吸变浅', '胸闷', '胃部不适', '头痛', '肌肉紧绷', '发抖', '出汗', '疲惫', '失眠',
    ]))
    expect(behaviorUrgeOptions).toEqual(expect.arrayContaining([
      '争吵', '攻击性信息', '刷手机', '暴饮暴食', '饮酒/用药', '回避任务', '过度工作', '冲动消费', '寻求支持',
    ]))
  })

  it('provides non-diagnostic descriptions and safety notices', () => {
    for (const description of [
      primaryEmotionDescription,
      secondaryReactionDescription,
      bodySignalDescription,
      behaviorUrgeDescription,
    ]) {
      expect(description).toEqual(expect.any(String))
      expect(description.length).toBeGreaterThan(0)
    }
    expect(safetyNotice).toContain('情绪标签不是诊断')
    expect(highRiskNotice).toMatch(/当地紧急服务|危机热线|可信任的人/)
    expect(highRiskNotice).toContain('不要根据标签推断')
  })
})
