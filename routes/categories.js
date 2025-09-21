const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const staffAuth = require('../middleware/staffAuth');

// @route    GET api/categories
// @desc     Get all categories
// @access   Public
router.get('/', async (req, res) => {
  try {
    const { 
      parentId, 
      featured, 
      status, 
      sort = 'displayOrder', 
      limit = 50, 
      page = 1, 
      search 
    } = req.query;

    // Build query
    const query = {};
    
    // Filter by parentId (root or subcategories)
    if (parentId === 'root') {
      query.parentId = null;
    } else if (parentId) {
      query.parentId = parentId;
    }
    
    // Filter by featured status
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, show only active categories for public access
      query.status = 'active';
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;
    
    // Execute query with sorting and pagination
    const categories = await Category.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
      
    // Get total count for pagination
    const total = await Category.countDocuments(query);
    
    return res.json({
      categories,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/categories/:id
// @desc     Get category by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/categories
// @desc     Create a category
// @access   Private (Admin/Staff only)
router.post('/', [
  auth, 
  staffAuth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name cannot exceed 50 characters').isLength({ max: 50 }),
    check('description', 'Description cannot exceed 500 characters').optional().isLength({ max: 500 })
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({ msg: 'Category with this name already exists' });
    }

    const {
      name,
      description,
      icon,
      image,
      featured,
      parentId,
      status,
      displayOrder
    } = req.body;

    // Create new category
    const categoryFields = {
      name,
      description,
      icon,
      image,
      featured: featured || false,
      status: status || 'active',
      displayOrder: displayOrder || 0
    };

    // Add parent category if provided
    if (parentId && parentId !== 'null') {
      // Verify parent exists
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(400).json({ msg: 'Parent category not found' });
      }
      categoryFields.parentId = parentId;
    } else {
      categoryFields.parentId = null; // Root category
    }

    const category = new Category(categoryFields);
    await category.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/categories/:id
// @desc     Update a category
// @access   Private (Admin/Staff only)
router.put('/:id', [
  auth, 
  staffAuth,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('name', 'Name cannot exceed 50 characters').optional().isLength({ max: 50 }),
    check('description', 'Description cannot exceed 500 characters').optional().isLength({ max: 500 })
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find category by ID
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // If updating name, check for duplicates
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return res.status(400).json({ msg: 'Category with this name already exists' });
      }
    }

    const {
      name,
      description,
      icon,
      image,
      featured,
      parentId,
      status,
      displayOrder
    } = req.body;

    // Update category fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (featured !== undefined) category.featured = featured;
    if (status) category.status = status;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    // Update parent category if provided
    if (parentId !== undefined) {
      // Prevent category from being its own parent
      if (parentId === req.params.id) {
        return res.status(400).json({ msg: 'Category cannot be its own parent' });
      }
      
      // Check for circular reference
      if (parentId && parentId !== 'null') {
        let currentParent = await Category.findById(parentId);
        while (currentParent && currentParent.parentId) {
          if (currentParent.parentId.toString() === req.params.id) {
            return res.status(400).json({ msg: 'Circular reference detected in category hierarchy' });
          }
          currentParent = await Category.findById(currentParent.parentId);
        }
        category.parentId = parentId;
      } else {
        category.parentId = null; // Set as root category
      }
    }

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/categories/:id
// @desc     Delete a category
// @access   Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    // Find category by ID
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete category with products. Please reassign or delete the products first.',
        productCount
      });
    }

    // Check if category has subcategories
    const subCategoryCount = await Category.countDocuments({ parentId: req.params.id });
    if (subCategoryCount > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete category with subcategories. Please reassign or delete the subcategories first.',
        subCategoryCount
      });
    }

    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/categories/:id/featured
