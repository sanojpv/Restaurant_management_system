import Menu from "../models/menu.js";

// Create a new menu item


export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null; // multer handles file

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMenu = await Menu.create({
      name,
      description,
      price,
      category,
      image,
    });

    res.status(201).json(newMenu);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update a menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const updatedMenuItem = await Menu.findByIdAndUpdate(id, { name, description, price }, { new: true });
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
//  Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
