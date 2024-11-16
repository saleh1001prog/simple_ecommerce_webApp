"use client";
import { useEffect, useState, memo } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ProductsStudio = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewImages([]);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (image) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((img) => img !== image),
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      setIsUpdating(true);
      try {
        const formData = new FormData();
        formData.append("_id", editingProduct._id);
        formData.append("name", editingProduct.name);
        formData.append("description", editingProduct.description);
        formData.append("price", editingProduct.price.toString());
        editingProduct.images.forEach((img) => formData.append("existingImages", img));
        newImages.forEach((file) => formData.append("newImages", file));

        const response = await axios.put("/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          alert("Product updated successfully");
          const updatedProduct = response.data.product;
          setProducts(
            products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
          );
          setEditingProduct(null);
        } else {
          alert(response.data.message || "Error updating product");
        }
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: deletingProduct._id }),
      });

      if (response.ok) {
        alert("Product deleted successfully");
        setProducts(products.filter((product) => product._id !== deletingProduct._id));
        setDeletingProduct(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;

  return (
    <div className="p-6 gap-4 flex justify-center flex-wrap">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={handleEdit}
          onDelete={() => setDeletingProduct(product)}
        />
      ))}

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                value={editingProduct?.name || ""}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label  className="block text-sm font-medium ">Description:</label>
              <textarea
              dir="rtl"
                value={editingProduct?.description || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price:</label>
              <input
                type="number"
                value={editingProduct?.price || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Current Images:</label>
              <div className="flex gap-2">
                {editingProduct?.images.map((img) => (
                  <div key={img} className="relative">
                    <Image
                      src={img}
                      alt="Product"
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Add New Images:</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="block w-full"
              />
              <div className="mt-2 flex gap-2">
                {newImages.map((file, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this product?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductCard = memo(({ product, onEdit, onDelete }) => (
  <div className="bg-white border rounded-lg shadow-md w-[250px]">
    {product.images.length > 0 ? (
      <img src={product.images[0]} alt={product.name} className="w-full h-[150px] object-cover" />
    ) : (
      <div className="w-full h-[150px] flex items-center justify-center bg-gray-200">No Image</div>
    )}
    <div className="p-4">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-blue-600">${product.price.toFixed(2)}</p>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onEdit(product)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(product)}>
          Delete
        </Button>
      </div>
    </div>
  </div>
));

export default ProductsStudio;
