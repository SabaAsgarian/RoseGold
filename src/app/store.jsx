import { create } from "zustand";

const useStore = create((set) => ({
  products:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cartProducts")) || []
      : [],
  num: 0,

  // 📌 افزودن محصول به سبد خرید
  addProduct: (product) =>
    set((state) => {
      const existingProduct = state.products.find(
        (item) => item.id === product.id
      );
      let newProducts;

      if (existingProduct) {
        // افزایش تعداد محصول در سبد خرید
        newProducts = state.products.map((item) =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
        alert("Product quantity increased in cart!");
      } else {
        // افزودن محصول جدید به سبد خرید
        newProducts = [...state.products, { ...product, count: 1 }];
        alert("Product added to cart!");
      }

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 افزایش تعداد محصول در سبد خرید
  plusFromCart: (pId) =>
    set((state) => {
      const newProducts = state.products.map((item) =>
        item.id === pId ? { ...item, count: item.count + 1 } : item
      );

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 کاهش تعداد محصول از سبد خرید
  minusFromCart: (pId) =>
    set((state) => {
      let newProducts = state.products.map((item) =>
        item.id === pId ? { ...item, count: item.count - 1 } : item
      );

      // حذف محصول اگر تعداد آن 0 شود
      newProducts = newProducts.filter((item) => item.count > 0);

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 محاسبه قیمت کل سبد خرید
  totalPrice: () =>
    set((state) => {
      let total = state.products.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      return { num: total };
    }),

  // 📌 پاک کردن سبد خرید بعد از خرید
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cartProducts");
      return { products: [] };
    }),

  // 📌 ثبت سفارش و ارسال به سرور
  placeOrder: async (userToken) => {
    set(async (state) => {
      try {
        const response = await fetch("https://rosegoldgallery-back.onrender.com/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            products: state.products.map((item) => ({
              product: item.id,
              quantity: item.count,
            })),
            totalAmount: state.products.reduce(
              (sum, item) => sum + item.price * item.count,
              0
            ),
            paymentMethod: "Online",
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Order placed successfully!");
          localStorage.removeItem("cartProducts");
          return { products: [] }; // پاک کردن سبد خرید بعد از ثبت سفارش
        } else {
          alert(data.error || "Order failed!");
        }
      } catch (error) {
        console.error("Order submission failed:", error);
      }
    });
  },
}));

export default useStore;

// import { create } from 'zustand'

// const useStore = create((set) => ({
//   products: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartProducts')) || [] : [],
//   num : 0 ,
//   addProduct: (product) => set((state) => {
//     const existingProduct = state.products.find((item) => item.id === product.id);
//     let newProducts;
//     if (existingProduct) {
//       alert('Product already Added in cart!');
//       newProducts = [...state.products];
//     } else {
//       newProducts = [...state.products, product];
//        alert('Product Added in cart!');
//     }
//     localStorage.setItem('cartProducts', JSON.stringify(newProducts));
//     return { products: newProducts };
//   }),
//   plusFromCart: (pId) => set((state) => {
//     const index = state.products.findIndex((item) => item.id === pId);
//     if (index !== -1) {
//       state.products[index].count += 1;
//       const newProducts = [...state.products];
//       localStorage.setItem('cartProducts', JSON.stringify(newProducts));
//       return { products: newProducts };
//     }
//   }),
//   minusFromCart: (pId) => set((state) => {
//     const index = state.products.findIndex((item) => item.id === pId);
//     if (index >= 0) {
//       state.products[index].count -= 1;
//       let newProducts;
//       if (state.products[index].count === 0) {
//         newProducts = state.products.filter((item) => item.id !== pId);
//       } else {
//         newProducts = [...state.products];
//       }
//       localStorage.setItem('cartProducts', JSON.stringify(newProducts));
//       return { products: newProducts };
//     }
//   }),
//   totalPrice: () => set((state) => {
//     let total = 0;
//     state.products.map((item) => {
//       total += ((item.price) * (item.count));
//     });
//     return { num: total };
//   }),
// }))
// export default useStore
