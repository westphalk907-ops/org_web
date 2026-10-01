import bcrypt from 'bcryptjs'
import { prisma } from '../db/client.js'
import { signToken } from '../middleware/auth.js'
import { ApiError } from '../utils/apiError.js'

const SALT_ROUNDS = 10

export const authService = {
  /**
   * 管理员登录
   */
  async login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) throw ApiError.unauthorized('账号或密码错误')

    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) throw ApiError.unauthorized('账号或密码错误')

    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    const token = signToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role.toLowerCase() as any,
    })

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role.toLowerCase(),
      },
    }
  },

  /**
   * 创建初始管理员（seed 用）
   */
  async ensureAdmin(input: {
    username: string
    password: string
    email: string
    role?: 'super_admin' | 'admin' | 'editor'
  }) {
    const exists = await prisma.admin.findUnique({ where: { username: input.username } })
    if (exists) return exists

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
    return prisma.admin.create({
      data: {
        username: input.username,
        passwordHash,
        email: input.email,
        role: (input.role || 'super_admin').toUpperCase() as any,
      },
    })
  },
}
