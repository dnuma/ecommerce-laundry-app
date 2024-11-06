import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { NewUser } from "../interfaces/newUser";

export class RegistrationPage extends BasePage {
  readonly page: Page;
  readonly registerPassword: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly finishRegistrationBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.registerPassword = this.page.locator('#password');
    this.firstName = this.page.locator("#first-name");
    this.lastName = this.page.locator("#last-name");
    this.phone = this.page.locator("#basic-info-form #phone-number");
    this.finishRegistrationBtn = this.page.locator("#phone-submit-button");
  }

  /**
 * Registers a new user by filling out the registration form with the provided user details. 
 * @param {NewUser} user - An object containing user information for registration, including:
 *   - email: The user's email address.
 *   - password: The user's password.
 *   - firstName: The user's first name.
 *   - lastName: The user's last name.
 *   - phone: The user's phone number.
 *   - typeOfAccount: The type of account the user is registering for (e.g., "Personal", "Business").
 *   - olderThan65: A boolean indicating whether the user is older than 65.
 */
  async registerNewUser(user: NewUser) {
    
    await this.forcedClick(this.continueWithEmail);
    await this.email.fill(user.email);
    await this.forcedClick(this.emailContinueBtn);
    await this.registerPassword.fill(user.password);
    await this.forcedClick(this.passwordContinueBtn);
    
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.phone.fill(user.phone);

    const typeofAccount = this.page.getByRole("button", { name: user.typeOfAccount });
    await this.forcedClick(typeofAccount);

    const olderThan65 = this.page.locator("button:has-text('" + user.olderThan65 + "')");
    await this.forcedClick(olderThan65);

    await this.forcedClick(this.finishRegistrationBtn);

    await this.page.waitForSelector("app-permission-push-notification");
    await this.forcedClick(this.pushNotificationNextBtn);
  }

}
