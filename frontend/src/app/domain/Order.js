export class Order {
  constructor(email, amount) {
    if (amount <= 0) {
      throw new Error("Amount must be > 0");
    }
    this.email = email;
    this.amount = amount;
  }

  // Можно добавить дополнительные бизнес-правила, например проверку email домена
}
