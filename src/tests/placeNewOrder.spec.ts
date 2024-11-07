require("dotenv").config();
import { test, expect } from "@playwright/test";

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
    });

  }
);
