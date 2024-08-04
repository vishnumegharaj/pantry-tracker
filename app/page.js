'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, getDocs, getDoc, query, doc, setDoc } from "firebase/firestore";

// Define the styles outside the component for better readability and reuse
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none', // Remove border for a cleaner look
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2, // Add rounded corners
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  backgroundImage: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)', // Use a gradient background
  overflow: 'auto',
};

const cardStyle = {
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  borderRadius: '12px', // Make borders more rounded
  backgroundColor: '#fff', // Set a distinct card background color
  padding: '20px', // Add some padding to the card
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []); // Add an empty dependency array to prevent continuous re-renders

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={containerStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="primary">
            Add Item
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
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                background: 'linear-gradient(90deg, #FFC371, #FF5F6D)',
                color: '#fff',
                borderRadius: '50px', // Make the button rounded
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF5F6D, #FFC371)',
                  boxShadow: '0 0 10px 2px rgba(255, 95, 109, 0.8)',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box sx={cardStyle}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#FFD700'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'8px 8px 0 0'} // Rounded top corners
          boxShadow={'0 4px 8px rgba(0,0,0,0.1)'} // Slight shadow for depth
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Tracker
          </Typography>
        </Box>
        <Box
          width="800px"
          height="50px"
          bgcolor={'#1E90FF'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          paddingX={'40px'}
        >
          <Typography variant={'h4'} color={'#fff'}>
            Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f8f8f8'}
              paddingX={5}
              borderRadius={1}
              boxShadow={'0 4px 8px rgba(0,0,0,0.1)'} // Add a shadow for depth
            >
              <Typography
                variant={'h5'}
                color={'#555'}
                textAlign={'left'}
                flexGrow={1}
                flexBasis="30%"
                flexShrink={0}
                fontWeight={600} // Make the text slightly bolder
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant={'h5'}
                color={'#555'}
                textAlign={'center'}
                flexGrow={1}
                flexBasis="30%"
                flexShrink={0}
                fontWeight={600}
              >
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
                sx={{
                  background: 'linear-gradient(90deg, #6DD5FA, #2980B9)',
                  color: '#fff',
                  borderRadius: '50px',
                  marginRight: 2,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2980B9, #6DD5FA)',
                    boxShadow: '0 0 10px 2px rgba(41, 128, 185, 0.8)',
                  },
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={{
                  background: 'linear-gradient(90deg, #EF9A9A, #FF1744)',
                  color: '#fff',
                  borderRadius: '50px',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF1744, #EF9A9A)',
                    boxShadow: '0 0 10px 2px rgba(255, 23, 68, 0.8)',
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(90deg, #1E9600, #FFF200, #FF0000)',
          color: '#fff',
          borderRadius: '50px',
          padding: '10px 20px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          '&:hover': {
            boxShadow: '0 0 20px 2px rgba(255, 242, 0, 0.8)',
          },
        }}
      >
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: '300px', // Increase the search bar width
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px', // Make the search bar rounded
            '&.Mui-focused': {
              borderColor: '#1E90FF',
              '& fieldset': {
                borderColor: '#1E90FF',
              },
            },
            '&:hover fieldset': {
              borderColor: '#1E90FF',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#1E90FF',
            '&.Mui-focused': {
              color: '#1E90FF',
            },
          },
        }}
      />
    </Box>
  );
}
