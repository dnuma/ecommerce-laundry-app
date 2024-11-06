import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../lib/pages/registration.page";
import { NewUser } from "../lib/interfaces/newUser";
import dotenv from 'dotenv';

dotenv.config();

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe(
  "Register New User",
  {
    tag: ["@registerNewUser", "@smoke"],
  },
  () => {

    test("Register with email", async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      const userInfo: NewUser = {
        email: await registrationPage.generateRandomEmail(),
        password: process.env.PASSWORD || 'Password1!',
        firstName: process.env.FIRSTNAME || 'David', 
        lastName: process.env.LASTNAME || 'Numa',
        phone: await registrationPage.generateRandomPhone(),
        typeOfAccount: 'Personal',
        olderThan65: 'No',
      }
      
      await registrationPage.registerNewUser(userInfo);
      await expect(registrationPage.menuAccount).toBeVisible();
    });


    test.skip("Register with phone", async ({ page }) => {
      // Todo: Implement test
    });
  }
);
