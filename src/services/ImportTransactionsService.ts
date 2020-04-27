import fs from 'fs';
import path from 'path';
import CreateTransactionService from './CreateTransactionService';
import dir from '../config/storage';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const data = fs.readFileSync(
      path.resolve(dir.directory, 'data.csv'),
      'utf-8',
    );

    const lines = data.split('\n');
    lines.splice(0, 1);

    const transactionsQueue1 = lines.map(line => {
      const [title, typeString, valueString, category] = line.split(', ');
      const type = typeString as 'income' | 'outcome';
      const value = Number(valueString);
      return { title, type, value, category };
    });

    const createTransactionService = new CreateTransactionService();
    const transactionsQueue = transactionsQueue1.filter(
      transaction => !!transaction.title,
    );
    const transactions: Transaction[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactionsQueue) {
      // eslint-disable-next-line no-await-in-loop
      const response = await createTransactionService.execute({
        category: transaction.category,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
      });
      transactions.push(response);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
