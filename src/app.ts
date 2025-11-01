import express from 'express';

import router from './router';
import type { Request, Response, NextFunction } from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.use((req, res, next) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(500).json({ message : err.message || 'Internal Server Error' });
});

export default app