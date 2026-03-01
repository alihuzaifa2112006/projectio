'use client'

import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  confirmColor = 'error',
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          p: 0,
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.1rem', fontWeight: 600, pb: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: 'none' }}>{cancelText}</Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          sx={{ textTransform: 'uppercase', borderRadius: 1, px: 2 }}
        >
          {loading ? 'Please wait...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
