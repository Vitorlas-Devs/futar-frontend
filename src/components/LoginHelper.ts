export default class LoginHelper {
  public static IsValidEmail(email: string): boolean | string {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email) || "Invalid email";
  }

  public static IsLengthOk(password: string): boolean {
    return password.length >= 8;
  }

  public static IsAnyUppercaseChar(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  public static IsAnyLowercaseChar(password: string): boolean {
    return /[a-z]/.test(password);
  }

  public static IsAnyNumber(password: string): boolean {
    return /\d/.test(password);
  }

  public static IsAnySpecialChar(password: string): boolean {
    return /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password);
  }
}
