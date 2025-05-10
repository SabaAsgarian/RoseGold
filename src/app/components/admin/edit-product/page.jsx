"use client"
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Loading from "./loading";

export const dynamic = 'force-dynamic';

function EditProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", weight: "", description: "", category: "" });

  useEffect(() => {
    fetch(`https://rosegoldgallery-back.onrender.com/api/products`)
      .then(res => res.json())
      .then(data => {
        const item = data.find(p => p._id === id);
        setProduct(item);
        setForm(item);
      });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch(`https://rosegoldgallery-back.onrender.com/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Product edited!");
      router.push('/components/admin/products');
    }
  };

  if (!product) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <h2 style={{fontSize:'25px'}}> Edit Product</h2>
      <TextField name="title" label="title" fullWidth margin="normal" value={form.title} onChange={handleChange} />
      <TextField name="price" label="price" fullWidth margin="normal" value={form.price} onChange={handleChange} />
      <TextField name="weight" label="weight" fullWidth margin="normal" value={form.weight} onChange={handleChange} />
      <TextField name="description" label="description" fullWidth margin="normal" value={form.description} onChange={handleChange} />
      <TextField name="category" label="category" fullWidth margin="normal" value={form.category} onChange={handleChange} />

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Save Changes </Button>
    </Box>
  );
}

export default function EditProduct() {
  return (
    <Suspense fallback={<Loading />}>
      <EditProductContent />
    </Suspense>
  );
}
