import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const SUPABASE_URL = 'https://boqhqohnzcnvqllkqthg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_C7dzSyAlSqG3h4P_lfKFnw__uDUEhOE'

let supabase = null

export const initSupabase = () => {
  localStorage.setItem('supabase_url', SUPABASE_URL)
  localStorage.setItem('supabase_key', SUPABASE_KEY)

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  }
  return supabase
}

// ==================== 聊天消息同步 ====================

// 发送消息
export const sendMessage = async (coupleId, message) => {
  const client = initSupabase()

  const msgData = {
    couple_id: coupleId,
    sender_id: message.senderId,
    sender_name: message.senderName,
    text: message.text,
    timestamp: Date.now()
  }

  if (client) {
    try {
      const { error } = await client.from('messages').insert(msgData)
      if (error) throw error
      return true
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }

  // 本地保存
  const key = `tanDanChatMessages_${coupleId}`
  const saved = localStorage.getItem(key)
  const messages = saved ? JSON.parse(saved) : []
  messages.push({ ...msgData, id: Date.now().toString() })
  localStorage.setItem(key, JSON.stringify(messages))
  return true
}

// 获取消息列表
export const getMessages = async (coupleId, limit = 100) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('couple_id', coupleId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        text: r.text,
        timestamp: r.timestamp,
        time: new Date(r.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })).reverse()
    } catch (error) {
      console.error('获取消息失败:', error)
    }
  }

  const key = `tanDanChatMessages_${coupleId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}

// 清空聊天记录
export const clearMessages = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      await client.from('messages').delete().eq('couple_id', coupleId)
    } catch (error) {
      console.error('清空消息失败:', error)
    }
  }

  localStorage.removeItem(`tanDanChatMessages_${coupleId}`)
  return true
}

// ==================== 亲密度系统 ====================

export const getIntimacy = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('couple_data')
        .select('intimacy')
        .eq('couple_id', coupleId)
        .single()

      if (data?.intimacy) {
        localStorage.setItem('tanDanIntimacy', JSON.stringify(data.intimacy))
        return data.intimacy
      }
    } catch (error) {
      console.error('获取亲密度失败:', error)
    }
  }

  const saved = localStorage.getItem('tanDanIntimacy')
  return saved ? JSON.parse(saved) : { level: 1, points: 0, totalPoints: 0 }
}

export const addIntimacy = async (coupleId, points) => {
  const current = await getIntimacy(coupleId)
  console.log('当前亲密度:', current, '增加:', points)

  const newTotal = current.totalPoints + points
  const newLevel = Math.floor(newTotal / 100) + 1

  const newIntimacy = {
    level: newLevel,
    points: newTotal % 100,
    totalPoints: newTotal
  }

  console.log('新亲密度:', newIntimacy)

  const client = initSupabase()
  if (client) {
    try {
      const { error } = await client
        .from('couple_data')
        .upsert({
          couple_id: coupleId,
          intimacy: newIntimacy,
          updated_at: Date.now()
        })
      if (error) {
        console.error('Supabase保存亲密度错误:', error)
      } else {
        console.log('亲密度已保存到云端')
      }
    } catch (error) {
      console.error('保存亲密度失败:', error)
    }
  }

  localStorage.setItem('tanDanIntimacy', JSON.stringify(newIntimacy))
  return newIntimacy
}

// ==================== 宠物状态同步 ====================

export const savePets = async (coupleId, pets) => {
  const client = initSupabase()

  if (client) {
    try {
      await client
        .from('couple_data')
        .upsert({
          couple_id: coupleId,
          pets: pets,
          updated_at: Date.now()
        })
    } catch (error) {
      console.error('保存宠物失败:', error)
    }
  }

  localStorage.setItem('tanDanPets', JSON.stringify(pets))
  return true
}

export const getPets = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('couple_data')
        .select('pets')
        .eq('couple_id', coupleId)
        .single()

      if (data?.pets) {
        localStorage.setItem('tanDanPets', JSON.stringify(data.pets))
        return data.pets
      }
    } catch (error) {
      console.error('获取宠物失败:', error)
    }
  }

  const saved = localStorage.getItem('tanDanPets')
  return saved ? JSON.parse(saved) : null
}

// ==================== 积分同步 ====================

export const savePoints = async (coupleId, points) => {
  const client = initSupabase()

  if (client) {
    try {
      await client
        .from('couple_data')
        .upsert({
          couple_id: coupleId,
          points: points,
          updated_at: Date.now()
        })
    } catch (error) {
      console.error('保存积分失败:', error)
    }
  }

  localStorage.setItem('tanDanPoints', points.toString())
  return true
}

export const getPoints = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('couple_data')
        .select('points')
        .eq('couple_id', coupleId)
        .single()

      if (data?.points !== undefined) {
        localStorage.setItem('tanDanPoints', data.points.toString())
        return data.points
      }
    } catch (error) {
      console.error('获取积分失败:', error)
    }
  }

  const saved = localStorage.getItem('tanDanPoints')
  return saved ? parseInt(saved) : 100
}

// ==================== 任务进度同步 ====================

export const saveTaskProgress = async (coupleId, taskId, completed) => {
  const client = initSupabase()

  if (client) {
    try {
      await client
        .from('task_progress')
        .upsert({
          couple_id: coupleId,
          task_id: taskId,
          completed: completed,
          updated_at: Date.now()
        })
    } catch (error) {
      console.error('保存任务进度失败:', error)
    }
  }

  const key = `tanDanTaskProgress_${coupleId}`
  const saved = localStorage.getItem(key)
  const progress = saved ? JSON.parse(saved) : {}
  progress[taskId] = completed
  localStorage.setItem(key, JSON.stringify(progress))
  return true
}

export const getTaskProgress = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('task_progress')
        .select('*')
        .eq('couple_id', coupleId)

      if (data) {
        const progress = {}
        data.forEach(d => {
          progress[d.task_id] = d.completed
        })
        localStorage.setItem(`tanDanTaskProgress_${coupleId}`, JSON.stringify(progress))
        return progress
      }
    } catch (error) {
      console.error('获取任务进度失败:', error)
    }
  }

  const key = `tanDanTaskProgress_${coupleId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : {}
}

