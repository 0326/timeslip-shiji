-- 用户系统数据库初始化
-- D1 Migration: 0001_init

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                  -- 用户ID (UUID)
  username TEXT UNIQUE NOT NULL,        -- 用户名（唯一）
  password_hash TEXT NOT NULL,          -- 密码哈希（PBKDF2）
  nickname TEXT NOT NULL,               -- 昵称（显示名）
  created_at INTEGER NOT NULL,          -- 创建时间戳（ms）
  last_login_at INTEGER NOT NULL,       -- 最后登录时间戳（ms）
  avatar_url TEXT                       -- 头像URL（可选）
);

CREATE TABLE IF NOT EXISTS saves (
  user_id TEXT NOT NULL,                -- 用户ID
  slot TEXT NOT NULL DEFAULT 'default', -- 存档槽位（默认 default）
  data TEXT NOT NULL,                   -- 完整存档 JSON（UserProgress 序列化）
  updated_at INTEGER NOT NULL,          -- 更新时间戳（ms）
  client_updated_at INTEGER NOT NULL,   -- 客户端更新时间（用于冲突解决）
  version INTEGER NOT NULL DEFAULT 1,   -- 版本号（用于并发控制）
  PRIMARY KEY (user_id, slot),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_saves_user ON saves(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
