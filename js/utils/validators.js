const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRequired(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

export function maxLength(value, max) {
  return typeof value === "string" && value.length <= max;
}

/**
 * Validates a set of {value, rules} fields.
 * @returns {Record<string, string>} map of field name -> error message (empty if valid)
 */
export function validate(fields) {
  const errors = {};
  for (const [name, { value, required, email, max, label }] of Object.entries(fields)) {
    if (required && !isRequired(value)) {
      errors[name] = `${label}を入力してください`;
      continue;
    }
    if (email && value && !isValidEmail(value)) {
      errors[name] = "メールアドレスの形式が正しくありません";
      continue;
    }
    if (max && value && !maxLength(value, max)) {
      errors[name] = `${label}は${max}文字以内で入力してください`;
    }
  }
  return errors;
}
