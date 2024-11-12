export interface CreditCard {
  cardNumber: string;
  expiration: string;
  cvc: string;
  country: string;
  postal?: string;
}