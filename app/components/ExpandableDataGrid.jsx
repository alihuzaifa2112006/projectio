'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Typography,
  LinearProgress,
  IconButton,
  Collapse,
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'

const ExpandableDataGrid = ({
  columns,
  rows,
  searchFilter,
  pageSizeOptions = [5, 10, 25, 50],
  defaultPageSize = 10,
  emptyMessage = 'No data found',
  loading = false,
  renderDetail = (row) => null,
  getDetailKey = (row) => row._id || row.id,
}) => {
  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize)
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredRows = useMemo(() => {
    if (!searchFilter?.trim()) return rows
    const q = searchFilter.toLowerCase()
    return rows.filter((row) =>
      columns.some((col) => {
        const val = row[col.field]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [rows, searchFilter, columns])

  const sortedRows = useMemo(() => {
    if (!orderBy) return filteredRows
    return [...filteredRows].sort((a, b) => {
      const aVal = a[orderBy]
      const bVal = b[orderBy]
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return order === 'asc' ? cmp : -cmp
    })
  }, [filteredRows, orderBy, order])

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage
    return sortedRows.slice(start, start + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
  }

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: '#e5e7eb', borderRadius: 1, overflow: 'hidden' }}>
      {loading && <LinearProgress />}
      <TableContainer sx={{ minHeight: 420, maxHeight: 420, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: '#14532d',
                '& .MuiTableCell-root': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  bgcolor: '#14532d',
                },
              }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5, width: 48 }} />
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    py: 1.5,
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => handleSort(col.field)}
                      sx={{ color: 'white !important', '& .MuiTableSortLabel-icon': { color: 'rgba(255,255,255,0.7) !important' } }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => {
                const key = getDetailKey(row)
                const isExpanded = expanded[key]
                return (
                  <React.Fragment key={key}>
                    <TableRow sx={{ '&:hover': { bgcolor: '#f3f4f6' } }}>
                      <TableCell sx={{ py: 1.25, width: 48 }}>
                        <IconButton size="small" onClick={() => toggleExpand(key)} sx={{ p: 0.5 }}>
                          {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.field} sx={{ py: 1.25 }}>
                          {col.render ? col.render(row[col.field], row) : row[col.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} sx={{ py: 0, borderBottom: 'none', bgcolor: '#f9fafb' }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, px: 3 }}>{renderDetail(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredRows.length} row{filteredRows.length !== 1 ? 's' : ''}
        </Typography>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={pageSizeOptions}
          sx={{ '& .MuiTablePagination-toolbar': { minHeight: 40, padding: 0 } }}
        />
      </Box>
    </Box>
  )
}

export default ExpandableDataGrid
