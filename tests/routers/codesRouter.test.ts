import request from 'supertest';
import express from 'express';
import codesRouter from '../../src/api/routes/codes';
import CCode from '../../src/api/models/ccModel';

const app = express();
app.use(express.json());
app.use('/api/codes', codesRouter);

jest.mock('../../src/api/models/ccModel');

describe('Codes Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/codes', () => {
    it('should create a new country code', async () => {
      const mockCode = { code: 'US', country: 'United States', services: [1, 2, 3] };
      const mockSave = jest.fn().mockResolvedValue(mockCode);
      (CCode as any).mockImplementation(() => ({ save: mockSave }));

      const response = await request(app)
        .post('/api/codes')
        .send(mockCode);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCode);
    });

    it('should return 500 on error', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Database Error'));
      (CCode as any).mockImplementation(() => ({ save: mockSave }));

      const response = await request(app)
        .post('/api/codes')
        .send({ code: 'US', country: 'United States', services: [1, 2, 3] });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe('GET /api/codes', () => {
    it('should return all country codes', async () => {
      const mockCodes = [
        { code: 'US', country: 'United States', services: [1, 2, 3] },
        { code: 'CA', country: 'Canada', services: [4, 5, 6] },
      ];
      (CCode.find as jest.Mock).mockResolvedValue(mockCodes);

      const response = await request(app).get('/api/codes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCodes);
    });

    it('should return 500 on error', async () => {
      (CCode.find as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/api/codes');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe('GET /api/codes/:code', () => {
    it('should return a country code', async () => {
      const mockCode = { code: 'US', country: 'United States', services: [1, 2, 3] };
      (CCode.findOne as jest.Mock).mockResolvedValue(mockCode);

      const response = await request(app).get('/api/codes/US');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCode);
    });

    it('should return 404 if country code not found', async () => {
      (CCode.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/codes/US');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Country code US not found.');
    });

    it('should return 500 on error', async () => {
      (CCode.findOne as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/api/codes/US');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe('PATCH /api/codes/:code', () => {
    it('should update a country code', async () => {
      const mockCode = { code: 'US', country: 'United States', services: [1, 2, 3] };
      const updates = { country: 'USA' };
      const updatedCode = { ...mockCode, ...updates };

      (CCode.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedCode);

      const response = await request(app)
        .patch('/api/codes/US')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCode);
    });

    it('should return 404 if country code not found', async () => {
      (CCode.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/codes/US')
        .send({ country: 'USA' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Country code US not found.');
    });

    it('should return 400 if no updates are provided', async () => {
      const response = await request(app)
        .patch('/api/codes/US')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'At least one field to update is required.' });
    });

    it('should return 500 on error', async () => {
      (CCode.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app)
        .patch('/api/codes/US')
        .send({ country: 'USA' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe('DELETE /api/codes/:code', () => {
    it('should delete a country code', async () => {
      const mockCode = { code: 'US', country: 'United States', services: [1, 2, 3] };
      (CCode.findOneAndDelete as jest.Mock).mockResolvedValue(mockCode);

      const response = await request(app).delete('/api/codes/US');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCode);
    });

    it('should return 404 if country code not found', async () => {
      (CCode.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/codes/US');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Country code US not found.');
    });

    it('should return 500 on error', async () => {
      (CCode.findOneAndDelete as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).delete('/api/codes/US');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });
});
