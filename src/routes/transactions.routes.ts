/* eslint-disable no-param-reassign */
import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import storage from '../config/storage';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

interface TransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
const upload = multer(storage);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    select: ['title', 'type', 'value', 'created_at'],
    relations: ['category'],
  });

  transactions.map(transaction => {
    delete transaction.category.created_at;
    delete transaction.category.updated_at;
    return transaction;
  });

  const balance = await transactionsRepository.getBalance();
  response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category }: TransactionRequest = request.body;
  const createService = new CreateTransactionService();
  const transaction = await createService.execute({
    title,
    value,
    type,
    category,
  });

  response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);
  response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importService = new ImportTransactionsService();
    const transactions = await importService.execute();
    response.status(200).json(transactions);
  },
);

export default transactionsRouter;
