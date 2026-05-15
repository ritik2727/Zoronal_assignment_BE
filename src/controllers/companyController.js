const Company = require('../models/Company');
const Review = require('../models/Review');

// GET /api/companies
const getCompanies = async (req, res) => {
  try {
    const { search = '', city = '', sort = 'name' } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };

    let companies = await Company.find(filter).lean();

    // Compute average rating for each company
    const withRatings = await Promise.all(
      companies.map(async (company) => {
        const reviews = await Review.find({ companyId: company._id });
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        return { ...company, avgRating: parseFloat(avgRating.toFixed(1)), reviewCount: reviews.length };
      })
    );

    // Sorting
    if (sort === 'name') {
      withRatings.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rating') {
      withRatings.sort((a, b) => b.avgRating - a.avgRating);
    } else if (sort === 'location') {
      withRatings.sort((a, b) => a.location.localeCompare(b.location));
    }

    res.json({ count: withRatings.length, companies: withRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/companies/:id
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const reviews = await Review.find({ companyId: company._id });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      ...company,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/companies
const createCompany = async (req, res) => {
  try {
    const { name, location, city, foundedOn, description } = req.body;
    const company = new Company({ name, location, city, foundedOn, description });
    const saved = await company.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/companies/cities — distinct cities for filter dropdown
const getCities = async (req, res) => {
  try {
    const cities = await Company.distinct('city');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCompanies, getCompanyById, createCompany, getCities };