// @desc     Toggle featured status
// @access   Private (Admin/Staff only)
router.put('/:id/featured', [auth, staffAuth], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Toggle featured status
    category.featured = !category.featured;
    
    await category.save();
    
    res.json({
      _id: category._id,
      featured: category.featured
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/categories/:id/status
// @desc     Update category status
// @access   Private (Admin/Staff only)
router.put('/:id/status', [auth, staffAuth], async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    category.status = status;
    
    await category.save();
    
    res.json({
      _id: category._id,
      status: category.status
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    GET api/categories/tree/hierarchy
// @desc     Get category tree (hierarchy)
// @access   Private (Admin/Staff only)
router.get('/tree/hierarchy', auth, async (req, res) => {
  try {
    console.log('Category hierarchy endpoint called');
    const { status } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
      console.log('Filtering by status:', status);
    }
    
    // Get all categories with error handling
    let categories;
    try {
      console.log('Fetching categories from database...');
      categories = await Category.find(query)
        .select('name parentId slug image icon featured displayOrder status')
        .sort('displayOrder')
        .lean();
      
      if (!categories) {
        console.log('No categories found, returning empty array');
        return res.json([]);
      }
      
      console.log(`Found ${categories.length} categories`);
    } catch (err) {
      console.error('Error fetching categories from database:', err);
      return res.status(500).json({ msg: 'Error fetching categories from database' });
    }
    
    // Safety check - ensure categories is an array
    if (!Array.isArray(categories)) {
      console.error('Categories is not an array:', typeof categories);
      return res.status(500).json({ msg: 'Invalid data format from database' });
    }
    
    // If categories array is empty, return empty array
    if (categories.length === 0) {
      console.log('Categories array is empty, returning empty array');
      return res.json([]);
    }
    
    try {
      // Build tree structure
      const categoryMap = {};
      const tree = [];
      
      console.log('Building category map...');
      // First, create a map of categories
      categories.forEach(category => {
        try {
          // Ensure _id exists and can be converted to string
          if (!category._id) {
            console.error('Category missing _id:', category);
            return; // Skip this category
          }
          
          // Ensure _id is converted to string to use as object key
          const idStr = category._id.toString();
          categoryMap[idStr] = { 
            ...category, 
            children: [], 
            _id: idStr,
            parentId: category.parentId ? category.parentId.toString() : null
          };
        } catch (err) {
          console.error('Error processing category for map:', err, category);
          // Continue with other categories
        }
      });
      
      console.log('Building tree structure...');
      // Then, build the tree structure
      categories.forEach(category => {
        try {
          if (!category._id) return; // Skip if no ID
          
          const idStr = category._id.toString();
          
          // Safety check - make sure the category exists in our map
          if (!categoryMap[idStr]) {
            console.error('Category not found in map:', idStr);
            return; // Skip this category
          }
          
          if (category.parentId) {
            // This is a child category
            const parentIdStr = category.parentId.toString();
            
            if (categoryMap[parentIdStr]) {
              // Safety check - make sure we're not creating circular references
              if (parentIdStr !== idStr) {
                categoryMap[parentIdStr].children.push(categoryMap[idStr]);
              } else {
                console.error('Circular reference detected - category is its own parent:', idStr);
                tree.push(categoryMap[idStr]); // Add to root level instead
              }
            } else {
              // If parent doesn't exist, add to root level
              console.log(`Parent category ${parentIdStr} not found for ${idStr}, adding to root level`);
              tree.push(categoryMap[idStr]);
            }
          } else {
            // This is a root category
            tree.push(categoryMap[idStr]);
          }
        } catch (err) {
          console.error('Error processing category for tree structure:', err, category);
          // Continue with other categories
        }
      });
      
      console.log(`Returning tree with ${tree.length} root categories`);
      return res.json(tree);
    } catch (err) {
      console.error('Error building category tree:', err);
      return res.status(500).json({ msg: 'Error building category tree', error: err.message });
    }
  } catch (err) {
    console.error('Error in category tree endpoint:', err);
    return res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route    PUT api/categories/reorder
// @desc     Update category display order
// @access   Private (Admin/Staff only)
router.put('/reorder/batch', [auth, staffAuth], async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ msg: 'Invalid data format' });
    }
    
    // Update display order for each category
    const updatePromises = categories.map(item => {
      if (!item._id || item.displayOrder === undefined) {
        return null;
      }
      
      return Category.findByIdAndUpdate(
        item._id,
        { $set: { displayOrder: item.displayOrder } },
        { new: true }
      );
    }).filter(Boolean);
    
    await Promise.all(updatePromises);
    
    res.json({ msg: 'Categories reordered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/categories/stats
// @desc     Get category statistics
// @access   Private (Admin/Staff)
router.get('/admin/stats', [auth, staffAuth], async (req, res) => {
  try {
    // Get total count
    const totalCount = await Category.countDocuments();
    
    // Get active count
    const activeCount = await Category.countDocuments({ status: 'active' });
    
    // Get inactive count
    const inactiveCount = await Category.countDocuments({ status: 'inactive' });
    
    // Get featured count
    const featuredCount = await Category.countDocuments({ featured: true });
    
    // Get root category count
    const rootCategoryCount = await Category.countDocuments({ parentId: null });
    
    // Get subcategory count
    const subcategoryCount = await Category.countDocuments({ parentId: { $ne: null } });
    
    // Get top categories by product count
    const topCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { 
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      { 
        $project: {
          _id: '$categoryInfo._id',
          name: '$categoryInfo.name',
          count: 1
        }
      }
    ]);
    
    res.json({
      totalCount,
      activeCount,
      inactiveCount,
      featuredCount,
      rootCategoryCount,
      subcategoryCount,
      topCategories
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
