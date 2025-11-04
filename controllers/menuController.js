import Menu from "../models/menu.js";

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const menuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image: req.file.filename, // save only filename
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();

    if (!menuItems || menuItems.length === 0) {
      return res.status(200).json([]);
    }

    // response
    res.status(200).json({ menuItems });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  //  Extract all fields sent from the frontend
  const { name, description, price, category } = req.body;

  try {
    const updateFields = { name, description, price, category };

    // If a new file is uploaded, req.file will be defined.
    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // Return the updated document and run Mongoose validators
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res
      .status(200)
      .json({
        message: "Menu item updated successfully",
        menuItem: updatedMenuItem,
      });
  } catch (error) {
    console.error("Error updating menu item:", error);

    //  error message for validation failures
    if (error.name === "CastError" || error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          message:
            "Invalid data format (e.g., price must be a number) or missing required fields.",
        });
    }

    res
      .status(500)
      .json({ message: "Server error: Failed to update menu item." });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//  Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