// ==================== 数据加载 ====================

export const loadAllData = async (coupleId) => {
  await getIntimacy(coupleId)
  await getPets(coupleId)
  await getPoints(coupleId)
  await getTaskProgress(coupleId)
}

// 检查是否已配置
export const isCloudConfigured = () => true

// ==================== 话题相关 ====================

// 设置当前话题
export const setCurrentTopic = async (coupleId, topic) => {
  const client = initSupabase()

  if (client) {
    try {
      if (topic) {
        await client
          .from('topics')
          .upsert({
            couple_id: coupleId,
            topic: topic,
            timestamp: Date.now()
          })
      } else {
        await client
          .from('topics')
          .delete()
          .eq('couple_id', coupleId)
      }
    } catch (error) {
      console.error('设置话题失败:', error)
    }
  }

  if (topic) {
    localStorage.setItem('tanDanCurrentTopic', JSON.stringify(topic))
  } else {
    localStorage.removeItem('tanDanCurrentTopic')
  }
  return true
}

// 获取当前话题
export const getCurrentTopic = async (coupleId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('topics')
        .select('topic')
        .eq('couple_id', coupleId)
        .single()

      if (data?.topic) {
        localStorage.setItem('tanDanCurrentTopic', JSON.stringify(data.topic))
        return data.topic
      }
    } catch (error) {
      console.error('获取话题失败:', error)
    }
  }

  const saved = localStorage.getItem('tanDanCurrentTopic')
  return saved ? JSON.parse(saved) : null
}

// 提交话题任务
export const submitTopicTask = async (coupleId, topic, imagePreview, userId) => {
  const client = initSupabase()

  const submission = {
    couple_id: coupleId,
    task_id: topic.id,
    topic_data: topic,
    image_preview: imagePreview,
    submitted_by: userId,
    timestamp: Date.now()
  }

  if (client) {
    try {
      await client.from('topic_submissions').insert(submission)
    } catch (error) {
      console.error('提交话题任务失败:', error)
    }
  }

  // 本地保存
  const key = `tanDanTopicSubmissions_${coupleId}`
  const saved = localStorage.getItem(key)
  const submissions = saved ? JSON.parse(saved) : []
  submissions.push({ ...submission, id: Date.now().toString() })
  localStorage.setItem(key, JSON.stringify(submissions))

  // 更新亲密度
  const rewards = { light: 8, medium: 15, heavy: 30 }
  const points = rewards[topic.type] || 8
  await addIntimacy(coupleId, points)

  return true
}

// 检查话题是否已完成
export const isTopicCompleted = async (coupleId, taskId) => {
  const client = initSupabase()

  if (client) {
    try {
      const { data } = await client
        .from('topic_submissions')
        .select('id')
        .eq('couple_id', coupleId)
        .eq('task_id', taskId)
        .limit(1)

      return data && data.length > 0
    } catch (error) {
      console.error('检查话题完成状态失败:', error)
    }
  }

  const key = `tanDanTopicSubmissions_${coupleId}`
  const saved = localStorage.getItem(key)
  if (!saved) return false

  const submissions = JSON.parse(saved)
  return submissions.some(s => s.task_id === taskId)
}

// 获取建表SQL
export const getCreateTableSQL = () => {
  return `-- 在 Supabase SQL Editor 中执行：

-- 消息表
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  couple_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 话题表
CREATE TABLE topics (
  id BIGSERIAL PRIMARY KEY,
  couple_id TEXT NOT NULL UNIQUE,
  topic JSONB NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 话题提交表
CREATE TABLE topic_submissions (
  id BIGSERIAL PRIMARY KEY,
  couple_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  topic_data JSONB NOT NULL,
  image_preview TEXT,
  submitted_by TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 索引
CREATE INDEX idx_messages_couple ON messages(couple_id);
CREATE INDEX idx_topics_couple ON topics(couple_id);
CREATE INDEX idx_topic_submissions_couple ON topic_submissions(couple_id);

-- RLS 策略
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all" ON topic_submissions FOR ALL USING (true);`
}
