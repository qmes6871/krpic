// Supabase 오류 메시지를 한국어로 변환
export function translateAuthError(error: string): string {
  const errorMap: Record<string, string> = {
    // 로그인 관련
    'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'Email not confirmed': '이메일 인증이 완료되지 않았습니다.',
    'Invalid email or password': '이메일 또는 비밀번호가 올바르지 않습니다.',

    // 회원가입 관련
    'User already registered': '이미 가입된 이메일입니다.',
    'Password should be at least 6 characters': '비밀번호는 최소 6자 이상이어야 합니다.',
    'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
    'Signup requires a valid password': '유효한 비밀번호를 입력해주세요.',

    // 비밀번호 재설정 관련
    'For security purposes, you can only request this once every 60 seconds': '보안을 위해 60초에 한 번만 요청할 수 있습니다.',
    'Email rate limit exceeded': '요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',

    // 비밀번호 변경 관련
    'New password should be different from the old password': '새 비밀번호는 기존 비밀번호와 달라야 합니다.',
    'Password should be at least 8 characters': '비밀번호는 최소 8자 이상이어야 합니다.',

    // 세션 관련
    'Session expired': '세션이 만료되었습니다. 다시 로그인해주세요.',
    'JWT expired': '인증이 만료되었습니다. 다시 로그인해주세요.',
    'Invalid refresh token': '인증 정보가 유효하지 않습니다. 다시 로그인해주세요.',

    // 네트워크 관련
    'Failed to fetch': '네트워크 연결을 확인해주세요.',
    'Network request failed': '네트워크 연결을 확인해주세요.',

    // 기타
    'Too many requests': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  };

  // 정확히 일치하는 메시지가 있으면 반환
  if (errorMap[error]) {
    return errorMap[error];
  }

  // 부분 일치 검사
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 매칭되는 메시지가 없으면 기본 메시지 반환
  return '오류가 발생했습니다. 다시 시도해주세요.';
}
