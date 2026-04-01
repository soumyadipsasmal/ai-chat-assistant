const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

export const validateAuthForm = (mode, formValues) => {
  const values = {
    email: normalize(formValues.email).toLowerCase(),
    password: formValues.password || '',
    username: normalize(formValues.username),
  };

  if (mode === 'register' && values.username.length < 3) {
    return { error: 'Username must be at least 3 characters long.', values };
  }

  if (!EMAIL_REGEX.test(values.email)) {
    return { error: 'Enter a valid email address.', values };
  }

  if (values.password.length < 8) {
    return { error: 'Password must be at least 8 characters long.', values };
  }

  return { error: '', values };
};

export const validateMessageDraft = (value, maxLength = 2000) => {
  const trimmedValue = normalize(value);

  if (!trimmedValue) {
    return 'Message cannot be empty.';
  }

  if (trimmedValue.length > maxLength) {
    return `Message cannot be longer than ${maxLength} characters.`;
  }

  return '';
};
