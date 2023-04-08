export function isValidEmail(email: string) {
  const regexEmail = /\S+@\S+\.\S+/;

  return regexEmail.test(email);
}
