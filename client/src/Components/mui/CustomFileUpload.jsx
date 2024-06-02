import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CustomFileUpload({onChange}) {
  const handleFileChange = (e) => {
    onChange(e);
  };
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
    >
      Выберите изображение
      <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
    </Button>
  );
}