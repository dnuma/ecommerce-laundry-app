import type { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly continueWithEmail: Locator;
  readonly email: Locator;
  readonly loginPassword: Locator;
  readonly emailContinueBtn: Locator;
  readonly loginBtn: Locator;
  readonly passwordContinueBtn: Locator;
  readonly pushNotificationNextBtn: Locator;

  readonly menuAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueWithEmail = this.page.locator(
      'button[aria-label="Continue with Email"]'
    );
    this.email = this.page.locator("#email");
    this.loginPassword = this.page.locator("#enter-password");
    this.emailContinueBtn = this.page.locator(`#email-login-button`);
    this.loginBtn = this.page.locator(`#enter-password-login-button`);
    this.passwordContinueBtn = this.page.locator(`#choose-password-button`);

    this.pushNotificationNextBtn = this.page.locator("#auth-pn-next-button");

    this.menuAccount = this.page.locator("a").filter({ hasText: "Account" });
  }

  /**
   * Generates a random phone number with the area code '714'.
   * @returns {Promise<string>} Resolves to a randomly generated phone number.
   */
  async generateRandomPhone(): Promise<string> {
    const phone =
      "714" + Math.floor(1000000 + Math.random() * 9000000).toString();
    return phone;
  }

  /**
   * Generates a unique email address based on the current timestamp.
   * @returns {Promise<string>} Resolves to a randomly generated email address.
   */
  async generateRandomEmail(): Promise<string> {
    const timestamp = new Date().getTime();
    const email = `davidnuma+${timestamp}@email.com`;
    return email;
  }

  /**
   * Clicks on a given locator element with the option to force the click and specify a count.
   * @param {Locator} locator - The element to be clicked.
   * @param {number} count - Number of clicks to perform (defaults to 1).
   */
  async forcedClick(locator: Locator, count: number = 1) {
    await this.page.waitForTimeout(800); // Forced timeout for the element to be clickable
    await locator.click({ force: true, clickCount: count });
  }

  /**
   * Logs in a user by filling in the email and password fields and navigating through login prompts.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   */
  async login(email: string, password: string) {
    await this.forcedClick(this.continueWithEmail);
    await this.email.fill(email);
    await this.forcedClick(this.emailContinueBtn);
    await this.loginPassword.fill(password);
    await this.forcedClick(this.loginBtn);

    await this.page.waitForSelector("app-permission-push-notification");
    await this.forcedClick(this.pushNotificationNextBtn);
  }
}
