'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '/firebase.js';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import Upload from './upload.js';


// set up popup box style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {

  // useEffect(()=>{
  //   onSnapshot( collection(firestore,'pantry'),(snapshot)=>
  //   console.log(snapshot.docs))
  // })

  // modal set up -> popup box
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); // For tracking popup box
  const [itemName, setItemName] = useState(''); // For Add item
  const [itemNameFind, setItemNameFind] = useState(''); // For Add item
  const [itemQuantity, setItemQuantity] = useState(1); // For item quantity **
  const [queryOpen, setQueryOpen] = useState(false); // For tracking query popup box
  const [queryResult, setQueryResult] = useState('');
  const [imageOpen, setImageOpen] = useState(false); // For tracking query popup box

  // Handling modal(popup box) open and close
  const handleOpen = () => setOpen(true); // open popup box
  const handleClose = () => setOpen(false); // close popup box

  // Handling modal(popup box) open and close
  const queryBoxOpen = () => setQueryOpen(true); // open popup box
  const queryBoxClose = () => setQueryOpen(false); // close popup box

   // Handling modal(popup box) open and close
   const imageBoxOpen = () => setImageOpen(true); // open popup box
   const imageBoxClose = () => setImageOpen(false); // close popup box

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(inventoryList) 
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // build add function
  const addItem = async (itemName) => {
    const docRef = doc(firestore, "pantry", itemName); // itemName as the ID
    await setDoc(docRef, { name: itemName, quantity: 1 }); // Set quantity as 1, or another initial value
    updateInventory(); // Refresh inventory after adding
  };


  const removeItem = async (itemName) => {
    const docRef = doc(firestore, "pantry", itemName);
    await deleteDoc(docRef);
    updateInventory(); // Refresh inventory after removing
  };


  // Function to update item quantity **
  const updateItem = async (itemName, newQuantity) => {
    const docRef = doc(firestore, "pantry", itemName);
    await setDoc(docRef, { quantity: newQuantity }, { merge: true });
    updateInventory(); // Refresh inventory after updating
  };

  const getQuantity = (name) => {
    const item = inventory.find(entry => entry.name === name);
    return item ? item.quantity : 'Item not found';
  };

  useEffect(() => {
    setQueryResult(getQuantity(itemNameFind));
  }, [itemNameFind, inventory]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setItemQuantity(value);
    }
  };

  

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {/* Popup box */}
      <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title-add" variant="h6" component="h2">
            Add or Update Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={handleQuantityChange} // make sure it at least 1
              inputProps={{ min: 1}}
            />
            {/* Add Update Button */}
            <Button
              variant="outlined"
              onClick={() => {
                updateItem(itemName, itemQuantity);

                // Reset info after adding item
                setItemName('');
                setItemQuantity(1);
                handleClose();
              }}
            >
              {inventory.some(item => item.name === itemName) ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>


      {/* Popup box for query */}
      <Modal 
        open={queryOpen}
        onClose={queryBoxClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title-find" variant="h6" component="h2">
            Find item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              label="Item"
              variant="outlined"
              fullWidth
              value={itemNameFind}
              onChange={(e) => setItemNameFind(e.target.value)}
            />
            <Box sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {queryResult}
              </Box>
          </Stack>
        </Box>
      </Modal>

      {/* popup box for Image upload */}
      <Modal 
        open={imageOpen}
        onClose={imageBoxClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title-upload" variant="h6" component="h2">
            Upload Image Here
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <div>
              <Upload />
            </div>
          </Stack>
        </Box>
      </Modal>

      {/* image upload button */}
      <Button variant="contained" onClick={imageBoxOpen}>
        Upload Image
      </Button>

      {/* Query Item button */}
      <Button variant="contained" onClick={queryBoxOpen}>
        Find Item
      </Button>

      {/* Add New Item button */}
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              {/* place items from query */}
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
