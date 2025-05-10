"use client";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import myContext from '../myContext';
import useStore from './../store';
import '../globals.css';
// export default function Cardd({ data ,  onDelete}) {
export default function Cardd({ data }) {
    const temp = {
        id: data._id,
        img: data.img,
        title: data.title,
        price: data.price,
        category: data.category,
        count: 1,
    };

    const { addProduct } = useStore();
    const router = useRouter();

    //   const handleDelete = async () => {
    //     const confirm = window.confirm('َAre you Sure You Want To Delete This Product؟');
    //     if (confirm) {
    //       const res = await fetch(`https://rosegoldgallery-back.onrender.com/api/products/${data._id}`, {
    //         method: 'DELETE',
    //       });
    //       if (res.ok) {
    //         onDelete(data._id);
    //       }
    //     }
    //   };
    return (
        <myContext.Provider value={data} key={'post' + data._id}>
            <Card sx={{ minWidth: 300, maxWidth: 350, border: '2px solid black' }}>
                <CardActionArea>
                    <div style={{ backgroundColor: '#faf7f1', mixBlendMode: 'multiply' }} className="firstt">
                        <CardMedia
                            component="img"
                            image={`https://rosegoldgallery-back.onrender.com/${data.img}`}
                            alt={data.category}
                            style={{ backgroundColor: '#faf7f1', mixBlendMode: 'multiply', height: '300px' }}
                            className="secondd"
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            weight : {data.weight} gr
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            price : {data.price}$
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            category : {data.category || "No category!"}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            onClick={() => {
                                alert('⚠️ Are you sure? This feature is not functional yet. You can find the full code on my GitHub.');
                            }}
                            // onClick={handleDelete}
                            color="primary"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textAlign: 'center',
                                mr: 1,
                                '&:hover': {
                                    backgroundColor: 'red',
                                },
                            }}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </Button>
                        <Button
                            onClick={() => router.push(`/components/admin/edit-product?id=${data._id}`)}
                            color="primary"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textAlign: 'center',
                                '&:hover': {
                                    backgroundColor: 'blue',
                                },
                            }}
                        >
                            <EditNoteOutlinedIcon />

                        </Button>
                    </CardActions>
                </CardActionArea>
            </Card>
        </myContext.Provider>
    );
}
