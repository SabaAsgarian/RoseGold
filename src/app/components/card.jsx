"use client"

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import myContext from '../myContext'; // If you still need this context
import useStore from './../store';
import '../globals.css'
export default function MultiActionAreaCard({ data }) { // Accept data as a prop
    const temp = {
        id: data._id,
        img: data.img,
        title: data.title,
        price: data.price,
        count: 1
    }
    const { addProduct } = useStore()
    return (

        <myContext.Provider value={data} key={'post' + data._id}>


            <Card sx={{minWidth: 300, maxWidth: 350, border: '1px solid black',}}>
                <CardActionArea>
                    <div style={{ backgroundColor: '#faf7f1' ,mixBlendMode:'multiply'}} className='firstt'> {/* Added div for background color */}
                        <CardMedia
                            component="img"
                            image={`https://rosegoldgallery-back.onrender.com/${data.img}`}
                            alt={data.category}
                            style={{backgroundColor: '#faf7f1' ,mixBlendMode:'multiply',height:'300px'}}
                            className='secondd'
                            loading="lazy"
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
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button onClick={() => addProduct(temp)} size="big" color="primary" sx={{
                        backgroundColor: 'black', // Set background color to black
                        color: 'white', // Set text color to white
                        width: '100%', // Set width to 100%
                        textAlign: 'center', // Center align text
                        '&:hover': {
                            backgroundColor: '#3e3e3e',
                        },
                    }}>
                        Add To Cart
                    </Button>
                </CardActions>
            </Card>
        </myContext.Provider>
    );
}
