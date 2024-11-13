"use client";
import { useEffect, useState, memo } from "react";
import axios from "axios";
import Image from "next/image";

const ProductsStudio = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleAddImagesClick = (product) => {
    setEditingProduct(product);
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

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: productId }),
      });

      if (response.ok) {
        alert("Product deleted successfully");
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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
          onDelete={handleDelete}
          onAddImagesClick={handleAddImagesClick}
        />
      ))}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                type="text"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="mt-1 block w-full min-h-28 h-fit px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price:</label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Images:</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingProduct.images.map((img) => (
                  <div key={img} className="relative">
                    <img src={img} alt="Product" className="w-20 h-20 rounded object-cover" />
                    <button onClick={() => handleRemoveImage(img)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Add New Images:</label>
              <input type="file" multiple onChange={handleImageChange} className="mt-1 block w-full text-gray-900" />
              <div className="mt-2 flex gap-2 flex-wrap">
                {newImages.map((file, index) => (
                  <div key={index} className="relative">
                    <Image src={URL.createObjectURL(file)} alt="Preview" width={20} height={20} className="w-20 h-20 rounded object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" disabled={isUpdating} className={`px-4 py-2 rounded-md ${isUpdating ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const ProductCard = memo(({ product, onEdit, onDelete, onAddImagesClick }) => (
  <div className="bg-white border w-[250px] border-gray-200 rounded-lg shadow-md overflow-hidden">
    {product.images.length > 0 ? (
      <div className="flex justify-center w-full h-[100px]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain transition-transform hover:scale-105" />
      </div>
    ) : (
      <div
        className="w-full h-48 flex items-center justify-center bg-gray-100 cursor-pointer"
        onClick={() => onAddImagesClick(product)}
      >
        <span className="text-4xl text-gray-400">+</span>
      </div>
    )}
    <div className="p-4 flex flex-col justify-between gap-2">
      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
      <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
      <div className="flex justify-between gap-2">
        <button
          onClick={() => onEdit(product)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
));

export default ProductsStudio;
