import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('No founds to make this transaction!', 400);

    let categoryId = await categoryRepository.findOne({ title: category });

    if (!categoryId) {
      const newCategory = categoryRepository.create({ title: category });
      const createdCategory = await categoryRepository.save(newCategory);
      categoryId = createdCategory;
    }

    const { id } = categoryId;

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
