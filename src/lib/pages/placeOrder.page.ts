import type { Page, Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "./base.page";

export class PlaceOrderPage extends BasePage {
  readonly page: Page;  
  readonly newOrderBtn: Locator;
  readonly startNewOrderBtn: Locator;
  readonly selectProfile: Locator;
  readonly createNewProfile: Locator;
  readonly doneBtn: Locator;
  readonly newProfileName: Locator;
  readonly pickupLocation: Locator;
  readonly address: Locator;
  readonly suggestedAddress: Locator;
  readonly pickupSpot: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.newOrderBtn = this.page.locator("#new-order-button");
    this.startNewOrderBtn = this.page.getByText("Start new order");
    this.selectProfile = this.page.getByText("Select Profile Home");
    this.createNewProfile = this.page.getByRole("radio", {
      name: "Create a New Profile",
    });
    this.doneBtn = this.page.getByRole("button", { name: "Done" });
    this.newProfileName = this.page.locator("#new-profile-name-input input");
    this.pickupLocation = this.page.locator("#pickup-location-tag");
    this.address = this.page.locator("#Line1");
    this.suggestedAddress = this.page.locator("ul.suggestions-list li").first();
    this.pickupSpot = this.page.locator("#pickup-location-select");
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

  
  /**
   * Creates a user profile by setting a profile name and address, selecting pickup location, and saving the profile.
   * @param {string} address - Address to associate with the new profile.
   */
  async createProfile(address: string) {
    const continueProfileBtn = this.page.locator(
      "#choose-profile-continue-button"
    );
    const addressSaveBtn = this.page.locator("#address-save-button");
    const timestamp = new Date().getTime();
    const profileName = `Home ${timestamp}`;

    await this.forcedClick(this.selectProfile);
    await this.forcedClick(this.createNewProfile);
    await this.forcedClick(this.doneBtn);

    await this.newProfileName.fill(profileName);
    await this.forcedClick(continueProfileBtn);

    await this.forcedClick(this.pickupLocation);
    await this.address.fill(address);
    await this.forcedClick(this.suggestedAddress);

    await this.forcedClick(addressSaveBtn);
    await this.page.waitForSelector(`h2:has-text("Pickup Location")`);
  }

  /**
   * Selects a specified pickup spot for the order.
   * @param {string} spot - The name of the pickup spot.
   */
  async selectPickupSpot(spot: string) {
    const pickupContinueBtn = this.page.locator("#pickup-continue-button");
    await this.forcedClick(this.pickupSpot);
    await this.forcedClick(
      this.page.locator("button:has-text('" + spot + "')")
    );
    await this.forcedClick(this.doneBtn);
    await this.forcedClick(pickupContinueBtn);
    await this.page.waitForSelector(`h2:has-text("Delivery Speed")`);
  }

  /**
   * Selects the delivery speed for the order based on the specified option.
   * @param {string} speed - The desired delivery speed.
   */
  async selectDeliverySpeed(speed: string) {
    const radio = this.page.getByText(`${speed} Delivery`);
    const deliveryContinueBtn = this.page.locator("#delivery-continue-button");
    await this.forcedClick(radio);
    await this.forcedClick(deliveryContinueBtn);
    await this.page.waitForSelector(`h2:has-text("Laundry Care")`);
  }

}
