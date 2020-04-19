import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const exists = await transactionsRepository.findOne({ id });

    if (!exists) throw new AppError('This transaction does not exist!', 400);

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
