const ITERATIONS = 100000
const KEY_LENGTH = 32
const SALT_LENGTH = 16

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveBits"])

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  )

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const saltArray = Array.from(salt)

  const saltHex = saltArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return `${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [saltHex, storedHashHex] = hashedPassword.split(":")

    if (!saltHex || !storedHashHex) {
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      return hashHex === hashedPassword
    }

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)

    const keyMaterial = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveBits"])

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      KEY_LENGTH * 8,
    )

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return timingSafeEqual(hashHex, storedHashHex)
  } catch {
    return false
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número")
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
