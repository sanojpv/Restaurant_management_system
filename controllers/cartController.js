import Cart from "../models/cart.js";

//  Add to Cart
export const addToCart = async (req, res) => {
  try {
    // Auth/Role handled by middleware in the router

    const { menuItemId, quantity } = req.body;

    const customerId = req.user._id;

    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      cart = new Cart({ customer: customerId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ menuItem: menuItemId, quantity: Number(quantity) });
    }

    await cart.save();
    res.json({ message: "Item added to cart successfully", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Function to Update Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    // Auth/Role handled by middleware in the router

    const { menuItemId, quantity } = req.body;
    const customerId = req.user._id;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    existingItem.quantity = Number(quantity);

    if (existingItem.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.menuItem.toString() !== menuItemId
      );
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
};

//  Get Cart
export const getCart = async (req, res) => {
  try {
    // Auth/Role handled by middleware in the router

    const customerId = req.user._id;

    const cart = await Cart.findOne({ customer: customerId }).populate(
      "items.menuItem"
    );
    if (!cart) return res.json({ items: [] });

    res.json({ items: cart.items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
