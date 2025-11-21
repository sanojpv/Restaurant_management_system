// controllers/menuController.js
import Menu from "../models/menu.js";
import { uploadToImgBB } from "../utils/uploadImgBB.js";

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    let imageUrl;
    try {
      imageUrl = await uploadToImgBB(req.file.path);
    } catch (uploadErr) {
      console.error("ImgBB upload error:", uploadErr);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const menuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    res.status(201).json({ menuItem });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const updateFields = { name, description, price, category };

    if (req.file) {
      try {
        const newImageUrl = await uploadToImgBB(req.file.path);
        updateFields.image = newImageUrl;
      } catch (err) {
        console.error("ImgBB upload error on update:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ menuItem: updatedMenuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Menu.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({ menuItem: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





