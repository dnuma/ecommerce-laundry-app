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


  async selectLaundryCare(detergent: string) {
    const typeOfDetergent = this.page.getByRole("radio", {
      name: `${detergent}`,
    });
    const laundryContinueBtn = this.page.locator(
      "#preferences-continue-button"
    );
    await this.forcedClick(this.selectDetergent);
    await this.forcedClick(typeOfDetergent);
    await this.forcedClick(this.doneBtn);
    await this.forcedClick(laundryContinueBtn);
    await this.page.waitForSelector(`h2:has-text("Bag Count")`);
  }

    async addBags(count: number, type: string) {
      const increaseBagCountBtn = this.page
        .locator(`#stepper-${type}`)
        .getByLabel("plus_custom");
      const bagContinueBtn = this.page.locator("#bag-continue-button");
      await this.forcedClick(increaseBagCountBtn, count);
      await this.forcedClick(bagContinueBtn);
      await this.page.waitForSelector(
        `h2:has-text("Oversized Items (Optional)")`
      );
    }

  async addOversizedItems(count: number) {
    const increaseOversizedItemsBtn = this.page.getByRole("button", {
      name: "plus_custom",
    });
    const oversizedContinueBtn = this.page.locator(
      "#oversized-continue-button"
    );

    // The count in click() won't work with this button, must be manually clicked
    for (let i = 0; i < count; i++) {
      await this.forcedClick(increaseOversizedItemsBtn);
    }
    await this.forcedClick(oversizedContinueBtn);
  }

 
  async acceptProtectLaundryPros() {
    const protectLaundryProsContinueBtn = this.page.locator(
      "#drawer-modal-continue-button"
    );
    const checkboxCount = await this.laundryProsCheckboxes.count();
    for (let i = 0; i < checkboxCount; i++) {
      await this.forcedClick(this.laundryProsCheckboxes.nth(i));
    }
    await this.forcedClick(protectLaundryProsContinueBtn);

    // Skipping the preferred Laundry Pros
    const preferredLaundryProsContinueBtn = this.page.locator(
      "#preferred-continue-button"
    );
    await this.forcedClick(preferredLaundryProsContinueBtn);
    await this.forcedClick(preferredLaundryProsContinueBtn.nth(1));

    await this.page.waitForSelector(`h2:has-text("Coverage")`);
  }

  async selectCoverage(coverage: string) {
    const coverageRadio = this.page.getByText(`${coverage}`, { exact: true });
    const coverageContinueBtn = this.page.locator("#coverage-continue-button");
    await this.forcedClick(coverageRadio);
    await this.forcedClick(coverageContinueBtn);
    await this.page.waitForSelector("#estimated-order-cost");
  }

}
