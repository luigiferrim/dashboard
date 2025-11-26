// Utilitário para hash de senha usando PBKDF2 com salt aleatório (muito mais seguro)
const ITERATIONS = 100000 // Número de iterações para dificultar ataques de força bruta
const KEY_LENGTH = 32 // 256 bits
const SALT_LENGTH = 16 // 128 bits

export async function hashPassword(password: string): Promise<string> {
  // Gerar salt aleatório
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  
  // Converter senha para bytes
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)
  
  // Importar senha como chave
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordData,
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  
  // Derivar chave usando PBKDF2
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: "SHA-256"
    },
    keyMaterial,
    KEY_LENGTH * 8
  )
  
  // Converter para hex e combinar salt + hash
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const saltArray = Array.from(salt)
  
  const saltHex = saltArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  
  // Retornar no formato: salt:hash
  return `${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Separar salt e hash
    const [saltHex, storedHashHex] = hashedPassword.split(":")
    
    if (!saltHex || !storedHashHex) {
      // Formato antigo (SHA-256 simples) - manter compatibilidade temporária
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      return hashHex === hashedPassword
    }
    
    // Converter salt de hex para bytes
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
    
    // Converter senha para bytes
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    
    // Importar senha como chave
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordData,
      "PBKDF2",
      false,
      ["deriveBits"]
    )
    
    // Derivar chave usando PBKDF2 com o mesmo salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: ITERATIONS,
        hash: "SHA-256"
      },
      keyMaterial,
      KEY_LENGTH * 8
    )
    
    // Converter para hex
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    
    // Comparar hashes de forma segura (timing-safe)
    return timingSafeEqual(hashHex, storedHashHex)
  } catch (error) {
    console.error("Erro ao verificar senha:", error)
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
    errors
  }
}
