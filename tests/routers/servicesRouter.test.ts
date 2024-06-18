import request from 'supertest';
import express from 'express';
import serviceRouter from '../../src/api/routes/services';
import SService from '../../src/api/models/ssModel';
import CCode from '../../src/api/models/ccModel';

jest.mock('../../src/api/models/ssModel');
jest.mock('../../src/api/models/ccModel');

const app = express();
app.use(express.json());
app.use('/services', serviceRouter);

describe('serviceRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /newService', () => {
        it('should create a new streaming service', async () => {
            const mockService = {
                id: '20',
                name: 'foxNews',
                monthlyFee: '£0.00',
                save: jest.fn().mockResolvedValue({
                    id: '20',
                    name: 'foxNews',
                    monthlyFee: '£0.00'
                })
            };
            (SService as unknown as jest.Mock).mockReturnValue(mockService);

            const res = await request(app)
                .post('/services/newService')
                .send({ id: '20', name: 'foxNews', monthlyFee: '£0.00' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                id: '20',
                name: 'foxNews',
                monthlyFee: '£0.00'
            });
            expect(mockService.save).toHaveBeenCalled();
        });

        it('should return 400 if id or name is missing', async () => {
            const res = await request(app).post('/services/newService').send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'All fields (id, name, monthly fee) are required.' });
        });
    });

    describe('GET /', () => {
        it('should return all streaming services', async () => {
            const mockServices = [{ id: '1', name: 'Netflix', monthlyFee: '£8.99' }];
            (SService.find as jest.Mock).mockResolvedValue(mockServices);

            const res = await request(app).get('/services');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockServices);
        });

        it('should return 404 if no streaming services are found', async () => {
            (SService.find as jest.Mock).mockResolvedValue([]);

            const res = await request(app).get('/services');

            expect(res.status).toBe(404);
            expect(res.text).toBe('No streaming services found.');
        });
    });

    describe('GET /:id', () => {
        it('should return the streaming service by id', async () => {
            const mockService = { id: '1', name: 'Netflix', monthlyFee: '£8.99' };
            (SService.findOne as jest.Mock).mockResolvedValue(mockService);

            const res = await request(app).get('/services/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockService);
        });

        it('should return 404 if the service is not found', async () => {
            (SService.findOne as jest.Mock).mockResolvedValue(null);

            const res = await request(app).get('/services/1');

            expect(res.status).toBe(404);
            expect(res.text).toBe('Streaming service with id 1 not found.');
        });
    });

    describe('GET /code/:countryCode', () => {
        it('should return streaming services for a country code', async () => {
            const mockCountryCode = { code: 'ae', services: ['1'] };
            const mockServices = [{ id: '1', name: 'Netflix', monthlyFee: '£8.99' }];
            (CCode.findOne as jest.Mock).mockResolvedValue(mockCountryCode);
            (SService.find as jest.Mock).mockResolvedValue(mockServices);

            const res = await request(app).get('/services/code/ae');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockServices);
        });

        it('should return 404 if the country code is not found', async () => {
            (CCode.findOne as jest.Mock).mockResolvedValue(null);

            const res = await request(app).get('/services/code/ae');

            expect(res.status).toBe(404);
            expect(res.text).toBe('The country code ae is not currently supported by our services.');
        });

        it('should return 400 if no services are found for the country code', async () => {
            const mockCountryCode = { code: 'ae', services: ['1'] };
            (CCode.findOne as jest.Mock).mockResolvedValue(mockCountryCode);
            (SService.find as jest.Mock).mockResolvedValue([]);

            const res = await request(app).get('/services/code/ae');

            expect(res.status).toBe(400);
            expect(res.text).toBe('No streaming services found for ae.');
        });
    });

    describe('PATCH /:id', () => {
        it('should update the streaming service', async () => {
            const mockService = { id: '1', name: 'Netflix', monthlyFee: '£9.99' };
            (SService.findOneAndUpdate as jest.Mock).mockResolvedValue(mockService);

            const res = await request(app)
                .patch('/services/1')
                .send({ monthlyFee: '£9.99' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockService);
        });

        it('should return 400 if no updates are provided', async () => {
            const res = await request(app).patch('/services/1').send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'At least one field to update is required.' });
        });

        it('should return 404 if the service is not found', async () => {
            (SService.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .patch('/services/1')
                .send({ monthlyFee: '£9.99' });

            expect(res.status).toBe(404);
            expect(res.text).toBe('Streaming service with id 1 not found.');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete the streaming service', async () => {
            const mockService = { id: '1', name: 'Netflix', monthlyFee: '£8.99' };
            (SService.findOneAndDelete as jest.Mock).mockResolvedValue(mockService);

            const res = await request(app).delete('/services/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockService);
        });

        it('should return 404 if the service is not found', async () => {
            (SService.findOneAndDelete as jest.Mock).mockResolvedValue(null);

            const res = await request(app).delete('/services/1');

            expect(res.status).toBe(404);
            expect(res.text).toBe('Streaming service with id 1 not found.');
        });
    });
});
