export function extractApiError(err) {
  return extractApiErrorFull(err).message
}

export function extractApiErrorFull(err) {
  // Network or no response
  if (!err?.response) {
    // Axios canceled?
    if (err?.message === "canceled") {
      return { message: "Request canceled." }
    }
    return { message: "Network error. Please try again." }
  }

  const data = err.response.data ?? {}

  // 1) Your envelope
  const env = data.error
  if (env?.message) {
    return {
      message: env.message,
      code: env.code,
      details: env.details
    }
  }

  // 2) DRF fallbacks (if some view didn't use the envelope)
  if (typeof data.detail === "string") {
    return { message: data.detail }
  }
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    return { message: String(data.non_field_errors[0]) }
  }

  // 3) First field error if present
  if (data && typeof data === "object") {
    for (const v of Object.values(data)) {
      if (Array.isArray(v) && v.length) return { message: String(v[0]) }
      if (typeof v === "string") return { message: v }
    }
  }

  return { message: "Something went wrong. Please try again." }
}
