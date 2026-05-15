const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
  getCities,
} = require('../controllers/companyController');

router.get('/cities', getCities);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.post('/', createCompany);

module.exports = router;
