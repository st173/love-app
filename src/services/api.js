import AV, { User, Couple, Task } from './leancloud'

// 注册匿名用户
export async function signUpAnonymous() {
  const user = new User()
  const inviteCode = generateInviteCode()

  user.set('nickname', '')
  user.set('avatar', '💕')
  user.set('inviteCode', inviteCode)
  user.set('partnerId', null)
  user.set('coupleId', null)
  user.set('challengeMode', 'medium')

  await user.save()
  return user
}

// 获取当前用户
export function getCurrentUser() {
  return AV.User.current()
}

// 更新用户信息
export async function updateUser(userId, data) {
  const query = new AV.Query(User)
  const user = await query.get(userId)
  Object.keys(data).forEach(key => {
    user.set(key, data[key])
  })
  return await user.save()
}

// 通过邀请码查找用户
export async function findUserByInviteCode(inviteCode) {
  const query = new AV.Query(User)
  query.equalTo('inviteCode', inviteCode.toUpperCase())
  return await query.first()
}

// 创建情侣关系
export async function createCouple(userId) {
  const couple = new Couple()
  couple.set('members', [userId])
  couple.set('loveScore', 500)
  couple.set('pet', {
    type: 'cat',
    name: '小橘',
    level: 1,
    health: 100,
    happiness: 100,
  })
  couple.set('anniversaries', [])

  const savedCouple = await couple.save()

  // 更新用户的 coupleId
  await updateUser(userId, { coupleId: savedCouple.id })

  return savedCouple
}

// 加入情侣关系
export async function joinCouple(userId, partnerId, coupleId) {
  // 获取情侣对象
  const query = new AV.Query(Couple)
  const couple = await query.get(coupleId)

  // 添加新成员
  const members = couple.get('members')
  members.push(userId)
  couple.set('members', members)
  await couple.save()

  // 更新双方用户信息
  await updateUser(userId, { partnerId, coupleId })
  await updateUser(partnerId, { partnerId: userId })

  return couple
}

// 获取情侣数据
export async function getCouple(coupleId) {
  const query = new AV.Query(Couple)
  return await query.get(coupleId)
}

// 更新情侣数据
export async function updateCouple(coupleId, data) {
  const query = new AV.Query(Couple)
  const couple = await query.get(coupleId)
  Object.keys(data).forEach(key => {
    couple.set(key, data[key])
  })
  return await couple.save()
}

// 生成邀请码
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'LOVE'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
