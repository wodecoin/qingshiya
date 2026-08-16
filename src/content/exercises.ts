import type { Exercise } from '../domain/types'

const sourceChapter = '《轻释压》练习章节'

export const exercises: Exercise[] = [
  { id: 'arc-breakdown', category: 'thought', title: 'ARC 拆解', durationMinutes: 5, sourceChapter, applicableSituations: ['事情反复盘旋，想先理清线索时'], exitInstructions: '任何一步让你不舒服，都可以停下并回到当下。', instructions: ['写下触发事件（A）和可观察事实。', '记录当时的反应（R）：身体、情绪和想法。', '选择一个小而具体的下一步（C），不要求一次解决全部。'] },
  { id: 'name-the-thought', category: 'thought', title: '想法命名', durationMinutes: 3, sourceChapter, applicableSituations: ['脑中出现很多自动想法，难以分辨时'], exitInstructions: '不想继续时，睁眼看看周围并结束记录。', instructions: ['注意一个正在出现的想法。', '用“我注意到我正在想……”为它命名。', '把注意力带回脚下或眼前的一件物品。'] },
  { id: 'cognitive-defusion', category: 'thought', title: '认知解离', durationMinutes: 5, sourceChapter, applicableSituations: ['被一个念头牵着走，想留出一点距离时'], exitInstructions: '如果距离感不合适，停止练习，做几次自然呼吸。', instructions: ['写下最强烈的念头。', '在前面加上“我正在有一个……的念头”。', '观察这句话带来的变化，不判断它对不对。'] },
  { id: 'stress-reframe', category: 'thought', title: '压力心态重评', durationMinutes: 5, sourceChapter, applicableSituations: ['面对压力任务，想寻找更宽的看法时'], exitInstructions: '找不到新看法也没关系，可以保留原句并结束。', instructions: ['写下当前压力在提醒你什么需要。', '问自己：还有一个同样尊重事实的解释吗？', '选一条较平衡的表述，作为今天的暂时视角。'] },
  { id: 'paced-breathing', category: 'body', title: '温和呼吸', durationMinutes: 3, sourceChapter, applicableSituations: ['需要短暂停顿，注意到呼吸变急时'], exitInstructions: '任何不适都应恢复自然呼吸或停止。', instructions: ['找一个舒适姿势，不必刻意挺直。', '以舒服的速度吸气，再以更慢或相同速度呼气。', '重复几轮，保持不憋气、不追求深度。'] },
  { id: 'cooling-sensation', category: 'body', title: '冷刺激觉察', durationMinutes: 1, sourceChapter, applicableSituations: ['想用清晰的感官线索回到当下时'], exitInstructions: '感觉刺痛、麻木或不适时立即停止并恢复温度。', instructions: ['用凉水洗手，或握住凉爽但不冰冷的物品。', '描述温度、触感和变化，不评价好坏。', '感到足够清晰后放下物品，擦干双手。'] },
  { id: 'muscle-release', category: 'body', title: '渐进式肌肉放松', durationMinutes: 10, sourceChapter, applicableSituations: ['身体紧绷，想逐段察觉并放松时'], exitInstructions: '疼痛或抽筋时跳过该部位，必要时停止。', instructions: ['从肩膀或手部开始，轻轻感受紧张。', '短暂收紧到舒适程度，然后放开并观察差异。', '按自己的节奏移动到下一处，不追求完全放松。'] },
  { id: 'short-movement', category: 'body', title: '短时活动', durationMinutes: 5, sourceChapter, applicableSituations: ['久坐或能量堵住，想做一点安全活动时'], exitInstructions: '头晕、疼痛或呼吸不适时停止并休息。', instructions: ['选择安全空间，做肩颈、伸展或慢走。', '保持能说话的强度，留意身体反馈。', '活动结束后站稳或坐下，喝水并记录感受。'] },
  { id: 'contact-support', category: 'behavior', title: '联系支持者', durationMinutes: 3, sourceChapter, applicableSituations: ['不想独自承受，身边有可信任的人时'], exitInstructions: '不想发送时可只写草稿，不需要勉强联系。', instructions: ['选一位相对可靠的人。', '发送一句具体的话，例如“我现在有点难，需要你听我说几分钟”。', '说明你希望对方做什么：倾听、陪伴或稍后联系。'] },
  { id: 'controllable-action', category: 'behavior', title: '一个可控小行动', durationMinutes: 5, sourceChapter, applicableSituations: ['事情很多，想先恢复一点掌控感时'], exitInstructions: '找不到合适行动时，先停下来休息也可以。', instructions: ['列出眼前能影响的事情。', '选一个两到五分钟能完成的动作。', '完成后停一下，决定是否继续，不把它变成硬性任务。'] },
  { id: 'urge-delay', category: 'behavior', title: '延迟冲动', durationMinutes: 3, sourceChapter, applicableSituations: ['想立刻做某件可能让自己后悔的事时'], exitInstructions: '如果等待让你更不安全，应停止练习并寻求现实支持。', instructions: ['先把冲动和行动分开描述。', '给自己设一个短暂的等待时间，期间离开触发物。', '等待结束后重新选择，不要求自己必须忍住或必须行动。'] },
  { id: 'recovery-plan', category: 'behavior', title: '恢复安排', durationMinutes: 5, sourceChapter, applicableSituations: ['活动或压力事件之后，想安排接下来一小时'], exitInstructions: '计划不合适时可以删掉或改成更小的一步。', instructions: ['写下接下来需要完成的一件必要事项。', '安排一段低负担的恢复时间，如喝水、洗澡或安静坐着。', '为自己留出调整余地，计划可以随状态变化。'] },
]
