import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { IMaskInput } from 'react-imask';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'black',
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
          },
          '& input': {
            color: 'black',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'black',
          },
          '& input[type=number]': {
            MozAppearance: 'textfield', // исправлено
            '&::-webkit-outer-spin-button': {
              WebkitAppearance: 'none', // исправлено
              margin: 0,
            },
            '&::-webkit-inner-spin-button': {
              WebkitAppearance: 'none', // исправлено
              margin: 0,
            },
          },
        },
      },
    },
  },
});


function CustomTextField({onSend, error, helperText, header, value, isMulti, type}) {

  const handleChange = (e) => {
    onSend(e.target.value)
  }

  const textFieldStyle = {
    width: '100%', // Установите ширину в 100%
  };

  return (
    <ThemeProvider theme={theme}>
      <TextField
        id="outlined-basic"
        label={header}
        variant="outlined"
        onChange={handleChange}
        value={value}
        error={error}
        helperText={helperText}
        multiline={isMulti ? isMulti : false}
        type={type ? type : 'text'}
        style={textFieldStyle}
      />
    </ThemeProvider>
  );
}

export default CustomTextField;
