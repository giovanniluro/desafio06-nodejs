import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeArray = transactions
      .filter(transaction => transaction.type === 'income')
      .map(transaction => Number(transaction.value));

    const outcomeArray = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transaction => Number(transaction.value));

    let income = 0;
    let outcome = 0;

    if (incomeArray.length)
      income = incomeArray.reduce((curr, acc) => acc + curr);
    if (outcomeArray.length)
      outcome = outcomeArray.reduce((curr, acc) => acc + curr);

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
