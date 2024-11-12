require("dotenv").config();
import { test, expect } from "@playwright/test";
import { PlaceOrderPage } from "../lib/pages/placeOrder.page";
import { CreditCard } from "../lib/interfaces/creditCard";
import { Total } from "../lib/interfaces/total";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe(
  "Place Order",
  {
    tag: ["@placeOrder", "@smoke"],
  },
  () => {
    test("New Order", { tag: "@newOrder" }, async ({ page }) => {
      const placeOrderPage = new PlaceOrderPage(page);
      const address = "123 Main St";
      const spot = "Front Door";
      const deliverySpeed = "Standard";
      const detergent = "Hypoallergenic";
      const bagCount = Math.floor(Math.random() * 5) + 1;
      const typeOfBag = "regular";
      const oversizedItems = Math.floor(Math.random() * 3) + 1;
      const coverage = "Premium";

      await test.step("Login", async () => {
        const email = process.env.EMAIL || "";
        const password = process.env.PASSWORD || "";

        expect(email).not.toBe("");
        expect(password).not.toBe("");

        await placeOrderPage.login(email, password);
        await expect(placeOrderPage.menuAccount).toBeVisible();
      });

      await test.step("Place New Order", async () => {
        const title = page.getByRole("heading", { name: "Choose a Profile" });
        await placeOrderPage.placeNewOrder();
        await expect(title).toBeVisible();
      });

      await test.step("Create Profile", async () => {
        await placeOrderPage.createProfile(address);
        await placeOrderPage.selectPickupSpot(spot);
        expect(page.url()).toContain("delivery-speed");
      });

      await test.step("Select Delivery Speed", async () => {
        await placeOrderPage.selectDeliverySpeed(deliverySpeed);
        expect(page.url()).toContain("laundry-preferences");
      });

      await test.step("Select Laundry Care", async () => {
        await placeOrderPage.selectLaundryCare(detergent);
        expect(page.url()).toContain("bag-count");
      });

      await test.step("Add Bags", async () => {
        await placeOrderPage.addBags(bagCount, typeOfBag);
        expect(page.url()).toContain("oversized-items");
      });

      await test.step("Add Oversized Items", async () => {
        const title = page.getByRole("heading", {
          name: "Protecting Laundry Pros",
        });
        await placeOrderPage.addOversizedItems(oversizedItems);
        await expect(title).toBeVisible();
      });

      await test.step("Protect Laundry Pros modal", async () => {
        await placeOrderPage.acceptProtectLaundryPros();
        expect(page.url()).toContain("coverage");
      });

      await test.step("Coverage", async () => {
        await placeOrderPage.selectCoverage(coverage);
        expect(page.url()).toContain("review-order");
      });

      await test.step("Review Order", async () => {
        // Format the strings
        const capitalizedTypeOfBag =
          typeOfBag.charAt(0).toUpperCase() + typeOfBag.slice(1);
        const bags = `${bagCount.toString()} ${capitalizedTypeOfBag}`;
        const oversized = `${oversizedItems.toString()} Oversized Items`;
        const addressLine = 0;
        const spotLine = 1;

        // Calculate the totals
        const total: Total = {
          typeOfBag: typeOfBag,
          bagCount: bagCount,
          oversizedItems: oversizedItems,
          coverage: coverage,
        };

        const totalsToPay = placeOrderPage.calculateOrder(total);
        console.log("totalsToPay", totalsToPay);

        // Check the review order page
        expect
          .soft(
            page
              .locator("#review-card-pickup-wrapper article ul li")
              .nth(addressLine)
          )
          .toContainText(address);
        expect
          .soft(
            page
              .locator("#review-card-pickup-wrapper article ul li")
              .nth(spotLine)
          )
          .toContainText(spot);
        expect
          .soft(page.locator("#review-card-laundry-wrapper article ul li"))
          .toContainText(detergent);
        expect
          .soft(page.locator("#review-card-bag-wrapper article ul li"))
          .toContainText(bags);
        expect
          .soft(page.locator("#review-card-oversized-wrapper article ul li"))
          .toContainText(oversized);
        expect
          .soft(page.locator("#review-card-coverage-wrapper article"))
          .toContainText(coverage);

        expect.soft(page.getByText(`${totalsToPay.grandTotal}`)).toBeVisible();
        expect
          .soft(page.getByText(`${totalsToPay.preAuthorizedTotal}`))
          .toBeVisible();
      });

      await test.step("Complete the order", async () => {
        // Stripe's testing card number
        const cardInfo: CreditCard = {
          cardNumber: "4242424242424242",
          expiration: "1233",
          cvc: "123",
          country: "US",
          postal: "99501",
        };

        await placeOrderPage.placeOrder(cardInfo);
        await expect(placeOrderPage.newOrderBtn).toBeVisible();
      });
    });

  }
);
