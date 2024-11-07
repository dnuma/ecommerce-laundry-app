import type { Page, Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "./base.page";

export class PlaceOrderPage extends BasePage {
  readonly page: Page;
  readonly newOrderBtn: Locator;
  readonly startNewOrderBtn: Locator;
  readonly selectProfile: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.newOrderBtn = this.page.locator("#new-order-button");
    this.startNewOrderBtn = this.page.getByText("Start new order");
    this.selectProfile = this.page.getByText("Select Profile Home");
  }

  /**
   * Initiates a new order process by checking for permission modal and clicking through the start options.
   */
  async placeNewOrder() {
    const permissionModal = this.page.getByRole("heading", {
      name: "Permission Required",
    });
    if (await permissionModal.isVisible()) {
      const allowBtn = this.page.locator("#notification-permission-ok");
      await this.forcedClick(allowBtn);
    }
    await this.forcedClick(this.newOrderBtn);
    await this.forcedClick(this.startNewOrderBtn);
  }

}
