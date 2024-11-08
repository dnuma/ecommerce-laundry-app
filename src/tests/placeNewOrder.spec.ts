require("dotenv").config();
import { test, expect } from "@playwright/test";
import { PlaceOrderPage } from "../lib/pages/placeOrder.page";

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

    });

  }
);
