import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// const style = {
//     position: 'absolute',
//     top: '50%', left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400, bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };
export default function ModalView({ data, modelOpen, setModalOpen }) {
    console.log('data', data)
    const Close = (ele) => {
        setModalOpen(false)
    }
    return (
        <div>
            <Modal open={modelOpen} onClose={() => Close(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
                <div className="w-2/5 mx-auto mt-[15rem]">
                    <Card >
                        <CardMedia className='object-fill' sx={{ height: 300 }} image={data.images} title="green iguana" />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div"> {data.make} </Typography>
                            <Typography variant="body2" > Name: {data.model} </Typography>
                            <Typography variant="body2" > Year: {data.year} </Typography>
                            <Typography variant="body2" > Price: {data.price} </Typography>
                            <Typography variant="body2" > Mileage: {data.mileage} </Typography>
                            <Typography variant="body2" > Status: {data.status} </Typography>
                        </CardContent>
                        <CardActions className="flex justify-end mx-4">
                            <Button size="small" onClick={() => Close(false)}>Close</Button>
                        </CardActions>
                    </Card>
                </div>
            </Modal>
        </div>
    );
}