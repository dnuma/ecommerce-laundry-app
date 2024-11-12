import type { Page, Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "./base.page";
import { CreditCard } from "../interfaces/creditCard";
import { Total } from "../interfaces/total";

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
  readonly selectDetergent: Locator;
  readonly laundryProsCheckboxes: Locator;

  // Stripe Locators
  readonly stripeIFrame: FrameLocator;
  readonly cardNumber: Locator;
  readonly expiration: Locator;
  readonly cvc: Locator;
  readonly postal: Locator;
  readonly country: Locator;

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
    this.selectDetergent = this.page.getByText("Select DetergentSelect an");
    this.laundryProsCheckboxes = this.page.locator(
      `form poplin-checkbox[aria-label="drawer-checkbox"]`
    );

    // Stripe Locators
    this.stripeIFrame = this.page.frameLocator(
      `iframe[title="Secure payment input frame"]`
    );
    this.cardNumber = this.stripeIFrame.locator("#Field-numberInput");
    this.expiration = this.stripeIFrame.locator("#Field-expiryInput");
    this.cvc = this.stripeIFrame.locator("#Field-cvcInput");
    this.postal = this.stripeIFrame.locator("#Field-postalCodeInput");
    this.country = this.stripeIFrame.locator("#Field-countryInput");
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

  /**
   * Selects a laundry care option based on the specified detergent type.
   * @param {string} detergent - The type of detergent to be used.
   */
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

  /**
   * Adds a specified number of bags for the order, based on the bag type.
   * @param {number} count - The number of bags to add.
   * @param {string} type - The type of bags (e.g., "Laundry" or "Dry Cleaning").
   */
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

  /**
   * Adds a specified number of oversized items to the order and proceeds to the next step.
   * @param {number} count - The number of oversized items to add.
   */
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

  /**
   * Accepts the terms for protecting laundry pros by selecting each checkbox and proceeding.
   */
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

  /**
   * Selects a specified coverage option for the order.
   * @param {string} coverage - The coverage option (e.g., "Basic", "Premium").
   */
  async selectCoverage(coverage: string) {
    const coverageRadio = this.page.getByText(`${coverage}`, { exact: true });
    const coverageContinueBtn = this.page.locator("#coverage-continue-button");
    await this.forcedClick(coverageRadio);
    await this.forcedClick(coverageContinueBtn);
    await this.page.waitForSelector("#estimated-order-cost");
  }

  /**
   * Calculates the order total based on the bag and item types, coverage, and fees.
   * @param {Total} total - An object containing the order details.
   * @returns {{grandTotal: string, preAuthorizedTotal: string}} The calculated grand total and pre-authorized total, both formatted as currency strings.
   */
  calculateOrder(total: Total): {
    grandTotal: string;
    preAuthorizedTotal: string;
  } {
    const smallPrice = 1100;
    const regularPrice = 1400;
    const largePrice = 1900;
    const oversizedPrice = 800;

    const basicCoverage = 0;
    const premiumCovrage = 250;
    const premiumPlusCoverage = 475;

    const trustFee = 300;

    const preAuthPriceIncrease = 1.4;

    let grandTotal = 0;

    switch (total.typeOfBag) {
      case "small":
        grandTotal += total.bagCount * smallPrice;
        break;
      case "regular":
        grandTotal += total.bagCount * regularPrice;
        break;
      case "large":
        grandTotal += total.bagCount * largePrice;
        break;
    }

    grandTotal += total.oversizedItems * oversizedPrice;

    switch (total.coverage) {
      case "Basic":
        grandTotal += basicCoverage;
        break;
      case "Premium":
        grandTotal += premiumCovrage;
        break;
      case "Premium Plus":
        grandTotal += premiumPlusCoverage;
        break;
    }

    grandTotal += trustFee;
    const preAuthorizedTotal = grandTotal * preAuthPriceIncrease;

    return {
      grandTotal: this.formatToCurrency(grandTotal),
      preAuthorizedTotal: this.formatToCurrency(preAuthorizedTotal),
    };
  }

  /**
   * Formats a given amount as a currency string.
   * @param {number} amount - The amount to format.
   * @returns {string} The formatted currency string.
   */
  formatToCurrency(amount: number): string {
    return `$${(amount / 100).toFixed(2)}`;
  }

  /**
   * Places an order by entering payment details and confirming the order.
   * @param {CreditCard} creditCard - An object containing credit card details.
   */
  async placeOrder(creditCard: CreditCard) {
    const placeOrderBtn = this.page.locator("#place-order-button");
    const striplePlaceOrderBtn = this.page.locator("#stripe-pay-button");

    await this.page.waitForTimeout(2000); // To avoid errors with the spinner
    await this.forcedClick(placeOrderBtn);

    await this.cardNumber.fill(creditCard.cardNumber);
    await this.expiration.fill(creditCard.expiration);
    await this.cvc.fill(creditCard.cvc);
    await this.country.selectOption({ value: creditCard.country });
    await this.postal.fill(creditCard.postal || "");

    await this.forcedClick(striplePlaceOrderBtn);
  }
}
