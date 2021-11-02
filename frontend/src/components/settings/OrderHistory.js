import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Chip from "@material-ui/core/Chip"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"

import { UserContext } from "../../contexts"

const useStyles = makeStyles(theme => ({
  item: {
    height: "100%",
    width: "100%",
  },
  chipLabel: {
    fontWeight: 600,
  },
  "@global": {
    ".MuiDataGrid-root .MuiDataGrid-colCellTitle": {
      "font-weight": 600,
    },
    ".MuiDataGrid-root .MuiDataGrid-columnSeparator": {
      display: "none  ",
    },
    ".MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer": {
      "justify-content": "center",
    },
    ".MuiDataGrid-root .MuiDataGrid-columnHeader--moving": {
      "background-color": "transparent",
    },
    ".MuiDataGrid-root .MuiDataGrid-renderingZone": {
      "max-height": "100% !important",
    },
    ".MuiDataGrid-root .MuiDataGrid-cell": {
      "white-space": "pre-wrap",
      "max-height": "100% !important",
      "line-height": "initial !important",
      padding: "1rem",
      "padding-right": "calc(1rem + 26px)",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "font-weight": 600,
    },
    ".MuiDataGrid-root .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer":
      {
        "justify-content": "center",
      },
    ".MuiDataGrid-root .MuiDataGrid-row": {
      "max-height": "100% !important",
    },
    ".MuiDataGrid-root .MuiDataGrid-footerContainer": {
      "margin-top": "-12rem",
    },
    ".MuiTablePagination-caption": {
      color: "#fff",
    },
    ".MuiSvgIcon-root": {
      fill: "#fff",
    },
  },
}))

export default function OrderHistory() {
  const classes = useStyles()

  // initial state for component
  const [orders, setOrders] = useState([])
  const { user } = useContext(UserContext)

  // pull order history from Strapi on page load
  useEffect(() => {
    axios
      .get(process.env.GATSBY_STRAPI_URL + "/orders/history", {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        console.log(response)
        setOrders(response.data.orders)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  // populate data for the data grid rows
  const createData = data =>
    data.map(item => ({
      shipping: `${item.shippingInfo.name}\n${item.shippingAddress.street}\n${item.shippingAddress.city}, ${item.shippingAddress.state} ${item.shippingAddress.zip}`,
      order: `#${item.id
        .slice(item.id.length - 10, item.id.length)
        .toUpperCase()}`,
      status: item.status.toUpperCase(),
      date: `${item.createdAt.split("-")[1]}/${
        item.createdAt.split("-")[2].split("T")[0]
      }/${item.createdAt.split("-")[0]}`,
      total: item.total,
      id: item.id,
    }))

  const columns = [
    { field: "shipping", headerName: "Shipping", flex: 1, sortable: false },
    { field: "order", headerName: "Order", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ value }) => (
        <Chip label={value} classes={{ label: classes.chipLabel }} />
      ),
    },
    { field: "date", headerName: "Date", flex: 1, type: "date" },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: ({ value }) => (
        <Chip label={`$${value}`} classes={{ label: classes.chipLabel }} />
      ),
    },
    { field: "", flex: 1.5, sortable: false },
  ]

  const rows = createData(orders)

  return (
    <Grid item classes={{ root: classes.item }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} align="center" />
    </Grid>
  )
}
